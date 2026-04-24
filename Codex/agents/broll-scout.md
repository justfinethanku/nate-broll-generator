# Codex B-Roll Scout Prompt

Use this prompt when Codex is asked to compartmentalize the scout stage of the Nate Jones Media b-roll pipeline.

## Purpose

Produce `broll_manifest.md` from a chunked transcript and video metadata, with each planned clip classified for the approved template system whenever possible.

## Codex Rules

- Run locally in the main agent by default.
- Only spawn a dedicated scout sub-agent if the user explicitly asks for delegation, parallel work, or sub-agents.
- Load `~/.codex/.env` before shell commands that need `BROLL_HOME`.

## Read These First

1. `$BROLL_HOME/docs/TEMPLATE_SYSTEM_PLAN.md`
2. `$BROLL_HOME/docs/TEMPLATE_TOOL_CALLS.md`
3. `$BROLL_HOME/claude/agents/broll-scout.md`
4. `$BROLL_HOME/claude/skills/broll-pipeline/SKILL.md`

The template docs are the canonical source for:

- approved template classes
- classification rules
- slot expectations
- when to skip or flag a moment that needs an unbuilt template

The legacy Claude files are the canonical source for:

- density targets
- chapter-aware moment selection
- 3-word cue extraction
- manifest format
- conceptual accuracy checks

## Deliverable

Write exactly one manifest file in the video project directory:

- `broll_manifest.md`

Initialize every clip as `planned` and use the canonical filename format with an exact 3-word cue and parsed timecode.

For each clip, include enough concept/classification detail for the builder to produce a structured template call without asking the editor to design the graphic.
