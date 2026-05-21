# Nate B-Roll Generator

Automated b-roll pipeline for Nate Jones Media videos. Uses Codex + Remotion to generate animated motion graphics from video transcripts, then composites them onto source video with platform chyrons. The legacy Claude setup is still available in `claude/`, but Codex is now the primary path in this repo.

## What It Does

1. Transcribes a video (AssemblyAI)
2. Analyzes transcript and selects 8-25 moments for graphics
3. Generates approved template tool calls and thin Remotion wrappers
4. Renders clips sequentially
5. Composites onto source video with YouTube/Substack chyrons
6. Packages and uploads finished deliverables directly to Content Master Pro via Supabase

## Quick Start

```bash
git clone https://github.com/justfinethanku/nate-broll-generator.git
cd nate-broll-generator
./setup.sh codex
```

Then download the chyron files (shared separately) into `assets/`.

See [`CODEX.md`](./CODEX.md) and [`BOOTSTRAP_CODEX.md`](./BOOTSTRAP_CODEX.md) for the Codex flow.

## Usage

1. Place your source `.mp4` in a project folder
2. Open Codex in that folder
3. Say: `Use $nate-broll-production on source.mp4`

Use `$nate-broll-production` as the normal front door. It decides whether the folder needs a radio edit package, a clean-export b-roll run, delivery verification, or CMP handoff. Use `$radio-edit` or `$broll-pipeline` directly only when you already know that specific stage is the right one.

Finished CMP uploads do not require a local Content Master Pro repo. Use the standalone uploader after `deliverables/upload/` exists:

```bash
node "$BROLL_HOME/scripts/cmp_upload_delivery.mjs" \
  --deliverables-dir "$PWD/deliverables/upload" \
  --project-name "VIDEO TITLE HERE" \
  --publication-slug core_substack \
  --dry-run
```

Live upload requires CMP Supabase credentials in `~/.codex/.env` and uses `--yes` instead of `--dry-run`.

The Claude-specific legacy files remain in `claude/`, but the editor handoff should use the Codex docs:

- [`docs/EDITOR_ONBOARDING_CALL_GUIDE.md`](./docs/EDITOR_ONBOARDING_CALL_GUIDE.md) for first-call setup
- [`docs/SETUP_GUIDE.md`](./docs/SETUP_GUIDE.md) for machine setup
- [`docs/DAILY_WORKFLOW.md`](./docs/DAILY_WORKFLOW.md) for normal project runs
- [`docs/EDITOR_TRAINING_GUIDE.md`](./docs/EDITOR_TRAINING_GUIDE.md) for approval/QC expectations

## Structure

```
remotion/          Standalone Remotion project (renders b-roll clips)
Codex/            Codex skill + prompt definitions
claude/            Claude Code skill + agent definitions
scripts/           Python compositing scripts (FFmpeg-based)
assets/            Chyron .mov files (not in git — download separately)
docs/              Setup guides and troubleshooting
```

## Requirements

- macOS (Apple Silicon)
- Node.js 20+, pnpm
- FFmpeg
- Python 3
- Codex
- AssemblyAI API key
