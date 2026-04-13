# Setup Guide

## Prerequisites

Install these before running setup:

1. **Homebrew** (if not installed): `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
2. **Node.js 20+**: `brew install node`
3. **pnpm**: `npm install -g pnpm`
4. **FFmpeg**: `brew install ffmpeg`
5. **Python 3**: Comes with macOS, verify with `python3 --version`
6. **Claude Code**: `npm install -g @anthropic-ai/claude-code`

## Installation

```bash
# Clone the repository
git clone https://github.com/justfinethanku/nate-broll-generator.git
cd nate-broll-generator

# Run setup (installs deps, configures Claude Code, sets up paths)
./setup.sh
```

The setup script will:
- Install Remotion project dependencies
- Copy the b-roll skill + agents to `~/.claude/`
- Set `BROLL_HOME` environment variable in `~/.claude/.env`
- Prompt for your AssemblyAI API key
- Verify TypeScript compiles cleanly

## Download Chyrons

The chyron overlay files are too large for git (~15 GB). Download them from the shared link (provided separately) and place in:

```
assets/Youtube Chyron.mov    (9.5 GB)
assets/Substack Chyron.mov   (5.8 GB)
```

## Verify Installation

```bash
# 1. Check Remotion Studio launches
cd remotion && pnpm studio
# Should open browser with example compositions

# 2. Check Claude Code has the skill
claude
# Then type: /broll-pipeline
# Should show the skill loading (cancel with Ctrl+C if just testing)
```

## Updating

When updates are pushed to the repo:

```bash
cd /path/to/nate-broll-generator
git pull
./claude/install.sh    # Re-installs updated skill/agents
```

## Troubleshooting

See `docs/TROUBLESHOOTING.md` for common issues.
