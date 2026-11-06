#!/bin/bash
# Write one Bash/zsh assignment without evaluating its value or losing escapes.

upsert_shell_env_var() {
  local env_file="$1"
  local key="$2"
  local value="$3"
  local quoted_value
  local tmp_file

  mkdir -p "$(dirname "$env_file")"
  touch "$env_file"
  # %q also keeps embedded newlines on one physical line for later updates.
  printf -v quoted_value '%q' "$value"
  tmp_file="$(mktemp "${env_file}.XXXXXX")"

  # awk -v interprets backslash escapes; ENVIRON preserves the quoted bytes.
  BROLL_ENV_KEY="$key" BROLL_ENV_VALUE="$quoted_value" awk '
    BEGIN {
      key = ENVIRON["BROLL_ENV_KEY"]
      value = ENVIRON["BROLL_ENV_VALUE"]
      updated = 0
    }
    index($0, key "=") == 1 {
      if (!updated) print key "=" value
      updated = 1
      next
    }
    { print }
    END { if (!updated) print key "=" value }
  ' "$env_file" > "$tmp_file" && mv "$tmp_file" "$env_file"
}
