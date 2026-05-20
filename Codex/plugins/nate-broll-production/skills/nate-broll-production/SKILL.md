---
name: nate-broll-production
description: Orchestrate the full Nate Jones Media video production workflow in the right order. Use when the user asks for the production pipeline, end-to-end video processing, raw media to clean edit, editor onboarding/run-through, radio edit then b-roll, b-roll plus CMP handoff, deliverables packaging, or asks what the next step is for a Nate video folder.
metadata:
  priority: 10
  promptSignals:
    phrases:
      - "production pipeline"
      - "full b-roll workflow"
      - "end to end"
      - "raw media to CMP"
      - "radio edit then b-roll"
      - "set the editor up"
      - "what is the next step"
      - "prepare for CMP"
      - "deliverables package"
    allOf:
      - [Nate, video]
      - [b-roll, deliverables]
      - [radio, edit]
    anyOf:
      - "CMP"
      - "Content Master Pro"
      - "Remotion"
      - "AssemblyAI"
      - "editor"
      - "YouTube"
      - "Substack"
    noneOf: []
    minScore: 6
---

# Nate B-Roll Production Orchestrator

Use this as the top-level operator for Nate Jones Media video work. Its job is timing and routing: decide which stage the folder is in, run the right specialist workflow, stop at the right human gates, and avoid doing work out of order.

Specialist skills:

- `$radio-edit`: raw talking-head media -> editor-ready XML/FCPXML rough cut.
- `$broll-pipeline`: clean edited export -> b-roll clips, composites, delivery package, audio, descriptions, transcript, shorts, and CMP manifest.

Do not collapse the two specialist workflows into one blind run. The clean edit from the editor is the boundary between them.

## Operating Model

1. Inspect the current folder and source media before choosing a path.
2. Classify the folder into exactly one current stage.
3. Run only the next valid stage.
4. Stop at human review gates instead of pretending the machine can approve taste.
5. Resume from existing artifacts whenever possible.
6. Keep raw, working, and upload-ready files separate.

## Stage Classifier

### A. Setup Or Onboarding

Use when the user is setting up a new editor or machine, or there is no obvious source video.

Do:

- Verify repo setup with `$BROLL_HOME/scripts/package_check.sh`.
- Render template previews with `$BROLL_HOME/scripts/render_template_previews.sh` when teaching review.
- Point the editor to `https://www.limitededitionjonathan.com/docs/nate-broll-editor-onboarding`.
- Do not start production work until a source video folder is identified.

### B. Raw Media Needs Radio Edit

Use when the folder contains raw talking-head source media and no clean edited export yet.

Signals:

- source files are camera/raw/interview recordings
- user asks for radio edit, rough cut, clean spoken flow, false-start cleanup, paper edit, XML timeline, Resolve, or Premiere
- no approved clean export is present

Next action:

- Use `$radio-edit` on the source video.
- Create `radio_edit_vN/`.
- Produce clean and aggressive XML/FCPXML timelines, captions, readable transcript, audit files, and Resolve/Premiere package folders.

Stop gate:

- Stop after the radio-edit package is ready.
- Tell the editor to import the XML/FCPXML into the NLE, review pacing/taste, make judgment edits, and export a clean edited video.
- Do not run b-roll against raw media unless the user explicitly overrides the workflow.

### C. Clean Export Ready For B-Roll

Use when a clean edited video exists and needs graphics, chyrons, delivery assets, or CMP packaging.

Signals:

- user points to a finished/clean export
- source is already edited for publishing
- radio-edit package exists and a clean export has been produced

Next action:

- Use `$broll-pipeline` on the clean export from its video project folder.
- It should transcribe/reuse transcript, scout moments, build template clips, validate, render sequentially, pause for b-roll approval, composite final videos, and build delivery assets.

Stop gate:

- Pause before final compositing for b-roll approval.
- After approval, continue through final composites and Stage 9 delivery packaging.

### D. Delivery Package Exists

Use when `deliverables/upload/` already exists.

Next action:

- Inspect, do not rebuild.
- Verify expected files:
  - `delivery_manifest.json`
  - `README_MANIFEST.md`
  - `broll_manifest.md`
  - `transcript.md`
  - `youtube_description.md`
  - `podcast_description.md`
  - `youtube_captions.srt`
  - `youtube_final.mp4`
  - `substack_final.mp4`
  - `podcast.mp3`
  - `podcast_preview.mp3`
  - `shorts/`
- Confirm `deliverables/working/` contains scratch files and should not be bulk-uploaded.
- If filenames are messy, run `$BROLL_HOME/scripts/prepare_cmp_delivery.py` to normalize the package.

### E. CMP Handoff

Use when the user asks to send, upload, ingest, or hand off the finished package to CMP.

Rules:

- The upload source is `deliverables/upload/`, not the whole project folder.
- `delivery_manifest.json` is the machine contract.
- `README_MANIFEST.md` is the human contract.
- Do not include raw transcript JSON, joined raw media, EDL scratch files, temp renders, or QC snippets in the upload folder.
- If using CMP tooling, dry-run or inspect first when available, then ingest only the clean upload folder.

## Human Gates

Stop and ask for approval at these points:

1. **After radio edit output:** editor must review the XML/FCPXML in Resolve/Premiere and export a clean edit.
2. **Before b-roll compositing:** editor/producer must approve generated b-roll clips and QC stills.
3. **Before CMP ingest/upload:** operator must confirm `deliverables/upload/` is the intended clean handoff folder.

Do not stop for routine deterministic setup, transcript creation, validation, or package normalization unless a command fails or required credentials/assets are missing.

## Concurrency Rules

- Radio-edit prep can be queued or staggered across videos, but avoid launching many heavy local transcription or XML jobs without checking machine state.
- Remotion rendering and final b-roll compositing must be sequential on one machine. Do not render multiple b-roll clips or videos in parallel.
- A production batch should move videos through stations: radio edit prep -> editor XML review -> clean export -> b-roll review -> delivery package.

## Routing Cheat Sheet

- Raw talking-head file + no clean edit: run `$radio-edit`.
- Clean edited export + needs graphics/deliverables: run `$broll-pipeline`.
- Finished composites but no upload folder: resume `$broll-pipeline` at delivery packaging.
- `deliverables/upload/` exists: inspect/normalize/package, do not rebuild.
- User asks “what next?”: classify the folder and report the next valid stage plus the stop gate.

## Required Final Summary

Always finish with:

- current stage
- next action completed
- files/folders created or verified
- human gate, if any
- exact next command or instruction for the editor
- whether CMP upload/ingest is ready
