#!/bin/bash
# Verify that this repo is ready to hand to an editor/operator.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ERRORS=0
WARNINGS=0

ok() {
  printf "  ✓ %s\n" "$1"
}

warn() {
  printf "  ⚠ %s\n" "$1"
  WARNINGS=$((WARNINGS + 1))
}

fail() {
  printf "  ✗ %s\n" "$1"
  ERRORS=$((ERRORS + 1))
}

check_command() {
  local cmd="$1"
  local label="$2"
  if command -v "$cmd" >/dev/null 2>&1; then
    ok "$label"
  else
    fail "$label missing"
  fi
}

echo ""
echo "B-Roll Package Check"
echo "Repo: $REPO_ROOT"
echo ""

echo "Tools"
check_command node "node $(node --version 2>/dev/null || true)"
check_command pnpm "pnpm $(pnpm --version 2>/dev/null || true)"
check_command ffmpeg "ffmpeg"
check_command python3 "python3 $(python3 --version 2>/dev/null || true)"

if command -v codex >/dev/null 2>&1; then
  ok "codex CLI"
else
  warn "codex CLI not found; OK if the editor is using the Codex desktop app"
fi

echo ""
echo "Repo Files"
for path in \
  "Codex/install.sh" \
  "Codex/skills/broll-pipeline/SKILL.md" \
  "Codex/agents/broll-scout.md" \
  "Codex/agents/broll-builder.md" \
  "remotion/src/broll/templates/templateToolRegistry.tsx" \
  "remotion/src/broll/templates/UtilityTemplates.tsx" \
  "remotion/src/broll/TemplateDemos.tsx" \
  "scripts/render_template_previews.sh" \
  "scripts/prepare_cmp_delivery.py" \
  "docs/EDITOR_PACKAGE_README.md" \
  "docs/EDITOR_TRAINING_GUIDE.md"; do
  if [ -f "$REPO_ROOT/$path" ]; then
    ok "$path"
  else
    fail "$path missing"
  fi
done

echo ""
echo "Codex Install"
if [ -f "$HOME/.codex/.env" ]; then
  ok "~/.codex/.env"
else
  fail "~/.codex/.env missing; run ./setup.sh codex"
fi

if grep -q "^BROLL_HOME=" "$HOME/.codex/.env" 2>/dev/null; then
  ok "BROLL_HOME configured"
else
  fail "BROLL_HOME missing from ~/.codex/.env"
fi

if grep -q "^ASSEMBLYAI_API_KEY=" "$HOME/.codex/.env" 2>/dev/null; then
  ok "ASSEMBLYAI_API_KEY configured"
else
  fail "ASSEMBLYAI_API_KEY missing from ~/.codex/.env"
fi

for path in \
  "$HOME/.codex/skills/broll-pipeline/SKILL.md" \
  "$HOME/.codex/agents/broll-scout.md" \
  "$HOME/.codex/agents/broll-builder.md"; do
  if [ -f "$path" ]; then
    ok "$path"
  else
    fail "$path missing; run ./setup.sh codex"
  fi
done

echo ""
echo "Assets"
for path in \
  "$REPO_ROOT/assets/Youtube Chyron.mov" \
  "$REPO_ROOT/assets/Substack Chyron.mov"; do
  if [ -f "$path" ]; then
    ok "$(basename "$path")"
  else
    fail "$(basename "$path") missing from assets/"
  fi
done

echo ""
echo "Remotion"
if [ -d "$REPO_ROOT/remotion/node_modules" ]; then
  ok "remotion/node_modules"
else
  fail "remotion/node_modules missing; run ./setup.sh codex"
fi

(
  cd "$REPO_ROOT/remotion"
  if pnpm exec tsc --noEmit >/tmp/nate-broll-tsc.log 2>&1; then
    ok "TypeScript compiles"
  else
    fail "TypeScript compile failed; see /tmp/nate-broll-tsc.log"
  fi
)

echo ""
echo "Summary"
if [ "$ERRORS" -eq 0 ]; then
  ok "Package check passed with $WARNINGS warning(s)"
  exit 0
fi

fail "Package check failed with $ERRORS error(s) and $WARNINGS warning(s)"
exit 1
