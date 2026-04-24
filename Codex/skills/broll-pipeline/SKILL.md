---
name: broll-pipeline
description: Strict Codex runbook for the Nate Jones Media b-roll pipeline. Use when the user wants to set up, run, resume, or troubleshoot transcript-driven b-roll generation, Remotion clip rendering, or final chyron compositing for a source video.
metadata:
  priority: 9
  promptSignals:
    phrases:
      - "b-roll pipeline"
      - "run the b-roll process"
      - "process this video"
      - "generate motion graphics for this video"
      - "composite b-roll"
      - "apply chyrons"
      - "resume the b-roll pipeline"
      - "use $broll-pipeline"
    allOf:
      - [b-roll, video]
      - [motion, graphics]
      - [transcript, video]
    anyOf:
      - "remotion"
      - "assemblyai"
      - "chyrons"
      - "overlay clips"
      - "manifest"
    noneOf: []
    minScore: 6
---

# B-Roll Pipeline Skill

Use this skill whenever Codex is asked to set up, run, resume, or debug the Nate Jones Media b-roll pipeline.

This file is the Codex orchestration contract. Codex should execute the workflow decisively, but it should not freestyle the pipeline.

Important: this repo is moving away from bespoke per-clip graphics and toward deterministic template tool calls. For design, layout, and generated b-roll structure, the template-system docs override the legacy Claude prompt files.

## What Codex Should Do

Codex should behave like a production operator:

- make reasonable assumptions
- keep the pipeline moving without unnecessary approval stops
- persist through setup, build, QC, and rendering
- pause exactly once before final compositing
- resume from existing artifacts instead of starting over

If the user asks to "run the pipeline" from a video project folder, Codex should execute the runbook below automatically. Do not stop after analysis unless blocked.

## Codex Operating Model

- Default to running the workflow in the main Codex agent.
- Only delegate scout/builder work to sub-agents if the user explicitly asks for delegation, parallel agents, or sub-agent help.
- If delegation is explicitly requested, use:
  - `$BROLL_HOME/Codex/agents/broll-scout.md`
  - `$BROLL_HOME/Codex/agents/broll-builder.md`
- Even when delegation is allowed, Codex remains responsible for orchestration, status tracking, TS validation, QC, rendering order, and the mandatory approval pause before compositing.

## Environment Bootstrapping

Codex does not automatically source `~/.codex/.env` into every shell command. Before any command that needs `BROLL_HOME` or `ASSEMBLYAI_API_KEY`, load it:

```bash
if [ -f ~/.codex/.env ]; then
  set -a
  source ~/.codex/.env
  set +a
fi
```

If the current shell still does not have `BROLL_HOME`, or the installed skill files are missing, run:

```bash
bash "$PWD/Codex/install.sh" "$PWD"
```

If you are not in the repo root and need the repo, locate it before proceeding.

## Canonical Rule Sources

Before running the pipeline, read:

1. `$BROLL_HOME/docs/TEMPLATE_SYSTEM_PLAN.md`
2. `$BROLL_HOME/docs/TEMPLATE_TOOL_CALLS.md`
3. `$BROLL_HOME/claude/skills/broll-pipeline/SKILL.md`
4. `$BROLL_HOME/claude/agents/broll-scout.md`
5. `$BROLL_HOME/claude/agents/broll-builder.md`

Treat the template docs as the source of truth for:

- template classification
- approved visual classes
- structured template tool calls
- deterministic validation
- rules against custom layouts once a template exists

Treat the legacy Claude files as the source of truth only for:

- transcript generation
- clip density and spacing
- exact 3-word cue extraction
- older readability constraints that do not conflict with template validation
- QC requirements
- rendering and compositing constraints

## Invocation Rules

Preferred Codex invocations:

- `Use $broll-pipeline on video.mp4`
- `run the b-roll process on video.mp4`
- `resume the b-roll pipeline for video.mp4`

Do not assume slash commands exist in Codex.

If the user is sitting in the repo root instead of a video project folder, tell them the pipeline should be run from the folder containing the source video and help them switch context.

## Setup Gate

Before doing pipeline work, verify:

- `BROLL_HOME` is available
- `$BROLL_HOME/remotion/` exists
- `$BROLL_HOME/scripts/multi_composite.py` exists
- `$BROLL_HOME/remotion/src/broll/shared.tsx` exists
- `~/.codex/skills/broll-pipeline/SKILL.md` exists
- `~/.codex/agents/broll-scout.md` exists
- `~/.codex/agents/broll-builder.md` exists
- `assets/Youtube Chyron.mov` and `assets/Substack Chyron.mov` exist in the repo

If setup is incomplete:

1. Run `pnpm install` in `$BROLL_HOME/remotion`
2. Run `bash "$BROLL_HOME/Codex/install.sh" "$BROLL_HOME"`
3. Verify the installed skill and agent files exist in `~/.codex/`
4. Verify `~/.codex/.env` contains `BROLL_HOME`
5. If `ASSEMBLYAI_API_KEY` is missing, ask for it or copy from `~/.claude/.env` if available
6. If the chyron files are missing, tell the user they still need Jon's download link

If the user only asked for setup, stop after setup and report the status clearly.

## Resume-First Behavior

Always prefer resuming over restarting.

Before creating anything new, inspect the video project directory for:

- `<source>_transcript.json`
- `<source>_transcript_chunked.json`
- `broll_manifest.md`
- `broll/`
- previously generated TSX component files in `$BROLL_HOME/remotion/src/broll/`

Use these rules:

