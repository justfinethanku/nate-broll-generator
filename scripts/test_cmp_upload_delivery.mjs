#!/usr/bin/env node
/**
 * End-to-end smoke test for scripts/cmp_upload_delivery.mjs.
 *
 * Spins up a tiny fake Supabase HTTP server, creates a temporary
 * deliverables/upload folder, and runs the uploader with --yes. This proves
 * the live upload code path without mutating CMP production.
 */

import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import http from "node:http";
import { promises as fsp } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const state = {
  project: {
    id: "existing-project-1",
    project_id: "20260520_existing",
    name: "Test Video",
    publication_id: "publication-1",
    status: "review",
    metadata: {},
    created_at: "2026-05-20T12:00:00Z",
  },
  projects: [],
  assets: new Map(),
  fileRows: [],
  assetVersions: [],
  storageUploads: [],
  ids: {
    project: 0,
    asset: 0,
    file: 0,
  },
};

state.projects.push(state.project);

const server = http.createServer(async (req, res) => {
  try {
    assert.equal(req.headers.apikey, "test-service-role");
    assert.equal(req.headers.authorization, "Bearer test-service-role");

    const url = new URL(req.url ?? "/", "http://127.0.0.1");

    if (url.pathname.startsWith("/storage/v1/object/project-assets/")) {
      await readBodyBuffer(req);
      state.storageUploads.push(decodeURIComponent(url.pathname));
      return sendJson(res, 200, { ok: true });
    }

    if (!url.pathname.startsWith("/rest/v1/")) {
      return sendJson(res, 404, { error: "not found" });
    }

    const table = url.pathname.replace("/rest/v1/", "");
    const body = await readJson(req);

    if (req.method === "GET" && table === "publications") {
      return sendJson(res, 200, [
        { id: "publication-1", slug: "core_substack", name: "Core Substack" },
      ]);
    }

    if (req.method === "GET" && table === "projects") {
      if (url.searchParams.has("metadata")) return sendJson(res, 200, []);
      if (url.searchParams.has("project_id")) return sendJson(res, 200, []);
      if (url.searchParams.has("publication_id") && url.searchParams.has("name")) {
        const nameFilter = (url.searchParams.get("name") ?? "").replace(/^ilike\./, "");
        const publicationId = (url.searchParams.get("publication_id") ?? "").replace(/^eq\./, "");
        return sendJson(
          res,
          200,
          state.projects.filter(
            (project) =>
              project.publication_id === publicationId &&
              project.name.toLowerCase() === nameFilter.toLowerCase()
          )
        );
      }
      return sendJson(res, 200, state.projects);
    }

    if (req.method === "POST" && table === "projects") {
      state.project = {
        id: `project-${++state.ids.project}`,
        ...body,
        metadata: body.metadata ?? {},
      };
      state.projects.push(state.project);
      return sendJson(res, 201, [state.project]);
    }

    if (req.method === "PATCH" && table === "projects") {
      const idFilter = url.searchParams.get("id") ?? "";
      const projectId = idFilter.replace(/^eq\./, "");
      state.project = { ...(state.projects.find((project) => project.id === projectId) ?? state.project), ...body };
      state.projects = state.projects.map((project) =>
        project.id === state.project.id ? state.project : project
      );
      return sendJson(res, 200, [state.project]);
    }

    if (req.method === "GET" && table === "project_assets") {
      return sendJson(res, 200, []);
    }

    if (req.method === "POST" && table === "project_assets") {
      const asset = {
        id: `asset-${++state.ids.asset}`,
        ...body,
        metadata: body.metadata ?? {},
      };
      state.assets.set(asset.id, asset);
      return sendJson(res, 201, [asset]);
    }

    if (req.method === "PATCH" && table === "project_assets") {
      const idFilter = url.searchParams.get("id") ?? "";
      const assetId = idFilter.replace(/^eq\./, "");
      const asset = { ...(state.assets.get(assetId) ?? { id: assetId }), ...body };
      state.assets.set(asset.id, asset);
      return sendJson(res, 200, [asset]);
    }

    if (req.method === "GET" && table === "project_asset_files") {
      return sendJson(res, 200, []);
    }

    if (req.method === "POST" && table === "project_asset_files") {
      const row = {
        id: `file-${++state.ids.file}`,
        ...body,
        metadata: body.metadata ?? {},
      };
      state.fileRows.push(row);
      return sendJson(res, 201, [row]);
    }

    if (req.method === "POST" && table === "asset_versions") {
      state.assetVersions.push(body);
      res.statusCode = 201;
      return res.end();
    }

    return sendJson(res, 404, { table, method: req.method });
  } catch (error) {
    return sendJson(res, 500, { error: error instanceof Error ? error.message : String(error) });
  }
});

const port = await listen(server);
const tmpRoot = await fsp.mkdtemp(path.join(os.tmpdir(), "cmp-upload-test-"));

