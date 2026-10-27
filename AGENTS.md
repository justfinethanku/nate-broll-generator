- Team page: none (personal repo, no team in the fleet registry)
- [Fleet Handbook](https://linear.app/contentionmedia/document/the-fleet-handbook-f3713ba1f434)
- [Operating system index](https://linear.app/contentionmedia/document/the-operating-system-index-of-rules-templates-and-sops-3766418ca97b)

# B-Roll Pipeline — Codex Instructions

You are operating inside the `nate-broll-generator` repository. This is an automated b-roll pipeline for Nate Jones Media videos. Your job is to help the user set up, maintain, and run the pipeline.

---

## First-Time Setup (Do This Automatically)

When a user opens Codex in this repo for the first time, **proactively check if setup has been completed** by verifying:

1. `~/.codex/.env` contains `BROLL_HOME=` pointing to this repo
2. `~/.codex/skills/nate-broll-production/SKILL.md` exists
3. `~/.codex/skills/broll-pipeline/SKILL.md` exists
4. `~/.codex/skills/radio-edit/SKILL.md` exists
5. `~/.codex/plugins/nate-broll-production/.codex-plugin/plugin.json` exists
6. `~/.codex/agents/broll-scout.md` exists
7. `~/.codex/agents/broll-builder.md` exists
8. `node_modules/` exists inside `remotion/`
9. `assets/Youtube Chyron.mov` and `assets/Substack Chyron.mov` exist

**If any of items 1-8 are missing**, run the setup automatically:

```bash
REPO_ROOT="$(pwd)"

# Install Remotion dependencies
cd "$REPO_ROOT/remotion" && pnpm install

# Install Codex configuration (skill + agents + BROLL_HOME env var)
bash "$REPO_ROOT/Codex/install.sh" "$REPO_ROOT"
```

**If chyrons (item 9) are missing**, inform the user:
> "The chyron overlay files aren't in `assets/` yet. These are the branded lower-thirds for YouTube and Substack deliverables (~15 GB total). Ask Jon for the download link and place them in `assets/`."

**If `ASSEMBLYAI_API_KEY` is not in `~/.codex/.env`**, inform the user:
> "No AssemblyAI API key found. You'll need this for video transcription. Ask Jon for the key, then I can add it to `~/.codex/.env`."

---

## Claude Code

This file is also the Claude Code instruction file: `CLAUDE.md` imports it. Claude Code uses the same pipeline installed under `~/.claude/` instead of `~/.codex/`:

- **Setup check** (on a first open in Claude Code, check proactively): `~/.claude/.env` contains `BROLL_HOME=` pointing to this repo; `~/.claude/skills/broll-pipeline/SKILL.md`, `~/.claude/agents/broll-scout.md` and `~/.claude/agents/broll-builder.md` exist; `remotion/node_modules/` exists; the chyron files exist. If any of the env file, the skill, the agents or `remotion/node_modules/` are missing, run `cd "$BROLL_HOME/remotion" && pnpm install`, then `bash "$BROLL_HOME/claude/install.sh"`.
- **Install or update:** `bash claude/install.sh` copies `claude/skills/broll-pipeline/SKILL.md` and `claude/agents/` to `~/.claude/`, and sets `BROLL_HOME` in `~/.claude/.env`. Re-run it after any edit under `claude/`.
- **Run:** from the video's own folder, `/broll-pipeline video.mp4` or "run the b-roll process on this video". The pipeline should not be run from inside this repo.
- **Keys:** `ASSEMBLYAI_API_KEY` lives in `~/.claude/.env`. Never commit it.
- **Update:** `cd "$BROLL_HOME" && git pull && bash claude/install.sh`; re-run `pnpm install` in `remotion/` if its `package.json` changed.

**If `ASSEMBLYAI_API_KEY` is not in `~/.claude/.env`**, inform the user:
> "No AssemblyAI API key found. You'll need this for video transcription. Ask Jon for the key, then I can add it to `~/.claude/.env`."

The Hard Rules and Troubleshooting sections below apply to both.

## What This Repo Contains

```
remotion/                  Standalone Remotion project for rendering b-roll clips
  src/broll/shared.tsx     THE contract — BRollTemplate, OB1 palette, animations
  src/broll/_examples/     Reference components (read-only, for studying patterns)
  src/Root.tsx             Composition registry (add new videos here)
  public/logos/            3,428 brand SVG logos + catalog.json + aliases.json

Codex/                    Codex configuration source files
  skills/nate-broll-production/SKILL.md  Top-level production router
  skills/broll-pipeline/SKILL.md    Pipeline orchestration skill
  skills/radio-edit/SKILL.md        Transcript-driven rough-cut skill
  plugins/nate-broll-production/    Plugin-style package for the router
  agents/broll-scout.md             Scout prompt wrapper
  agents/broll-builder.md           Builder prompt wrapper
  install.sh                        Copies config to ~/.codex/ and wires shell env

claude/                    Claude Code configuration source files; the Codex skill also reuses its legacy prompts
  skills/broll-pipeline/SKILL.md    Pipeline orchestration skill
  agents/broll-scout.md             Moment selection agent
  agents/broll-builder.md           Component generation agent
  install.sh                        Copies config to ~/.claude/

scripts/                   Python automation
  multi_composite.py       FFmpeg dual-output compositing + chyrons
  composite_broll.py       Single-output compositing variant
  eval_scout_manifest.py   Manifest validation
  eval_builder_output.py   Component validation

assets/                    Large binary files (not in git)
  Youtube Chyron.mov       ProRes 4444 alpha overlay (9.5 GB)
  Substack Chyron.mov      ProRes 4444 alpha overlay (5.8 GB)

docs/                      Human-readable documentation
```

---

## Key Environment Variable

`BROLL_HOME` — absolute path to this repository's root. Stored in `~/.codex/.env`. The install script also adds a small zsh hook so new shells load it automatically.

For Claude Code, it is stored in `~/.claude/.env`. All paths in the skill, agents, and Python scripts reference this variable. The install script sets it automatically.

---

## How to Install/Update the Skill and Agents

The skill and agent source files live in `Codex/` within this repo. To install or update them on the current machine:

```bash
bash Codex/install.sh
```

This copies:
- `Codex/skills/nate-broll-production/SKILL.md` → `~/.codex/skills/nate-broll-production/SKILL.md`
- `Codex/skills/broll-pipeline/SKILL.md` → `~/.codex/skills/broll-pipeline/SKILL.md`
- `Codex/skills/radio-edit/SKILL.md` → `~/.codex/skills/radio-edit/SKILL.md`
- `Codex/plugins/nate-broll-production/` → `~/.codex/plugins/nate-broll-production/`
- `Codex/agents/broll-scout.md` → `~/.codex/agents/broll-scout.md`
- `Codex/agents/broll-builder.md` → `~/.codex/agents/broll-builder.md`

And ensures `BROLL_HOME` is set in `~/.codex/.env`.

If the user edits the skill or agents in `Codex/`, always re-run `install.sh` to propagate changes.

---

## Running the B-Roll Pipeline

The pipeline is invoked by naming the installed Codex skill or asking for the workflow in plain English. Since the skill is installed at `~/.codex/skills/`, it works from any directory — not just this repo.

**Typical usage:**
1. User has a video file somewhere (e.g., `~/Videos/project/video.mp4`)
2. User opens Codex in that video's directory
3. User says `Use $nate-broll-production on video.mp4` or "run the Nate production workflow on this video"
4. The router decides the stage and calls the right specialist path

Use `$nate-broll-production` as the default front door:

- raw recording → `$radio-edit` package → editor imports/reviews/exports a clean edit
- clean edit export → `$broll-pipeline` → b-roll approval gate
- final composites → `deliverables/upload/`
- clean upload folder → CMP handoff verification

Use `$radio-edit` or `$broll-pipeline` directly only when the stage is already known.

**If the user asks to run the pipeline from within this repo directory**, remind them:
> "The pipeline should be run from the directory containing your source video, not from the repo itself. Should I help you navigate to your video project folder?"

---

## Updating from GitHub

When Jon pushes updates:

```bash
cd "$BROLL_HOME"
git pull
bash Codex/install.sh
```

If `remotion/package.json` changed:
```bash
cd "$BROLL_HOME/remotion"
pnpm install
```

---

## Adding API Keys

If the user needs to add or update API keys:

```bash
# Add/update AssemblyAI key
# Edit ~/.codex/.env and set:
ASSEMBLYAI_API_KEY=the_key_value
```

Never commit API keys to this repo. They live only in `~/.codex/.env`.

---

## Remotion Project Management

### TypeScript Compilation Check
```bash
cd "$BROLL_HOME/remotion"
pnpm exec tsc --noEmit
```

### Launch Remotion Studio (for previewing clips)
```bash
cd "$BROLL_HOME/remotion"
pnpm studio
```

### Render a Single Clip
```bash
cd "$BROLL_HOME/remotion"
eval "$(/opt/homebrew/bin/brew shellenv)"
pnpm exec remotion render src/index.ts CLIP-ID output.mp4 --codec h264 --crf 23 --muted
```

### Register New Video Batch in Root.tsx

After builder agents create component files, add them to `src/Root.tsx`:

1. Create batch aggregator (if builders didn't already):
   ```typescript
   // src/broll/XXBatch.tsx
   import { XX_CLIPS_A } from "./XX_ClipsA";
   import { XX_CLIPS_B } from "./XX_ClipsB";
   export const XX_COMPS = [...XX_CLIPS_A, ...XX_CLIPS_B];
   ```

2. Add to Root.tsx:
   ```typescript
   import { XX_COMPS } from "./broll/XXBatch";
   // Add to BROLL_COMPS array:
   ...XX_COMPS,
   ```

---

## Hard Rules (Never Violate)

1. **Never render in parallel** — Chrome instances conflict. Always sequential.
2. **Always use h264 codec** — h265 crashes on Apple Silicon.
3. **Never hardcode absolute paths** — always use `$BROLL_HOME` relative paths.
4. **Never commit API keys or .env files** — they're in `.gitignore`.
5. **Never commit chyron .mov files** — they're in `.gitignore` (too large for git).
6. **Never modify shared.tsx without understanding the downstream impact** — every component depends on it.

---

## Troubleshooting Common Issues

| Issue | Fix |
|-------|-----|
| `BROLL_HOME` not set | Run `bash Codex/install.sh` |
| Skill not found in Codex | Run `bash Codex/install.sh` |
| `pnpm: command not found` | Run `npm install -g pnpm` |
| TypeScript errors after pull | Run `cd remotion && pnpm install && pnpm exec tsc --noEmit` |
| Chyron files missing | Download from Jon's shared link into `assets/` |
| Logo renders as white box | Check slug in `remotion/public/logos/aliases.json` |
| Permission denied on scripts | Run `chmod +x setup.sh Codex/install.sh` |
| `BROLL_HOME` not set (Claude Code) | Run `bash claude/install.sh` |
| Skill not found in Claude | Run `bash claude/install.sh` |
| Permission denied on scripts (Claude Code) | Run `chmod +x setup.sh claude/install.sh` |

---

## For the User

If this is your first time using this pipeline, I can:
- Run the full setup for you (install dependencies, configure everything)
- Walk you through processing your first video
- Explain what each part of the pipeline does
- Help troubleshoot any issues

Just ask.
