# B-Roll Pipeline — Claude Code Instructions

You are operating inside the `nate-broll-generator` repository. This is an automated b-roll pipeline for Nate Jones Media videos. Your job is to help the user set up, maintain, and run the pipeline.

---

## First-Time Setup (Do This Automatically)

When a user opens Claude Code in this repo for the first time, **proactively check if setup has been completed** by verifying:

1. `~/.claude/.env` contains `BROLL_HOME=` pointing to this repo
2. `~/.claude/skills/broll-pipeline/SKILL.md` exists
3. `~/.claude/agents/broll-scout.md` exists
4. `~/.claude/agents/broll-builder.md` exists
5. `node_modules/` exists inside `remotion/`
6. `assets/Youtube Chyron.mov` and `assets/Substack Chyron.mov` exist

**If any of items 1-5 are missing**, run the setup automatically:

```bash
# Install Remotion dependencies
cd "$BROLL_HOME/remotion" && pnpm install

# Install Claude Code configuration (skill + agents + BROLL_HOME env var)
bash "$BROLL_HOME/claude/install.sh"
```

**If chyrons (item 6) are missing**, inform the user:
> "The chyron overlay files aren't in `assets/` yet. These are the branded lower-thirds for YouTube and Substack deliverables (~15 GB total). Ask Jon for the download link and place them in `assets/`."

**If `ASSEMBLYAI_API_KEY` is not in `~/.claude/.env`**, inform the user:
> "No AssemblyAI API key found. You'll need this for video transcription. Ask Jon for the key, then I can add it to `~/.claude/.env`."

---

## What This Repo Contains

```
remotion/                  Standalone Remotion project for rendering b-roll clips
  src/broll/shared.tsx     THE contract — BRollTemplate, OB1 palette, animations
  src/broll/_examples/     Reference components (read-only, for studying patterns)
  src/Root.tsx             Composition registry (add new videos here)
  public/logos/            3,428 brand SVG logos + catalog.json + aliases.json

claude/                    Claude Code configuration source files
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

`BROLL_HOME` — absolute path to this repository's root. Stored in `~/.claude/.env`. All paths in the skill, agents, and Python scripts reference this variable. The install script sets it automatically.

---

## How to Install/Update the Skill and Agents

The skill and agent source files live in `claude/` within this repo. To install or update them on the current machine:

```bash
bash claude/install.sh
```

This copies:
- `claude/skills/broll-pipeline/SKILL.md` → `~/.claude/skills/broll-pipeline/SKILL.md`
- `claude/agents/broll-scout.md` → `~/.claude/agents/broll-scout.md`
- `claude/agents/broll-builder.md` → `~/.claude/agents/broll-builder.md`

And ensures `BROLL_HOME` is set in `~/.claude/.env`.

If the user edits the skill or agents in `claude/`, always re-run `install.sh` to propagate changes.

---

## Running the B-Roll Pipeline

The pipeline is invoked via the `/broll-pipeline` skill. However, since the skill is installed at `~/.claude/skills/`, it works from ANY directory — not just this repo.

**Typical usage:**
1. User has a video file somewhere (e.g., `~/Videos/project/video.mp4`)
2. User opens Claude Code in that video's directory
3. User says `/broll-pipeline video.mp4` or "run the b-roll process on this video"
4. The skill handles everything from there

**If the user asks to run the pipeline from within this repo directory**, remind them:
> "The pipeline should be run from the directory containing your source video, not from the repo itself. Should I help you navigate to your video project folder?"

---

## Updating from GitHub

When Jon pushes updates:

```bash
cd "$BROLL_HOME"
git pull
bash claude/install.sh
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
# Edit ~/.claude/.env and set:
ASSEMBLYAI_API_KEY=the_key_value
```

Never commit API keys to this repo. They live only in `~/.claude/.env`.

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
| `BROLL_HOME` not set | Run `bash claude/install.sh` |
| Skill not found in Claude | Run `bash claude/install.sh` |
| `pnpm: command not found` | Run `npm install -g pnpm` |
| TypeScript errors after pull | Run `cd remotion && pnpm install && pnpm exec tsc --noEmit` |
| Chyron files missing | Download from Jon's shared link into `assets/` |
| Logo renders as white box | Check slug in `remotion/public/logos/aliases.json` |
| Permission denied on scripts | Run `chmod +x setup.sh claude/install.sh` |

---

## For the User

If this is your first time using this pipeline, I can:
- Run the full setup for you (install dependencies, configure everything)
- Walk you through processing your first video
- Explain what each part of the pipeline does
- Help troubleshoot any issues

Just ask.
