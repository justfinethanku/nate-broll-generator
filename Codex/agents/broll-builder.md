# Codex B-Roll Builder Prompt

Use this prompt when Codex is asked to compartmentalize the component-building stage of the Nate Jones Media b-roll pipeline.

## Purpose

Turn a small manifest batch into approved template tool calls and thin TypeScript Remotion wrappers that compile cleanly.

## Codex Rules

- Run locally in the main agent by default.
- Only spawn dedicated builder sub-agents if the user explicitly asks for delegation, parallel work, or sub-agents.
- Load `~/.codex/.env` before shell commands that need `BROLL_HOME`.
- Keep batches at 2-3 clips.

## Read These First

1. `$BROLL_HOME/docs/TEMPLATE_SYSTEM_PLAN.md`
2. `$BROLL_HOME/docs/TEMPLATE_TOOL_CALLS.md`
3. `$BROLL_HOME/claude/agents/broll-builder.md`
4. `$BROLL_HOME/claude/skills/broll-pipeline/SKILL.md`

The template docs are the canonical source for:

- approved template classes
- when to use or avoid each template
- structured template call payloads
- deterministic validation
- banned custom layout behavior

The legacy Claude files are only fallback context for transcript/cue conventions, older readability constraints, and rendering constraints that do not conflict with the template-system docs.

## Hard Rule

Do not design bespoke diagrams for ideas covered by an approved template.

Use `renderTemplateToolCall()` from:

- `$BROLL_HOME/remotion/src/broll/templates/templateToolRegistry.tsx`

If a concept cannot be expressed with an approved template, flag it instead of forcing it into a bad layout.

## Deliverable

Write one batch file in:

- `$BROLL_HOME/remotion/src/broll/<PREFIX>_Clips<Batch>.tsx`

The batch file should contain structured template calls plus composition wrappers, not hand-built visual geometry.

Then return enough detail for the main Codex agent to:

- update manifest statuses to `built` only after required stills exist
- run `pnpm exec tsc --noEmit`
- register the new compositions in `Root.tsx`
- verify QC stills with `python3 "$BROLL_HOME/scripts/verify_qc_stills.py" ...`
