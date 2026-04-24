#!/bin/bash
# Render the template menu previews sequentially.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PREVIEW_DIR="$REPO_ROOT/remotion/out/template-previews"

mkdir -p "$PREVIEW_DIR"

if [ -f "$HOME/.codex/.env" ]; then
  set -a
  # shellcheck disable=SC1090
  source "$HOME/.codex/.env"
  set +a
fi

cd "$REPO_ROOT/remotion"

if [ -x /opt/homebrew/bin/brew ]; then
  eval "$(/opt/homebrew/bin/brew shellenv)"
fi

IDS=(
  TPL-STACK-2-DEMO
  TPL-STACK-DEMO
  TPL-STACK-4-DEMO
  TPL-COMPARISON-DEMO
  TPL-SEQUENCE-DEMO
  TPL-GATE-DEMO
  TPL-SURFACE-DEMO
  TPL-LOOP-DEMO
  TPL-PROGRESSION-DEMO
  TPL-FORMULA-DEMO
  TPL-ALLOCATION-DEMO
)

echo "Rendering template still previews into:"
echo "  $PREVIEW_DIR"
echo ""

for id in "${IDS[@]}"; do
  echo "Rendering $id"
  pnpm exec remotion still src/index.ts "$id" "$PREVIEW_DIR/$id-f180.png" --frame=180
done

echo ""
echo "Template preview render complete."
