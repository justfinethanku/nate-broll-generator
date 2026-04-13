#!/bin/bash
# Install Claude Code configuration for the b-roll pipeline.
# Copies skill + agent definitions to ~/.claude/ and sets BROLL_HOME.
#
# Usage: ./install.sh [BROLL_HOME_PATH]
#   If BROLL_HOME_PATH is omitted, uses the parent directory of this script.

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BROLL_HOME="${1:-$REPO_ROOT}"

echo "Installing Claude Code b-roll configuration..."
echo "  BROLL_HOME = $BROLL_HOME"

# Create directories
mkdir -p ~/.claude/skills/broll-pipeline
mkdir -p ~/.claude/agents

# Backup existing files if present
for f in ~/.claude/skills/broll-pipeline/SKILL.md ~/.claude/agents/broll-scout.md ~/.claude/agents/broll-builder.md; do
  if [ -f "$f" ]; then
    echo "  Backing up existing $f → ${f}.bak"
    cp "$f" "${f}.bak"
  fi
done

# Copy skill and agents
cp "$SCRIPT_DIR/skills/broll-pipeline/SKILL.md" ~/.claude/skills/broll-pipeline/SKILL.md
cp "$SCRIPT_DIR/agents/broll-scout.md" ~/.claude/agents/broll-scout.md
cp "$SCRIPT_DIR/agents/broll-builder.md" ~/.claude/agents/broll-builder.md

echo "  Installed: ~/.claude/skills/broll-pipeline/SKILL.md"
echo "  Installed: ~/.claude/agents/broll-scout.md"
echo "  Installed: ~/.claude/agents/broll-builder.md"

# Set BROLL_HOME in ~/.claude/.env
touch ~/.claude/.env
if grep -q "^BROLL_HOME=" ~/.claude/.env 2>/dev/null; then
  # Update existing
  sed -i '' "s|^BROLL_HOME=.*|BROLL_HOME=$BROLL_HOME|" ~/.claude/.env
  echo "  Updated BROLL_HOME in ~/.claude/.env"
else
  echo "BROLL_HOME=$BROLL_HOME" >> ~/.claude/.env
  echo "  Added BROLL_HOME to ~/.claude/.env"
fi

echo ""
echo "Done! Claude Code will now have access to the b-roll pipeline skill."
