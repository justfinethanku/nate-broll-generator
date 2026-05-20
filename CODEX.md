# B-Roll Pipeline — Codex Instructions

You are operating inside the `nate-broll-generator` repository. This is an automated b-roll pipeline for Nate Jones Media videos. Your job is to help the user set up, maintain, and run the pipeline from Codex.

---

## First-Time Setup (Do This Automatically)

When a user opens Codex in this repo for the first time, proactively check whether setup is complete by verifying:

1. `~/.codex/.env` contains `BROLL_HOME=` pointing to this repo
2. `~/.codex/skills/nate-broll-production/SKILL.md` exists
3. `~/.codex/skills/broll-pipeline/SKILL.md` exists
4. `~/.codex/skills/radio-edit/SKILL.md` exists
5. `~/.codex/plugins/nate-broll-production/.codex-plugin/plugin.json` exists
6. `~/.codex/agents/broll-scout.md` exists
7. `~/.codex/agents/broll-builder.md` exists
8. `node_modules/` exists inside `remotion/`
9. `assets/Youtube Chyron.mov` and `assets/Substack Chyron.mov` exist

If any of items 1-8 are missing, run:

```bash
REPO_ROOT="$(pwd)"
cd "$REPO_ROOT/remotion" && pnpm install
bash "$REPO_ROOT/Codex/install.sh" "$REPO_ROOT"
```

If chyrons are missing, tell the user:

> "The chyron overlay files aren't in `assets/` yet. These are the branded lower-thirds for YouTube and Substack deliverables (~15 GB total). Ask Jon for the download link and place them in `assets/`."

If `ASSEMBLYAI_API_KEY` is not in `~/.codex/.env`, tell the user:

> "No AssemblyAI API key found in `~/.codex/.env`. You'll need this for video transcription. Ask Jon for the key, then I can add it."

---

## What This Repo Contains

```text
remotion/                  Standalone Remotion project for rendering b-roll clips
  src/broll/shared.tsx     THE contract — BRollTemplate, OB1 palette, animations
  src/broll/_examples/     Reference components (read-only, for studying patterns)
  src/Root.tsx             Composition registry
  public/logos/            Brand SVG logo pack + catalog + aliases

Codex/                     Codex configuration source files
  skills/nate-broll-production/SKILL.md  Top-level production operator/router
  skills/broll-pipeline/SKILL.md    Codex-native orchestration skill
  skills/radio-edit/SKILL.md        Transcript-driven rough-cut skill
  plugins/nate-broll-production/    Plugin-style package for the operator
  agents/broll-scout.md             Scout prompt wrapper
  agents/broll-builder.md           Builder prompt wrapper
  install.sh                        Copies config to ~/.codex/ and wires shell env

claude/                    Canonical legacy prompt files the Codex skill reuses

scripts/                   Python automation
assets/                    Large binary files (not in git)
docs/                      Human-readable documentation
```

---

## Key Environment Variable

`BROLL_HOME` is the absolute path to this repository root.

- Stored in `~/.codex/.env`
- Sourced into new zsh sessions by the hook that `Codex/install.sh` adds to `~/.zshrc`
- Used by the skill, prompts, and Python scripts

---

## How To Install Or Update The Codex Files

Run:

```bash
bash Codex/install.sh
```

This copies:

- `Codex/skills/broll-pipeline/SKILL.md` -> `~/.codex/skills/broll-pipeline/SKILL.md`
- `Codex/skills/nate-broll-production/SKILL.md` -> `~/.codex/skills/nate-broll-production/SKILL.md`
- `Codex/skills/radio-edit/SKILL.md` -> `~/.codex/skills/radio-edit/SKILL.md`
- `Codex/plugins/nate-broll-production/` -> `~/.codex/plugins/nate-broll-production/`
- `Codex/agents/broll-scout.md` -> `~/.codex/agents/broll-scout.md`
- `Codex/agents/broll-builder.md` -> `~/.codex/agents/broll-builder.md`

It also ensures `BROLL_HOME` is written to `~/.codex/.env` and adds a zsh hook so Terminal sessions inherit it.

If the user edits files in `Codex/`, re-run `bash Codex/install.sh`.

---

## Running The Pipeline In Codex

The Codex version is invoked by naming the skill or asking for the workflow in plain English.

Typical usage:

1. Put the source video in its own project folder
2. Open Codex in that folder
3. Say `Use $nate-broll-production on video.mp4` for the full production router, or use `$radio-edit` / `$broll-pipeline` directly when you already know the stage.

If the user tries to run the pipeline from this repo root, remind them the workflow should run from the folder containing the source video.

Use `$nate-broll-production` when the operator needs to decide timing:

- raw media -> radio edit package -> editor NLE review
- clean edit -> b-roll generation -> approval gate
- final composites -> `deliverables/upload/`
- clean upload folder -> CMP handoff

---

## Updating From GitHub

```bash
cd "$BROLL_HOME"
git pull
bash Codex/install.sh
```

If `remotion/package.json` changed:

```bash
cd "$BROLL_HOME/remotion"
pnpm install
```

---

## Adding API Keys

Add or update the AssemblyAI key in:

```bash
~/.codex/.env
```

Format:

```text
ASSEMBLYAI_API_KEY=the_key_value
```

Never commit API keys to this repo.

---

## Hard Rules

1. Never render in parallel. Chrome instances conflict.
2. Always use h264 for Remotion renders on Apple Silicon.
3. Never hardcode absolute paths in repo code. Use `BROLL_HOME` or repo-relative paths.
4. Never commit API keys or chyron assets.
5. Never modify `shared.tsx` casually. It is the contract for every clip.

---

## Codex-Specific Note

Codex should execute the pipeline in the main agent by default. Only use spawned sub-agents for scout or builder work if the user explicitly asks for delegation or parallel agents.
