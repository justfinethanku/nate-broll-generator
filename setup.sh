#!/bin/bash
# ============================================================
# B-Roll Pipeline — One-Time Setup
# ============================================================
# Run this after cloning the repo. It installs dependencies,
# configures Claude Code, and verifies prerequisites.
# ============================================================

set -e

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║   B-Roll Pipeline Setup                     ║"
echo "╚══════════════════════════════════════════════╝"
echo ""
echo "Repo location: $REPO_ROOT"
echo ""

# ─── 1. Check Prerequisites ───────────────────────────────────

echo "Checking prerequisites..."

MISSING=""

if ! command -v node &>/dev/null; then
  MISSING="$MISSING node(https://nodejs.org)"
fi

if ! command -v pnpm &>/dev/null; then
  MISSING="$MISSING pnpm(npm install -g pnpm)"
fi

if ! command -v ffmpeg &>/dev/null; then
  MISSING="$MISSING ffmpeg(brew install ffmpeg)"
fi

if ! command -v python3 &>/dev/null; then
  MISSING="$MISSING python3"
fi

if ! command -v claude &>/dev/null; then
  MISSING="$MISSING claude-code(npm install -g @anthropic-ai/claude-code)"
fi

if [ -n "$MISSING" ]; then
  echo ""
  echo "ERROR: Missing required tools:"
  for m in $MISSING; do
    echo "  ✗ $m"
  done
  echo ""
  echo "Install the missing tools and re-run this script."
  exit 1
fi

echo "  ✓ node $(node --version)"
echo "  ✓ pnpm $(pnpm --version)"
echo "  ✓ ffmpeg"
echo "  ✓ python3"
echo "  ✓ claude"
echo ""

# ─── 2. Install Remotion Dependencies ─────────────────────────

echo "Installing Remotion project dependencies..."
cd "$REPO_ROOT/remotion"
pnpm install --silent
echo "  ✓ Dependencies installed"
echo ""

# ─── 3. Install Claude Code Configuration ─────────────────────

echo "Installing Claude Code skill + agents..."
bash "$REPO_ROOT/claude/install.sh" "$REPO_ROOT"
echo ""

# ─── 4. Set Up API Keys ───────────────────────────────────────

echo "─── API Key Configuration ───"
echo ""

# Check if ASSEMBLYAI_API_KEY already exists
if grep -q "^ASSEMBLYAI_API_KEY=" ~/.claude/.env 2>/dev/null; then
  echo "  ✓ ASSEMBLYAI_API_KEY already configured"
else
  echo "  AssemblyAI is used for video transcription."
  read -p "  Enter AssemblyAI API Key (or press Enter to skip): " AKEY
  if [ -n "$AKEY" ]; then
    echo "ASSEMBLYAI_API_KEY=$AKEY" >> ~/.claude/.env
    echo "  ✓ Saved to ~/.claude/.env"
  else
    echo "  ⚠ Skipped — you'll need to add this before running the pipeline"
  fi
fi
echo ""

# ─── 5. Create Assets Directory ───────────────────────────────

mkdir -p "$REPO_ROOT/assets"
echo "Assets directory: $REPO_ROOT/assets/"
echo ""

# ─── 6. Verify TypeScript Compiles ────────────────────────────

echo "Verifying TypeScript compilation..."
cd "$REPO_ROOT/remotion"
if pnpm exec tsc --noEmit 2>/dev/null; then
  echo "  ✓ TypeScript compiles cleanly"
else
  echo "  ⚠ TypeScript has errors (may not affect runtime — check with: cd remotion && pnpm exec tsc --noEmit)"
fi
echo ""

# ─── 7. Summary ───────────────────────────────────────────────

echo "╔══════════════════════════════════════════════╗"
echo "║   Setup Complete!                           ║"
echo "╚══════════════════════════════════════════════╝"
echo ""
echo "  Remotion project: $REPO_ROOT/remotion/"
echo "  Python scripts:   $REPO_ROOT/scripts/"
echo "  Chyron assets:    $REPO_ROOT/assets/"
echo ""
echo "─── Remaining Steps ───"
echo ""
echo "  1. Download chyron files into $REPO_ROOT/assets/"
echo "     • Youtube Chyron.mov (9.5 GB)"
echo "     • Substack Chyron.mov (5.8 GB)"
echo ""
echo "  2. Test Remotion Studio:"
echo "     cd \"$REPO_ROOT/remotion\" && pnpm studio"
echo ""
echo "  3. Test the pipeline in Claude Code:"
echo "     Open Claude Code and type: /broll-pipeline"
echo ""
