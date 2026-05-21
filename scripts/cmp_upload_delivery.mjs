#!/usr/bin/env node
/**
 * Upload a finished b-roll delivery package directly into Content Master Pro.
 *
 * This is the editor-safe path: it uses the local deliverables/upload folder
 * plus Supabase credentials, without requiring a private CMP repo checkout.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import { promises as fsp } from "node:fs";
import os from "node:os";
import path from "node:path";

const SCHEMA_VERSION = 1;
const DEFAULT_PUBLICATION_SLUG = "core_substack";
const PROJECT_ASSET_FILE_BUCKET = "project-assets";

const USAGE = `Usage:
  node scripts/cmp_upload_delivery.mjs --deliverables-dir /path/to/deliverables/upload --project-name "Video title" --dry-run
  node scripts/cmp_upload_delivery.mjs --deliverables-dir /path/to/deliverables/upload --project-name "Video title" --yes

Options:
  --deliverables-dir <path>     Required. Finished b-roll deliverables/upload folder.
  --project-id <id>             Optional CMP projects.id UUID or projects.project_id.
  --project-name <name>         Optional project name when creating or renaming the target project.
  --publication-slug <slug>     Optional publication slug. Defaults to core_substack.
  --env-file <path>             Optional env file. Defaults to ~/.codex/.env when present.
  --allow-local                 Allow live ingest into a local Supabase URL.
  --dry-run                     Parse and print the upload plan without Supabase writes or uploads.
  --yes                         Required for live upload. Never combine with --dry-run.

Required env for live upload:
  CMP_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL
  CMP_SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_ROLE_KEY
  CMP_SYNC_USER_ID or SYNC_USER_ID is optional but recommended.
`;

const ROLE_DEFINITIONS = {
  transcript: {
    label: "Human-readable transcript",
    description: "Final transcript exported by the b-roll delivery pipeline.",
    required: true,
    sortOrder: 10,
    expectedFilenames: ["transcript.md", "transcript.txt", "human_readable_transcript.md"],
  },
  youtube_description: {
    label: "YouTube description",
    description: "Final YouTube upload description.",
    required: true,
    sortOrder: 20,
    expectedFilenames: ["youtube_description.md", "youtube-description.md", "description_youtube.md"],
  },
  podcast_description: {
    label: "Podcast description",
    description: "Final podcast/Acast description.",
    required: true,
    sortOrder: 30,
    expectedFilenames: ["podcast_description.md", "podcast-description.md", "description_podcast.md"],
  },
  youtube_video: {
    label: "YouTube final video",
    description: "Final 16:9 YouTube video file.",
    required: true,
    sortOrder: 40,
    expectedFilenames: ["youtube_final.mp4", "final_youtube.mp4", "youtube.mp4"],
  },
  substack_video: {
    label: "Substack final video",
    description: "Final Substack video file.",
    required: true,
    sortOrder: 50,
    expectedFilenames: ["substack_final.mp4", "final_substack.mp4", "substack.mp4"],
  },
  podcast_audio: {
    label: "Podcast audio",
    description: "Final podcast MP3.",
    required: true,
    sortOrder: 60,
    expectedFilenames: ["podcast.mp3", "podcast_audio.mp3", "final_podcast.mp3"],
  },
  preview_audio: {
    label: "Podcast preview audio",
    description: "Sub-60-second podcast preview MP3.",
    required: true,
    sortOrder: 70,
    expectedFilenames: ["podcast_preview.mp3", "preview.mp3", "podcast-preview.mp3"],
  },
  youtube_captions_srt: {
    label: "YouTube captions SRT",
    description: "Final YouTube captions file in SubRip format.",
    required: true,
    sortOrder: 80,
    expectedFilenames: ["youtube_captions.srt", "youtube-captions.srt", "captions.srt"],
  },
  readme_manifest: {
    label: "README manifest",
    description: "Human-facing delivery manifest.",
    required: true,
    sortOrder: 90,
    expectedFilenames: ["README_MANIFEST.md"],
  },
  broll_manifest: {
    label: "B-roll manifest",
    description: "B-roll generation manifest and QC context.",
    required: true,
    sortOrder: 100,
    expectedFilenames: ["broll_manifest.md"],
  },
  qc_notes: {
    label: "QC notes",
    description: "Optional delivery quality-control notes.",
    required: false,
    sortOrder: 110,
    expectedFilenames: ["QC_NOTES.md", "qc_notes.md", "qc-notes.md"],
  },
};

const TEXT_ROLES = new Set([
  "transcript",
  "youtube_description",
  "podcast_description",
  "youtube_captions_srt",
  "readme_manifest",
  "broll_manifest",
  "qc_notes",
]);

const VIDEO_EXTENSIONS = new Set([".mp4", ".mov", ".m4v", ".webm"]);
const AUDIO_EXTENSIONS = new Set([".mp3", ".m4a", ".wav", ".aac", ".ogg"]);
const TEXT_EXTENSIONS = new Set([".md", ".txt", ".srt"]);

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.deliverablesDir) {
    console.log(USAGE);
    process.exit(args.help ? 0 : 1);
  }

  if (args.dryRun && args.yes) {
    throw new Error("Use either --dry-run or --yes, not both.");
  }
  if (!args.dryRun && !args.yes) {
    throw new Error("Refusing live upload without --yes. Run --dry-run first, then repeat with --yes.");
  }

  const plan = await buildDeliveryPlan({
    deliverablesDir: args.deliverablesDir,
    projectName: args.projectName,
    publicationSlug: args.publicationSlug,
  });

  console.log("=== CMP B-roll Direct Upload ===");
  console.log("");
  for (const line of summarizePlan(plan)) console.log(line);

  if (plan.warnings.length > 0) {
    console.log("");
    console.log("Warnings:");
    for (const warning of plan.warnings) console.log(`  - ${warning}`);
  }

  if (plan.errors.length > 0) {
    console.log("");
    console.log("Errors:");
    for (const error of plan.errors) console.log(`  - ${error}`);
    process.exit(1);
  }

  if (args.dryRun) {
    printDryRun(plan, args);
    return;
  }

  loadEnv(args.envFile);
  const client = createSupabaseClient(args.allowLocal);
  const createdBy = await resolveCreatedBy(client);
  const publication = await resolvePublication(client, plan.publicationSlug);
  const project = await upsertProject(client, plan, args, publication, createdBy);

  console.log("");
  console.log(`Target project: ${project.name} (${project.project_id}, ${project.id})`);

  let createdAssets = 0;
  let updatedAssets = 0;
  let uploadedFiles = 0;
  let reusedFiles = 0;

  for (const assetPlan of plan.assetPlans) {
    const { asset, created } = await getOrCreateAsset(client, project, assetPlan);
    if (created) createdAssets += 1;

    const attachedFiles = [];
    for (const file of assetPlan.files) {
      const result = await upsertStorageFile(client, project, asset, plan, file, createdBy);
      attachedFiles.push({ file, row: result.row });
      if (result.uploaded) uploadedFiles += 1;
      else reusedFiles += 1;
    }

    const changed = await finalizeAsset(client, project, asset, assetPlan, plan, attachedFiles, {
      created,
      createdBy,
    });
    if (!created && changed) updatedAssets += 1;

    console.log(
      `  ${created ? "created" : changed ? "updated" : "unchanged"} asset: ${assetPlan.name} (${attachedFiles.length} file(s))`
    );
  }

  console.log("");
  console.log("Done.");
  console.log(`  Project: ${project.project_id}`);
  console.log(`  Assets created: ${createdAssets}`);
  console.log(`  Assets updated: ${updatedAssets}`);
  console.log(`  Files uploaded: ${uploadedFiles}`);
  console.log(`  Files reused: ${reusedFiles}`);
}

function parseArgs(argv) {
  const args = {
    deliverablesDir: null,
    projectId: null,
    projectName: null,
    publicationSlug: null,
    envFile: null,
    allowLocal: false,
    dryRun: false,
    yes: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const raw = argv[index];
    if (!raw || raw === "--") continue;
    const [flag, inlineValue] = raw.includes("=") ? raw.split(/=(.*)/s, 2) : [raw, null];
    const nextValue = inlineValue ?? argv[index + 1] ?? null;

    switch (flag) {
      case "--deliverables-dir":
        args.deliverablesDir = requireValue(flag, nextValue);
        if (inlineValue === null) index += 1;
        break;
      case "--project-id":
        args.projectId = requireValue(flag, nextValue);
        if (inlineValue === null) index += 1;
        break;
      case "--project-name":
        args.projectName = requireValue(flag, nextValue);
        if (inlineValue === null) index += 1;
        break;
      case "--publication-slug":
        args.publicationSlug = requireValue(flag, nextValue);
        if (inlineValue === null) index += 1;
        break;
      case "--env-file":
        args.envFile = requireValue(flag, nextValue);
        if (inlineValue === null) index += 1;
        break;
      case "--allow-local":
        args.allowLocal = true;
        break;
      case "--dry-run":
        args.dryRun = true;
        break;
      case "--yes":
        args.yes = true;
        break;
      case "--help":
      case "-h":
        args.help = true;
        break;
      default:
        throw new Error(`Unknown argument: ${raw}\n\n${USAGE}`);
    }
  }

  return args;
}

function requireValue(flag, value) {
  if (!value || value.startsWith("--")) {
    throw new Error(`${flag} requires a value.`);
  }
  return value;
}

async function buildDeliveryPlan(options) {
  const deliverablesDir = path.resolve(expandHome(options.deliverablesDir));
  const warnings = [];
  const errors = [];

  const dirStat = await statIfExists(deliverablesDir);
  if (!dirStat?.isDirectory()) {
    return {
      deliverablesDir,
      manifestPath: null,
      manifest: null,
      packageKey: "",
      deliveryId: "",
      projectName: options.projectName?.trim() || "",
      publicationSlug: options.publicationSlug?.trim() || DEFAULT_PUBLICATION_SLUG,
      files: [],
      assetPlans: [],
      warnings,
      errors: [`Deliverables directory does not exist: ${deliverablesDir}`],
    };
  }

  const manifestPath = path.join(deliverablesDir, "delivery_manifest.json");
  const manifest = (await statIfExists(manifestPath))?.isFile()
    ? await readManifest(manifestPath, errors)
    : null;
  const allFiles = await listRelativeFiles(deliverablesDir);
  const specs = collectFileSpecs(deliverablesDir, allFiles, manifest, warnings, errors);

  const files = [];
  for (const spec of specs) {
    const absolutePath = safeResolve(deliverablesDir, spec.relativePath);
    if (!absolutePath) {
      errors.push(`Manifest path escapes deliverables directory: ${spec.relativePath}`);
      continue;
    }

    const stat = await statIfExists(absolutePath);
    if (!stat?.isFile()) {
      const definition = spec.role === "short_video" ? null : ROLE_DEFINITIONS[spec.role];
      const message = `${definition?.required || spec.role === "short_video" ? "Missing" : "Optional"} file for ${spec.role}: ${spec.relativePath}`;
      if (definition?.required || spec.role === "short_video") errors.push(message);
      else warnings.push(message);
      continue;
    }

    const filename = path.basename(absolutePath);
    const mimeType = inferMimeType(filename);
    const kind = getAssetFileKind(filename, mimeType);
    const sha256 = await hashFile(absolutePath);
    const textContent = TEXT_ROLES.has(spec.role) ? await fsp.readFile(absolutePath, "utf8") : null;

    files.push({
      role: spec.role,
      roleKey: spec.roleKey,
      relativePath: normalizeRelativePath(path.relative(deliverablesDir, absolutePath)),
      absolutePath,
      filename,
      label: spec.label,
      description: spec.description,
      mimeType,
      kind,
      sizeBytes: stat.size,
      sha256,
      sortOrder: spec.sortOrder,
      textContent,
      short: spec.short,
    });
  }

  const packageSeed =
    manifest?.delivery_id ||
    manifest?.project?.source_video_title ||
    options.projectName ||
    path.basename(deliverablesDir);
  const packageKey = normalizePackageKey(packageSeed);
  const projectName =
    options.projectName?.trim() ||
    manifest?.project?.name?.trim() ||
    manifest?.project?.source_video_title?.trim() ||
    prettifyName(path.basename(deliverablesDir));
  const publicationSlug =
    options.publicationSlug?.trim() ||
    manifest?.project?.publication_slug?.trim() ||
    DEFAULT_PUBLICATION_SLUG;
  const deliveryId = manifest?.delivery_id?.trim() || packageKey;
  const assetPlans = buildAssetPlans(files);

  return {
    deliverablesDir,
    manifestPath: manifest ? manifestPath : null,
    manifest,
    packageKey,
    deliveryId,
    projectName,
    publicationSlug,
    files,
    assetPlans,
    warnings,
    errors,
  };
}

function collectFileSpecs(deliverablesDir, allFiles, manifest, warnings, errors) {
  const specs = [];
  const seenRoleKeys = new Set();

  for (const role of Object.keys(ROLE_DEFINITIONS)) {
    const definition = ROLE_DEFINITIONS[role];
    const manifestPath = manifest?.files?.[role];
    const relativePath = manifestPath || findConventionalFile(allFiles, role);

    if (!relativePath) {
      const message = `No ${role} file found. Expected one of: ${definition.expectedFilenames.join(", ")}`;
      if (definition.required) errors.push(message);
      else warnings.push(message);
      continue;
    }

    specs.push({
      role,
      roleKey: role,
      relativePath,
      label: definition.label,
      description: definition.description,
      sortOrder: definition.sortOrder,
    });
    seenRoleKeys.add(role);
  }

  const manifestShorts = manifest?.shorts ?? [];
  if (manifestShorts.length > 0) {
    manifestShorts.forEach((short, index) => {
      const id = normalizeShortId(short.id || `short_${String(index + 1).padStart(2, "0")}`);
      const roleKey = `short_video:${id}`;
      if (seenRoleKeys.has(roleKey)) return;
      seenRoleKeys.add(roleKey);
      specs.push({
        role: "short_video",
        roleKey,
        relativePath: short.path,
        label: `Short ${String(index + 1).padStart(2, "0")}`,
        description: "Vertical short video exported by the b-roll delivery pipeline.",
        sortOrder: 200 + index,
        short: {
          id,
          title: short.title?.trim() || null,
          durationSeconds:
            typeof short.duration_seconds === "number" ? short.duration_seconds : null,
          platforms: short.platforms?.length
            ? short.platforms
            : ["tiktok", "instagram", "youtube_shorts"],
          metadata: short.metadata ?? {},
        },
      });
    });
    return specs;
  }

  const fallbackShorts = findShortVideoFiles(deliverablesDir, allFiles);
  if (fallbackShorts.length === 0) {
    warnings.push("No vertical shorts found. Expected MP4/MOV files under shorts/ or vertical_shorts/.");
  }

  fallbackShorts.forEach((relativePath, index) => {
    const id = normalizeShortId(path.basename(relativePath, path.extname(relativePath)));
    specs.push({
      role: "short_video",
      roleKey: `short_video:${id}`,
      relativePath,
      label: `Short ${String(index + 1).padStart(2, "0")}`,
      description: "Vertical short video exported by the b-roll delivery pipeline.",
      sortOrder: 200 + index,
      short: {
        id,
        title: null,
        durationSeconds: null,
        platforms: ["tiktok", "instagram", "youtube_shorts"],
        metadata: {},
      },
    });
  });

  return specs;
}

function buildAssetPlans(files) {
  const plans = new Map();

  for (const file of files) {
    const identity = assetIdentityForRole(file.role);
    const existing = plans.get(identity.assetKey);
    if (existing) {
      existing.files.push(file);
      existing.contentMode = combineContentMode(existing.contentMode, contentModeForRole(file.role));
      continue;
    }

    plans.set(identity.assetKey, {
      ...identity,
      status: "final",
      contentMode: contentModeForRole(file.role),
      files: [file],
    });
  }

  return [...plans.values()].map((plan) => ({
    ...plan,
    files: plan.files.sort(
      (left, right) => left.sortOrder - right.sortOrder || left.filename.localeCompare(right.filename)
    ),
  }));
}

function assetIdentityForRole(role) {
  switch (role) {
    case "transcript":
      return assetIdentity("transcript", "youtube", "main", "Transcript");
    case "youtube_description":
      return assetIdentity("description", "youtube", "main", "YouTube description");
    case "podcast_description":
      return assetIdentity("description", "podcast", "main", "Podcast description");
    case "youtube_video":
      return assetIdentity("video", "youtube", "final", "YouTube final video");
    case "substack_video":
      return assetIdentity("video", "substack", "final", "Substack final video");
    case "podcast_audio":
      return assetIdentity("audio", "podcast", "final", "Podcast audio");
    case "preview_audio":
      return assetIdentity("audio", "podcast", "preview", "Podcast preview audio");
    case "youtube_captions_srt":
      return assetIdentity("transcript", "youtube", "captions", "YouTube captions SRT");
    case "short_video":
      return assetIdentity("video", "instagram", "shorts", "Vertical shorts package");
    case "readme_manifest":
    case "broll_manifest":
    case "qc_notes":
      return assetIdentity("field_notes", "pre-production", "broll-delivery", "B-roll manifest and QC notes");
    default:
      throw new Error(`Unknown b-roll role: ${role}`);
  }
}

function assetIdentity(assetType, platform, variant, name) {
  return {
    assetKey: [assetType, platform ?? "none", variant ?? "none"].join(":"),
    assetType,
    platform,
    variant,
    name,
  };
}

function contentModeForRole(role) {
  if (role === "readme_manifest" || role === "broll_manifest" || role === "qc_notes") {
    return "mixed";
  }
  return TEXT_ROLES.has(role) ? "text" : "media";
}

function combineContentMode(current, next) {
  if (current === next) return current;
  return "mixed";
}

function summarizePlan(plan) {
  const lines = [
    `Project: ${plan.projectName}`,
    `Publication: ${plan.publicationSlug}`,
    `Package key: ${plan.packageKey}`,
    `Delivery ID: ${plan.deliveryId}`,
    `Manifest: ${plan.manifestPath ? path.basename(plan.manifestPath) : "not found; using filename discovery"}`,
    `Assets: ${plan.assetPlans.length}`,
    `Files: ${plan.files.length}`,
  ];

  for (const assetPlan of plan.assetPlans) {
    lines.push(
      `  - ${assetPlan.assetType}/${assetPlan.platform ?? "none"}/${assetPlan.variant ?? "none"}: ${assetPlan.files.length} file(s)`
    );
  }

  return lines;
}

function printDryRun(plan, args) {
  const projectHumanId = args.projectId || buildHumanProjectId(new Date(), plan.packageKey);
  console.log("");
  console.log("[dry-run] No Supabase writes or Storage uploads will be performed.");
  console.log(`[dry-run] Project ${args.projectId ? "would update" : "would create/update"}: ${projectHumanId}`);
  console.log("");
  console.log("[dry-run] Asset/file mapping:");

  for (const assetPlan of plan.assetPlans) {
    const assetId = assetIdForPlan(projectHumanId, assetPlan);
    console.log(`  - ${assetId}`);
    console.log(
      `    asset_type=${assetPlan.assetType} platform=${assetPlan.platform ?? "null"} variant=${assetPlan.variant ?? "null"} status=final`
    );
    for (const file of assetPlan.files) {
      console.log(`    file: ${file.relativePath} -> ${file.kind} (${file.mimeType}, ${file.sizeBytes} bytes)`);
    }
  }
}

function loadEnv(envFile) {
  const defaultEnv = path.join(os.homedir(), ".codex", ".env");
  if (fs.existsSync(defaultEnv)) loadEnvFile(defaultEnv);
  if (envFile) loadEnvFile(path.resolve(expandHome(envFile)), true);
}

function loadEnvFile(envPath, override = false) {
  const body = fs.readFileSync(envPath, "utf8");
  for (const line of body.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = stripShellQuotes(trimmed.slice(separator + 1).trim());
    if (key && (override || process.env[key] === undefined)) {
      process.env[key] = value;
    }
  }
}

function stripShellQuotes(value) {
  if (
    (value.startsWith("'") && value.endsWith("'")) ||
    (value.startsWith('"') && value.endsWith('"'))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function createSupabaseClient(allowLocal) {
  const supabaseUrl = process.env.CMP_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.CMP_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing CMP_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or CMP_SUPABASE_SERVICE_ROLE_KEY/SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  if (!allowLocal && isLocalSupabaseUrl(supabaseUrl)) {
    throw new Error("Refusing live upload into local Supabase. Use --allow-local for an intentional local test.");
  }

  return {
    supabaseUrl: supabaseUrl.replace(/\/$/, ""),
    serviceRoleKey,
  };
}

async function resolveCreatedBy(client) {
  const configured = process.env.CMP_SYNC_USER_ID || process.env.SYNC_USER_ID;
  if (configured) return configured;

  const response = await supabaseFetch(client, "/auth/v1/admin/users?page=1&per_page=1", {
    rawPath: true,
  });
  const first = response?.users?.[0];
  if (!first?.id) {
    throw new Error("No auth users found. Set CMP_SYNC_USER_ID or SYNC_USER_ID in ~/.codex/.env.");
  }
  return first.id;
}

async function resolvePublication(client, publicationSlug) {
  const rows = await restRequest(client, "publications", {
    query: {
      select: "id,slug,name",
      slug: `eq.${publicationSlug}`,
      supports_projects: "eq.true",
      limit: "1",
    },
  });

  const publication = rows[0];
  if (!publication) {
    throw new Error(`Publication '${publicationSlug}' was not found or does not support projects.`);
  }
  return publication;
}

async function upsertProject(client, plan, args, publication, createdBy) {
  const existing = args.projectId
    ? await findProjectByInputId(client, args.projectId)
    : await findProjectByPackageKey(client, plan.packageKey);
  const metadata = buildProjectMetadata(existing?.metadata ?? {}, plan);

  if (existing) {
    const updates = {
      name: plan.projectName,
      metadata,
      status: preserveProjectStatus(existing.status),
    };
    const rows = await restRequest(client, "projects", {
      method: "PATCH",
      query: { id: `eq.${existing.id}`, select: "*" },
      body: updates,
      prefer: "return=representation",
    });
    return rows[0];
  }

  const projectId = await generateAvailableProjectId(client, plan);
  const rows = await restRequest(client, "projects", {
    method: "POST",
    query: { select: "*" },
    body: {
      project_id: projectId,
      name: plan.projectName,
      publication_id: publication.id,
      status: "review",
      scheduled_date: null,
      metadata,
      created_by: createdBy,
    },
    prefer: "return=representation",
  });
  return rows[0];
}

async function findProjectByInputId(client, projectId) {
  const queryKey = isUuid(projectId) ? "id" : "project_id";
  const rows = await restRequest(client, "projects", {
    query: { select: "*", [queryKey]: `eq.${projectId}`, limit: "1" },
  });
  return rows[0] ?? null;
}

async function findProjectByPackageKey(client, packageKey) {
  const rows = await restRequest(client, "projects", {
    query: {
      select: "*",
      metadata: `cs.${JSON.stringify({ broll_delivery: { package_key: packageKey } })}`,
      limit: "1",
    },
  });
  return rows[0] ?? null;
}

async function generateAvailableProjectId(client, plan) {
  const today = new Date();
  const base = buildHumanProjectId(today, plan.packageKey);
  const suffixSeed = `${plan.packageKey}-${plan.deliveryId}`;

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const candidate =
      attempt === 0 ? base : buildHumanProjectId(today, `${suffixSeed}-${String(attempt)}`);
    const rows = await restRequest(client, "projects", {
      query: { select: "id", project_id: `eq.${candidate}`, limit: "1" },
    });
    if (!rows[0]) return candidate;
  }

  throw new Error("Could not find an available project_id after 20 attempts.");
}

async function getOrCreateAsset(client, project, assetPlan) {
  const assetId = assetIdForPlan(project.project_id, assetPlan);
  const existingRows = await restRequest(client, "project_assets", {
    query: {
      select: "*",
      asset_id: `eq.${assetId}`,
      deleted_at: "is.null",
      limit: "1",
    },
  });
  const existing = existingRows[0];
  if (existing) return { asset: existing, created: false };

  const rows = await restRequest(client, "project_assets", {
    method: "POST",
    query: { select: "*" },
    body: {
      project_id: project.id,
      asset_id: assetId,
      name: assetPlan.name,
      asset_type: assetPlan.assetType,
      platform: assetPlan.platform,
      variant: assetPlan.variant,
      content: null,
      file_url: null,
      status: "final",
      version: 1,
      metadata: {},
    },
    prefer: "return=representation",
  });
  return { asset: rows[0], created: true };
}

async function upsertStorageFile(client, project, asset, plan, file, createdBy) {
  const storagePath = buildBrollStoragePath(project.id, asset.id, file);
  const existingRows = await restRequest(client, "project_asset_files", {
    query: {
      select: "*",
      project_asset_id: `eq.${asset.id}`,
      "metadata->>broll_role_key": `eq.${file.roleKey}`,
      deleted_at: "is.null",
      order: "created_at.asc",
    },
  });
  const existing = existingRows[0] ?? null;
  const existingMetadata = existing?.metadata ?? {};
  const shouldUpload =
    !existing ||
    existing.storage_path !== storagePath ||
    existingMetadata.sha256 !== file.sha256 ||
    existingMetadata.size_bytes !== file.sizeBytes;

  if (shouldUpload) {
    await uploadFileToStorage(client, file, storagePath);
  }

  const rowPayload = {
    project_asset_id: asset.id,
    kind: file.kind,
    label: file.label,
    description: file.description,
    filename: file.filename,
    mime_type: file.mimeType,
    size_bytes: file.sizeBytes,
    storage_bucket: PROJECT_ASSET_FILE_BUCKET,
    storage_path: storagePath,
    external_url: null,
    sort_order: file.sortOrder,
    metadata: {
      source: "broll_delivery_package",
      broll_role: file.role,
      broll_role_key: file.roleKey,
      delivery_id: plan.deliveryId,
      package_key: plan.packageKey,
      relative_path: file.relativePath,
      sha256: file.sha256,
      size_bytes: file.sizeBytes,
      short: file.short ?? null,
    },
    created_by: existing?.created_by ?? createdBy,
  };

  if (existing) {
    if (stableStringify(pickComparableFileRow(existing)) === stableStringify(rowPayload)) {
      return { row: existing, uploaded: shouldUpload };
    }

    const rows = await restRequest(client, "project_asset_files", {
      method: "PATCH",
      query: { id: `eq.${existing.id}`, select: "*" },
      body: rowPayload,
      prefer: "return=representation",
    });
    return { row: rows[0], uploaded: shouldUpload };
  }

  const rows = await restRequest(client, "project_asset_files", {
    method: "POST",
    query: { select: "*" },
    body: rowPayload,
    prefer: "return=representation",
  });
  return { row: rows[0], uploaded: shouldUpload };
}

function pickComparableFileRow(row) {
  return {
    project_asset_id: row.project_asset_id,
    kind: row.kind,
    label: row.label,
    description: row.description,
    filename: row.filename,
    mime_type: row.mime_type,
    size_bytes: row.size_bytes,
    storage_bucket: row.storage_bucket,
    storage_path: row.storage_path,
    external_url: row.external_url,
    sort_order: row.sort_order,
    metadata: row.metadata ?? {},
    created_by: row.created_by,
  };
}

async function uploadFileToStorage(client, file, storagePath) {
  const encodedPath = storagePath.split("/").map(encodeURIComponent).join("/");
  const url = `${client.supabaseUrl}/storage/v1/object/${PROJECT_ASSET_FILE_BUCKET}/${encodedPath}`;

  async function send(method) {
    const stream = fs.createReadStream(file.absolutePath);
    return fetch(url, {
      method,
      headers: {
        apikey: client.serviceRoleKey,
        Authorization: `Bearer ${client.serviceRoleKey}`,
        "Content-Type": file.mimeType,
        "Content-Length": String(file.sizeBytes),
        "x-upsert": "true",
      },
      body: stream,
      duplex: "half",
    });
  }

  let response = await send("POST");
  if (!response.ok && response.status === 409) {
    response = await send("PUT");
  }
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Storage upload failed for ${file.relativePath}: ${response.status} ${body}`);
  }
}

async function finalizeAsset(client, project, asset, assetPlan, plan, uploadedFiles, options) {
  const content = renderAssetContent(
    assetPlan,
    uploadedFiles.map(({ file, row }) => ({
      roleKey: file.roleKey,
      fileId: row.id,
      kind: row.kind,
    }))
  );
  const primaryFile = uploadedFiles[0]?.row ?? null;
  const fileUrl =
    primaryFile?.storage_bucket && primaryFile.storage_path
      ? `supabase://${primaryFile.storage_bucket}/${primaryFile.storage_path}`
      : null;
  const metadata = buildAssetMetadata(asset.metadata ?? {}, assetPlan, plan, uploadedFiles);
  const status = preserveAssetStatus(asset.status);
  const nextVersion = options.created ? 1 : (asset.version || 1) + 1;

  const changed =
    options.created ||
    asset.name !== assetPlan.name ||
    asset.content !== content ||
    asset.file_url !== fileUrl ||
    asset.status !== status ||
    stableStringify(asset.metadata ?? {}) !== stableStringify(metadata);

  if (!changed) return false;

  const updatedRows = await restRequest(client, "project_assets", {
    method: "PATCH",
    query: { id: `eq.${asset.id}`, select: "*" },
    body: {
      name: assetPlan.name,
      content,
      file_url: fileUrl,
      status,
      metadata,
      version: nextVersion,
    },
    prefer: "return=representation",
  });
  const updated = updatedRows[0];

  try {
    await restRequest(client, "asset_versions", {
      method: "POST",
      body: {
        asset_id: asset.id,
        version_number: nextVersion,
        name: updated.name,
        content: updated.content,
        file_url: updated.file_url,
        metadata: updated.metadata ?? {},
        change_description: options.created
          ? "Initial b-roll delivery ingest"
          : "Updated from b-roll delivery package ingest",
        created_by: options.createdBy,
      },
      prefer: "return=minimal",
    });
  } catch (error) {
    if (!String(error.message || error).includes("23505")) {
      console.warn(`Failed to save version for ${asset.asset_id}: ${error.message}`);
    }
  }

  return true;
}

function renderAssetContent(plan, fileRows = []) {
  if (plan.contentMode === "text" && plan.files.length === 1) {
    return plan.files[0]?.textContent ?? "";
  }

  if (plan.contentMode === "mixed") {
    return plan.files
      .map((file) => {
        const body = file.textContent?.trim() || "_No text content found._";
        return `## ${file.label}\n\n${body}`;
      })
      .join("\n\n---\n\n");
  }

  const rowByRole = new Map(fileRows.map((row) => [row.roleKey, row]));
  const sections = plan.files.map((file) => {
    const row = rowByRole.get(file.roleKey);
    const tokenType = row?.kind === "download" ? "download" : "media";
    const token = row ? `{{${tokenType}:${row.fileId}}}` : "_File will be attached by ingest._";
    const title = file.short?.title ? `${file.label}: ${file.short.title}` : file.label;
    return `## ${title}\n\n${file.description}\n\n${token}`;
  });

  return `# ${plan.name}\n\n${sections.join("\n\n")}`;
}

function buildProjectMetadata(existingMetadata, plan) {
  return {
    ...existingMetadata,
    broll_delivery: {
      source: "broll_delivery_package",
      schema_version: plan.manifest?.schema_version ?? null,
      delivery_id: plan.deliveryId,
      package_key: plan.packageKey,
      manifest_present: Boolean(plan.manifestPath),
      source_video_title: plan.manifest?.project?.source_video_title ?? null,
      source_video_path: plan.manifest?.project?.source_video_path ?? null,
      external_ids: plan.manifest?.project?.external_ids ?? {},
    },
  };
}

function buildAssetMetadata(existingMetadata, assetPlan, plan, uploadedFiles) {
  return {
    ...existingMetadata,
    source: "broll_delivery_package",
    broll_delivery: {
      delivery_id: plan.deliveryId,
      package_key: plan.packageKey,
      asset_key: assetPlan.assetKey,
      schema_version: plan.manifest?.schema_version ?? null,
      files: uploadedFiles.map(({ file, row }) => ({
        role: file.role,
        role_key: file.roleKey,
        relative_path: file.relativePath,
        sha256: file.sha256,
        size_bytes: file.sizeBytes,
        storage_bucket: row.storage_bucket,
        storage_path: row.storage_path,
      })),
    },
  };
}

async function restRequest(client, table, options = {}) {
  return supabaseFetch(client, `/rest/v1/${table}`, options);
}

async function supabaseFetch(client, rawPath, options = {}) {
  const url = new URL(options.rawPath ? `${client.supabaseUrl}${rawPath}` : `${client.supabaseUrl}${rawPath}`);
  if (options.query) {
    for (const [key, value] of Object.entries(options.query)) {
      if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
    }
  }

  const headers = {
    apikey: client.serviceRoleKey,
    Authorization: `Bearer ${client.serviceRoleKey}`,
    ...options.headers,
  };
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (options.prefer) headers.Prefer = options.prefer;

  const response = await fetch(url, {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${options.method ?? "GET"} ${url.pathname} failed: ${response.status} ${body}`);
  }

  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function readManifest(manifestPath, errors) {
  try {
    const parsed = JSON.parse(await fsp.readFile(manifestPath, "utf8"));
    if (!parsed || typeof parsed !== "object") {
      errors.push("delivery_manifest.json must be a JSON object.");
      return null;
    }
    if (parsed.schema_version !== SCHEMA_VERSION) {
      errors.push(`Unsupported delivery_manifest.json schema_version: ${String(parsed.schema_version)}. Expected ${SCHEMA_VERSION}.`);
      return null;
    }
    return parsed;
  } catch (error) {
    errors.push(`Failed to parse delivery_manifest.json: ${error.message}`);
    return null;
  }
}

function findConventionalFile(allFiles, role) {
  const definition = ROLE_DEFINITIONS[role];
  for (const expected of definition.expectedFilenames) {
    const exact = allFiles.find((file) => path.basename(file).toLowerCase() === expected.toLowerCase());
    if (exact) return exact;
  }
  return allFiles.find((file) => matchesRole(file, role)) ?? null;
}

function matchesRole(relativePath, role) {
  const base = path.basename(relativePath).toLowerCase();
  const ext = path.extname(base);
  const parts = relativePath.toLowerCase().split("/");

  switch (role) {
    case "transcript":
      return TEXT_EXTENSIONS.has(ext) && ext !== ".srt" && base.includes("transcript");
    case "youtube_description":
      return TEXT_EXTENSIONS.has(ext) && base.includes("youtube") && base.includes("description");
    case "podcast_description":
      return TEXT_EXTENSIONS.has(ext) && base.includes("podcast") && base.includes("description");
    case "youtube_video":
      return VIDEO_EXTENSIONS.has(ext) && base.includes("youtube") && !base.includes("short");
    case "substack_video":
      return VIDEO_EXTENSIONS.has(ext) && base.includes("substack");
    case "podcast_audio":
      return AUDIO_EXTENSIONS.has(ext) && base.includes("podcast") && !base.includes("preview");
    case "preview_audio":
      return AUDIO_EXTENSIONS.has(ext) && base.includes("preview");
    case "youtube_captions_srt":
      return ext === ".srt" && (base.includes("caption") || base.includes("youtube") || parts.includes("captions"));
    case "readme_manifest":
      return base === "readme_manifest.md";
    case "broll_manifest":
      return base === "broll_manifest.md";
    case "qc_notes":
      return TEXT_EXTENSIONS.has(ext) && base.includes("qc");
    default:
      return false;
  }
}

function findShortVideoFiles(deliverablesDir, allFiles) {
  return allFiles
    .filter((file) => {
      const ext = path.extname(file).toLowerCase();
      if (!VIDEO_EXTENSIONS.has(ext)) return false;
      const normalized = file.toLowerCase();
      const base = path.basename(normalized);
      if (base.includes("youtube") || base.includes("substack")) return false;
      return (
        normalized.includes("/shorts/") ||
        normalized.includes("/vertical_shorts/") ||
        normalized.includes("/shorts_upload_clean/") ||
        base.includes("short")
      );
    })
    .sort((left, right) =>
      left.localeCompare(right, undefined, {
        numeric: true,
        sensitivity: "base",
      })
    )
    .map((file) => normalizeRelativePath(path.relative(deliverablesDir, path.resolve(deliverablesDir, file))));
}

async function listRelativeFiles(root) {
  const results = [];

  async function walk(dir) {
    const entries = await fsp.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
      const absolute = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(absolute);
      else if (entry.isFile()) results.push(normalizeRelativePath(path.relative(root, absolute)));
    }
  }

  await walk(root);
  return results.sort((left, right) => left.localeCompare(right));
}

async function hashFile(absolutePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const stream = fs.createReadStream(absolutePath);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(hash.digest("hex")));
  });
}

async function statIfExists(targetPath) {
  try {
    return await fsp.stat(targetPath);
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
}

function safeResolve(root, relativePath) {
  const resolved = path.resolve(root, relativePath);
  const normalizedRoot = path.resolve(root);
  if (resolved === normalizedRoot || resolved.startsWith(`${normalizedRoot}${path.sep}`)) return resolved;
  return null;
}

function inferMimeType(filename) {
  switch (path.extname(filename).toLowerCase()) {
    case ".md":
      return "text/markdown";
    case ".txt":
      return "text/plain";
    case ".srt":
      return "application/x-subrip";
    case ".mp4":
      return "video/mp4";
    case ".mov":
      return "video/quicktime";
    case ".m4v":
      return "video/x-m4v";
    case ".webm":
      return "video/webm";
    case ".mp3":
      return "audio/mpeg";
    case ".m4a":
      return "audio/mp4";
    case ".wav":
      return "audio/wav";
    case ".aac":
      return "audio/aac";
    case ".ogg":
      return "audio/ogg";
    case ".zip":
      return "application/zip";
    case ".json":
      return "application/json";
    default:
      return "application/octet-stream";
  }
}

function getAssetFileKind(filename, mimeType) {
  const mime = mimeType.toLowerCase();
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  const ext = path.extname(filename).replace(/^\./, "").toLowerCase();
  if (["png", "jpg", "jpeg", "gif", "webp", "avif", "svg"].includes(ext)) return "image";
  if (["mp4", "mov", "webm", "m4v"].includes(ext)) return "video";
  if (["mp3", "wav", "m4a", "aac", "ogg"].includes(ext)) return "audio";
  return "download";
}

function buildHumanProjectId(date, packageKey) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const digest = crypto.createHash("sha1").update(packageKey).digest("hex").slice(0, 3);
  return `${year}${month}${day}_${digest}`;
}

function assetIdForPlan(projectHumanId, plan) {
  return buildAssetId(projectHumanId, plan.assetType, plan.platform, plan.variant);
}

function buildAssetId(projectId, assetType, platform, variant) {
  const parts = [projectId, assetType];
  if (platform) parts.push(platform);
  if (variant) parts.push(variant);
  return parts.join("_");
}

function buildBrollStoragePath(projectUuid, assetUuid, file) {
  const roleFolder = sanitizePathSegment(file.role === "short_video" ? "shorts" : file.role);
  const fingerprint = file.sha256.slice(0, 12);
  return [
    "projects",
    projectUuid,
    "assets",
    assetUuid,
    "broll",
    roleFolder,
    `${fingerprint}-${sanitizeFilename(file.filename)}`,
  ].join("/");
}

function sanitizeFilename(filename) {
  const safe = (filename.trim() || "download")
    .replace(/[/\\?%*:|"<>]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return safe || "download";
}

function normalizePackageKey(value) {
  const normalized = String(value || "broll-delivery")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return normalized || "broll-delivery";
}

function normalizeShortId(value) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "short"
  );
}

function sanitizePathSegment(value) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-|-$/g, "") || "file"
  );
}

function normalizeRelativePath(value) {
  return value.split(path.sep).join("/");
}

function prettifyName(value) {
  const cleaned = value.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  return cleaned ? cleaned.replace(/\b\w/g, (letter) => letter.toUpperCase()) : "B-roll delivery";
}

function preserveProjectStatus(status) {
  if (status === "published" || status === "scheduled" || status === "archived") return status;
  return "review";
}

function preserveAssetStatus(status) {
  if (status === "published" || status === "archived") return status;
  return "final";
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function isLocalSupabaseUrl(value) {
  try {
    const url = new URL(value);
    return ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
  } catch {
    return false;
  }
}

function expandHome(value) {
  if (value === "~") return os.homedir();
  if (value.startsWith("~/")) return path.join(os.homedir(), value.slice(2));
  return value;
}

function stableStringify(value) {
  return JSON.stringify(sortJsonValue(value));
}

function sortJsonValue(value) {
  if (Array.isArray(value)) return value.map(sortJsonValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, nestedValue]) => [key, sortJsonValue(nestedValue)])
    );
  }
  return value;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