try {
  const uploadDir = await createTestPackage(tmpRoot);
  const output = await runUploader(port, uploadDir);

  assert.match(output, /Done\./);
  assert.match(output, /Matched existing CMP project by title/);
  assert.match(output, /Files uploaded: 11/);
  assert.equal(state.projects.length, 1);
  assert.equal(state.ids.project, 0);
  assert.equal(state.project.project_id, "20260520_existing");
  assert.equal(
    state.project.metadata.broll_delivery.package_key,
    "test-video",
    "existing project should receive b-roll metadata"
  );
  assert.equal(state.assets.size, 10);
  assert.equal(state.fileRows.length, 11);
  assert.equal(state.assetVersions.length, 10);
  assert.equal(state.storageUploads.length, 11);

  console.log("cmp_upload_delivery smoke test passed.");
  console.log(`  Assets: ${state.assets.size}`);
  console.log(`  File rows: ${state.fileRows.length}`);
  console.log(`  Storage uploads: ${state.storageUploads.length}`);
} finally {
  server.close();
  await fsp.rm(tmpRoot, { recursive: true, force: true });
}

function listen(targetServer) {
  return new Promise((resolve) => {
    targetServer.listen(0, "127.0.0.1", () => {
      resolve(targetServer.address().port);
    });
  });
}

async function runUploader(port, uploadDir) {
  const child = spawn(
    process.execPath,
    [
      path.join(repoRoot, "scripts", "cmp_upload_delivery.mjs"),
      "--deliverables-dir",
      uploadDir,
      "--project-name",
      "Test Video",
      "--publication-slug",
      "core_substack",
      "--allow-local",
      "--yes",
    ],
    {
      cwd: repoRoot,
      env: {
        ...process.env,
        CMP_SUPABASE_URL: `http://127.0.0.1:${port}`,
        CMP_SUPABASE_SERVICE_ROLE_KEY: "test-service-role",
        CMP_SYNC_USER_ID: "user-1",
      },
      stdio: ["ignore", "pipe", "pipe"],
    }
  );

  const stdout = [];
  const stderr = [];
  child.stdout.on("data", (chunk) => stdout.push(chunk));
  child.stderr.on("data", (chunk) => stderr.push(chunk));

  const code = await new Promise((resolve) => child.on("close", resolve));
  const output = Buffer.concat(stdout).toString("utf8");
  const errorOutput = Buffer.concat(stderr).toString("utf8");
  if (code !== 0) {
    throw new Error(`Uploader exited ${code}\nSTDOUT:\n${output}\nSTDERR:\n${errorOutput}`);
  }
  return output;
}

async function createTestPackage(tmpRoot) {
  const upload = path.join(tmpRoot, "deliverables", "upload");
  await fsp.mkdir(path.join(upload, "shorts"), { recursive: true });

  await fsp.writeFile(path.join(upload, "transcript.md"), "# Transcript\n\nHello world.\n");
  await fsp.writeFile(path.join(upload, "youtube_description.md"), "YouTube description\n");
  await fsp.writeFile(path.join(upload, "podcast_description.md"), "Podcast description\n");
  await fsp.writeFile(
    path.join(upload, "youtube_captions.srt"),
    "1\n00:00:00,000 --> 00:00:01,000\nHello.\n"
  );
  await fsp.writeFile(path.join(upload, "README_MANIFEST.md"), "# Readme\n");
  await fsp.writeFile(path.join(upload, "broll_manifest.md"), "# B-roll\n");
  await fsp.writeFile(path.join(upload, "youtube_final.mp4"), "fake youtube video");
  await fsp.writeFile(path.join(upload, "substack_final.mp4"), "fake substack video");
  await fsp.writeFile(path.join(upload, "podcast.mp3"), "fake podcast audio");
  await fsp.writeFile(path.join(upload, "podcast_preview.mp3"), "fake preview audio");
  await fsp.writeFile(path.join(upload, "shorts", "short_01.mp4"), "fake short");
  await fsp.writeFile(
    path.join(upload, "delivery_manifest.json"),
    `${JSON.stringify(
      {
        schema_version: 1,
        delivery_id: "test-video",
        project: {
          name: "Test Video",
          publication_slug: "core_substack",
          source_video_title: "Test Video",
          external_ids: {},
        },
        files: {
          transcript: "transcript.md",
          youtube_description: "youtube_description.md",
          podcast_description: "podcast_description.md",
          youtube_video: "youtube_final.mp4",
          substack_video: "substack_final.mp4",
          podcast_audio: "podcast.mp3",
          preview_audio: "podcast_preview.mp3",
          youtube_captions_srt: "youtube_captions.srt",
          readme_manifest: "README_MANIFEST.md",
          broll_manifest: "broll_manifest.md",
        },
        shorts: [
          {
            id: "short_01",
            title: "Test Short",
            path: "shorts/short_01.mp4",
            duration_seconds: 9,
            platforms: ["tiktok", "instagram", "youtube_shorts"],
            metadata: {},
          },
        ],
        metadata: {},
      },
      null,
      2
    )}\n`
  );

  return upload;
}

async function readJson(req) {
  const body = await readBodyBuffer(req);
  if (!body.length) return null;
  return JSON.parse(body.toString("utf8"));
}

function readBodyBuffer(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("error", reject);
    req.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

function sendJson(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}
