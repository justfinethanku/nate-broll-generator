#!/bin/bash
# Install Codex configuration for the b-roll pipeline.
# Copies skills + prompt definitions to ~/.codex/ and sets BROLL_HOME.
#
# Usage: ./install.sh [BROLL_HOME_PATH]
#   If BROLL_HOME_PATH is omitted, uses the parent directory of this script.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BROLL_HOME="${1:-$REPO_ROOT}"
CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
ENV_FILE="$CODEX_HOME/.env"
SHELL_DIR="$CODEX_HOME/shell"
HOOK_FILE="$SHELL_DIR/broll-pipeline.zsh"
ZSHRC_FILE="$HOME/.zshrc"
ZPROFILE_FILE="$HOME/.zprofile"
ZSH_MARKER_START="# >>> nate-broll-generator >>>"
ZSH_MARKER_END="# <<< nate-broll-generator <<<"

upsert_env_var() {
  local key="$1"
  local value="$2"
  local escaped_value
  local tmp_file

  mkdir -p "$(dirname "$ENV_FILE")"
  touch "$ENV_FILE"
  tmp_file="$(mktemp)"
  escaped_value="$(printf "%s" "$value" | sed "s/'/'\\\\''/g")"
  escaped_value="'$escaped_value'"

  awk -v key="$key" -v value="$escaped_value" '
    BEGIN { updated = 0 }
    index($0, key "=") == 1 {
      print key "=" value
      updated = 1
      next
    }
    { print }
    END {
      if (updated == 0) {
        print key "=" value
      }
    }
  ' "$ENV_FILE" > "$tmp_file"

  mv "$tmp_file" "$ENV_FILE"
}

copy_if_missing_from_claude_env() {
  local key="$1"
  local claude_env="$HOME/.claude/.env"
  local current_value
  local claude_value

  current_value="$(grep -E "^${key}=" "$ENV_FILE" 2>/dev/null | head -1 | cut -d= -f2- || true)"
  if [ -n "$current_value" ]; then
    return
  fi

  if [ -f "$claude_env" ]; then
    claude_value="$(grep -E "^${key}=" "$claude_env" 2>/dev/null | head -1 | cut -d= -f2- || true)"
    if [ -n "$claude_value" ]; then
      upsert_env_var "$key" "$claude_value"
      echo "  Copied $key from ~/.claude/.env"
    fi
  fi
}

echo "Installing Codex b-roll configuration..."
echo "  BROLL_HOME = $BROLL_HOME"
echo "  CODEX_HOME = $CODEX_HOME"

mkdir -p "$CODEX_HOME/skills"
mkdir -p "$CODEX_HOME/agents"
mkdir -p "$SHELL_DIR"

for f in \
  "$CODEX_HOME/skills/nate-broll-production/SKILL.md" \
  "$CODEX_HOME/skills/broll-pipeline/SKILL.md" \
  "$CODEX_HOME/skills/radio-edit/SKILL.md" \
  "$CODEX_HOME/agents/broll-scout.md" \
  "$CODEX_HOME/agents/broll-builder.md"; do
  if [ -f "$f" ]; then
    echo "  Backing up existing $f -> ${f}.bak"
    cp "$f" "${f}.bak"
  fi
done

for skill_dir in "$SCRIPT_DIR"/skills/*; do
  if [ -d "$skill_dir" ] && [ -f "$skill_dir/SKILL.md" ]; then
    skill_name="$(basename "$skill_dir")"
    mkdir -p "$CODEX_HOME/skills/$skill_name"
    cp -R "$skill_dir"/. "$CODEX_HOME/skills/$skill_name/"
    echo "  Installed: $CODEX_HOME/skills/$skill_name/SKILL.md"
  fi
done

if [ -d "$SCRIPT_DIR/plugins" ]; then
  mkdir -p "$CODEX_HOME/plugins"
  for plugin_dir in "$SCRIPT_DIR"/plugins/*; do
    if [ -d "$plugin_dir" ] && [ -f "$plugin_dir/.codex-plugin/plugin.json" ]; then
      plugin_name="$(basename "$plugin_dir")"
      rm -rf "$CODEX_HOME/plugins/$plugin_name"
      mkdir -p "$CODEX_HOME/plugins/$plugin_name"
      cp -R "$plugin_dir"/. "$CODEX_HOME/plugins/$plugin_name/"
      echo "  Installed plugin: $CODEX_HOME/plugins/$plugin_name/.codex-plugin/plugin.json"
    fi
  done
fi

cp "$SCRIPT_DIR/agents/broll-scout.md" "$CODEX_HOME/agents/broll-scout.md"
cp "$SCRIPT_DIR/agents/broll-builder.md" "$CODEX_HOME/agents/broll-builder.md"

echo "  Installed: $CODEX_HOME/agents/broll-scout.md"
echo "  Installed: $CODEX_HOME/agents/broll-builder.md"

upsert_env_var "BROLL_HOME" "$BROLL_HOME"
echo "  Updated BROLL_HOME in $ENV_FILE"
copy_if_missing_from_claude_env "ASSEMBLYAI_API_KEY"

cat > "$HOOK_FILE" <<'EOF'
if [ -f "$HOME/.codex/.env" ]; then
  set -a
  . "$HOME/.codex/.env"
  set +a
fi
EOF
echo "  Wrote shell hook: $HOOK_FILE"

for profile_file in "$ZPROFILE_FILE" "$ZSHRC_FILE"; do
  touch "$profile_file"
  if ! grep -Fq "$ZSH_MARKER_START" "$profile_file"; then
    {
      echo ""
      echo "$ZSH_MARKER_START"
      echo "[ -f \"\$HOME/.codex/shell/broll-pipeline.zsh\" ] && source \"\$HOME/.codex/shell/broll-pipeline.zsh\""
      echo "$ZSH_MARKER_END"
    } >> "$profile_file"
    echo "  Added Codex env hook to $profile_file"
  else
    echo "  Codex env hook already present in $profile_file"
  fi
done

echo ""
echo "Done! Codex will now have access to the b-roll pipeline skills."
echo "Open a new shell (or run: source ~/.zprofile && source ~/.zshrc) before using BROLL_HOME in Terminal."
