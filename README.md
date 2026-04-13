# Nate B-Roll Generator

Automated b-roll pipeline for Nate Jones Media videos. Uses Claude Code + Remotion to generate animated motion graphics from video transcripts, then composites them onto source video with platform chyrons.

## What It Does

1. Transcribes a video (AssemblyAI)
2. Analyzes transcript and selects 8-25 moments for graphics
3. Generates TypeScript Remotion components (animated data visualizations)
4. Renders clips sequentially
5. Composites onto source video with YouTube/Substack chyrons

## Quick Start

```bash
git clone https://github.com/justfinethanku/nate-broll-generator.git
cd nate-broll-generator
./setup.sh
```

Then download the chyron files (shared separately) into `assets/`.

See `docs/SETUP_GUIDE.md` for detailed instructions.

## Usage

1. Place your source `.mp4` in a project folder
2. Open Claude Code in that folder
3. Run: `/broll-pipeline source.mp4`

See `docs/DAILY_WORKFLOW.md` for the full workflow.

## Structure

```
remotion/          Standalone Remotion project (renders b-roll clips)
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
- Claude Code (with Anthropic API access)
- AssemblyAI API key