- If transcript files exist, do not retranscribe.
- If `broll_manifest.md` exists, read statuses and resume from the first incomplete stage.
- If TSX files exist but manifest says `planned`, reconcile the manifest instead of rebuilding blindly.
- If clips exist in `broll/`, infer what has already rendered from filenames and manifest state.
- Never delete finished outputs unless the user asks.

## Stage Contract

This is the strict execution order.

### Stage 0: Prerequisites And Source Inspection

1. Identify the source `.mp4`
2. Verify transcript presence or create it using AssemblyAI
3. Create the chunked transcript sidecar if missing
4. Run `ffprobe` to capture resolution, FPS, and duration
5. Derive the batch prefix from the video title or folder name

Output of this stage:

- source video path
- transcript JSON
- chunked transcript JSON
- video specs
- batch prefix

### Stage 1: Manifest Creation

Create or update `broll_manifest.md` using the canonical scout rules.

Requirements:

- no b-roll before 20 seconds
- 15-second minimum gap between clip starts
- exact 3-word cues from the transcript
- chapter-aware concept selection
- all rows initialized as `planned`

Do not stop for user approval here.

### Stage 2: Template Tool-Call Generation

Build clips from the manifest in batches of 2-3.

Requirements:

- use the existing Remotion project at `$BROLL_HOME/remotion`
- use approved template tool calls from `$BROLL_HOME/docs/TEMPLATE_TOOL_CALLS.md`
- use `renderTemplateToolCall()` from `$BROLL_HOME/remotion/src/broll/templates/templateToolRegistry.tsx`
- create only thin Remotion wrappers around structured template calls
- do not invent custom TSX layouts for template-covered ideas
- do not use the legacy bespoke-node workflow for `stack` or `comparison`
- if no approved template fits, mark/flag the moment instead of forcing a bad graphic
- render full-size QC stills at frames 150 and 270 for every built clip before marking it complete
- run `python3 "$BROLL_HOME/scripts/verify_qc_stills.py" "<qc_dir>" <clip_id>...` and fail the build stage if any still is missing
- only update manifest statuses to `built` after the clip code exists and the required stills exist

### Stage 3: TypeScript Validation

Run:

```bash
cd "$BROLL_HOME/remotion"
eval "$(/opt/homebrew/bin/brew shellenv)"
pnpm exec tsc --noEmit
```

Do not continue until TypeScript is clean.

### Stage 4: Composition Registration

Register the new clip batches in `src/broll/` and `src/Root.tsx`.

Requirements:

- create the batch aggregator file if needed
- import it into `Root.tsx`
- spread it into the composition registry

### Stage 5: QC

Use the mandatory full-size stills from Stage 2 and check the canonical readability/mechanical rules.

Minimum:

- QC stills at frames 150 and 270 must already exist; if they do not, fail back to Stage 2
- inspect each still full-size before using any contact sheet
- verify readable text
- verify the chosen template matches the spoken idea
- verify the graphic communicates useful information, not decoration
- verify the output came from an approved template call where possible
- reserve QA for higher-order judgment after template validation has already blocked bad geometry

Only advance a clip to `qc'd` when it passes.

### Stage 6: Sequential Rendering

Render clips one at a time. Never parallelize renders.

Requirements:

- `h264` codec only
- output filenames must include the exact cue and timecode
- write clips into the project's `broll/` folder
- update manifest statuses to `rendered` as each clip finishes

### Stage 7: Mandatory Approval Pause

Stop after rendering and wait for explicit user/editor approval before compositing.

At this pause, present:

- total rendered clips
- the rendered files in `broll/`
- anything that still looks risky or unfinished

The editor validates the AI's work at this gate. The editor should not be expected to choose every moment, author template calls, or design graphics manually.

Ask clearly whether to proceed with compositing or revise first.

This is the only mandatory approval stop in the normal pipeline.

### Stage 8: Final Composite

After explicit approval, run the final composite with both chyrons:

```bash
python3 "$BROLL_HOME/scripts/multi_composite.py" \
  "<source_video>.mp4" \
  "<video_directory>/broll"
```

The job is not done until both deliverables exist:

- `*_composite_YT.mp4`
- `*_composite_SS.mp4`

### Stage 9: Delivery Verification

Verify:

- both final composites exist
- the `broll/` directory contains the clip set
- `broll_manifest.md` reflects final state
- file sizes and durations look sane

Then report the outputs clearly.

## When To Keep Moving Vs Stop

Keep moving automatically when:

- setup is missing but fixable
- transcript is missing
- manifest is missing
- components need to be built
- TS errors are fixable
- QC failures require iteration
- clips need rendering

Stop and ask only when:

- the source video is ambiguous
- required assets or API keys are missing and cannot be inferred
- there is a destructive choice with unclear consequences
- the user must approve Stage 8 compositing

## Troubleshooting Mode

If the user asks for debugging instead of a full run:

1. inspect the project folder
2. inspect `broll_manifest.md`
3. inspect existing TSX files in `$BROLL_HOME/remotion/src/broll/`
4. run `pnpm exec tsc --noEmit`
5. inspect rendered clips or composite outputs
6. fix the earliest blocking failure in the stage order

Do not jump straight to re-transcription or rebuilding everything unless the artifacts are clearly unusable.

## Non-Negotiables

- Never create a throwaway Remotion project.
- Never modify the original source video.
- Never render in parallel.
- Never use `h265`.
- Never hardcode absolute paths in repo code.
- Never skip manifest state tracking.
- Never skip QC before render.
- Never composite before explicit user approval.
- Never end the job early if the user asked for the full pipeline.
