#!/bin/bash
# ============================================================
# B-Roll Pipeline — One-Time Setup
# ============================================================
# Run this after cloning the repo. It installs dependencies,
# configures Codex or Claude, and verifies prerequisites.
# ============================================================

set -e

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
TARGET="${1:-codex}"

case "$TARGET" in
  codex|claude)
    ;;
  *)
    echo "Usage: ./setup.sh [codex|claude]"
    exit 1
    ;;
esac

if [ "$TARGET" = "codex" ]; then
  ASSISTANT_NAME="Codex"
  ASSISTANT_CMD="codex"
  ASSISTANT_INSTALL_HINT="codex (install the Codex app or CLI first)"
  CONFIG_HOME="$HOME/.codex"
  INSTALL_SCRIPT="$REPO_ROOT/Codex/install.sh"
  INVOCATION_HINT='Use $broll-pipeline on MY-VIDEO-NAME.mp4'
else
  ASSISTANT_NAME="Claude Code"
  ASSISTANT_CMD="claude"
  ASSISTANT_INSTALL_HINT="claude-code(npm install -g @anthropic-ai/claude-code)"
  CONFIG_HOME="$HOME/.claude"
  INSTALL_SCRIPT="$REPO_ROOT/claude/install.sh"
  INVOCATION_HINT='/broll-pipeline MY-VIDEO-NAME.mp4'
fi

ENV_FILE="$CONFIG_HOME/.env"

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║   B-Roll Pipeline Setup                     ║"
echo "╚══════════════════════════════════════════════╝"
echo ""
echo "Repo location: $REPO_ROOT"
echo "Assistant target: $ASSISTANT_NAME"
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

if ! command -v "$ASSISTANT_CMD" &>/dev/null; then
  if [ "$TARGET" = "codex" ]; then
    echo "  ⚠ codex CLI not found; continuing for Codex desktop/app installs"
  else
    MISSING="$MISSING $ASSISTANT_INSTALL_HINT"
  fi
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
if command -v "$ASSISTANT_CMD" &>/dev/null; then
  echo "  ✓ $ASSISTANT_CMD"
else
  echo "  ⚠ $ASSISTANT_CMD CLI unavailable; use the Codex desktop app"
fi
echo ""

# ─── 2. Install Remotion Dependencies ─────────────────────────

echo "Installing Remotion project dependencies..."
cd "$REPO_ROOT/remotion"
pnpm install --silent
echo "  ✓ Dependencies installed"
echo ""

# ─── 3. Install Assistant Configuration ───────────────────────

echo "Installing $ASSISTANT_NAME skill + prompts..."
bash "$INSTALL_SCRIPT" "$REPO_ROOT"
echo ""

# ─── 4. Set Up API Keys ───────────────────────────────────────

echo "─── API Key Configuration ───"
echo ""

# Check if ASSEMBLYAI_API_KEY already exists
if grep -q "^ASSEMBLYAI_API_KEY=" "$ENV_FILE" 2>/dev/null; then
  echo "  ✓ ASSEMBLYAI_API_KEY already configured"
else
  echo "  AssemblyAI is used for video transcription."
  read -p "  Enter AssemblyAI API Key (or press Enter to skip): " AKEY
  if [ -n "$AKEY" ]; then
    SHELL_SAFE_AKEY="$(printf "%s" "$AKEY" | sed "s/'/'\\\\''/g")"
    SHELL_SAFE_AKEY="'$SHELL_SAFE_AKEY'"
    mkdir -p "$CONFIG_HOME"
    touch "$ENV_FILE"
    if grep -q "^ASSEMBLYAI_API_KEY=" "$ENV_FILE" 2>/dev/null; then
      tmp_file="$(mktemp)"
      awk -v value="$SHELL_SAFE_AKEY" '
        BEGIN { updated = 0 }
        index($0, "ASSEMBLYAI_API_KEY=") == 1 {
          print "ASSEMBLYAI_API_KEY=" value
          updated = 1
          next
        }
        { print }
        END {
          if (updated == 0) {
            print "ASSEMBLYAI_API_KEY=" value
          }
        }
      ' "$ENV_FILE" > "$tmp_file"
      mv "$tmp_file" "$ENV_FILE"
    else
      echo "ASSEMBLYAI_API_KEY=$SHELL_SAFE_AKEY" >> "$ENV_FILE"
    fi
    echo "  ✓ Saved to $ENV_FILE"
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
if [ -f "$REPO_ROOT/assets/Youtube Chyron.mov" ] && [ -f "$REPO_ROOT/assets/Substack Chyron.mov" ]; then
  echo "  1. Chyron files are present in $REPO_ROOT/assets/"
else
  echo "  1. Download chyron files into $REPO_ROOT/assets/"
  echo "     • Youtube Chyron.mov (9.5 GB)"
  echo "     • Substack Chyron.mov (5.8 GB)"
fi
echo ""
echo "  2. Test Remotion Studio:"
echo "     cd \"$REPO_ROOT/remotion\" && pnpm studio"
echo ""
echo "  3. Test the pipeline in $ASSISTANT_NAME:"
if [ "$TARGET" = "codex" ]; then
  echo "     Open Codex in the video folder and say: $INVOCATION_HINT"
else
  echo "     Open Claude Code and type: $INVOCATION_HINT"
fi
echo ""
