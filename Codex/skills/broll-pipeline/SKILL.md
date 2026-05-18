---
name: broll-pipeline
description: Strict Codex runbook for the Nate Jones Media b-roll pipeline. Use when the user wants to set up, run, resume, or troubleshoot transcript-driven b-roll generation, Remotion clip rendering, final chyron compositing, delivery packaging, podcast/preview audio exports, or vertical short-video cutdowns for a source video.
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

AssemblyAI transcript requests must include the current speech model routing field:

```json
{
  "audio_url": "<upload_url>",
  "auto_chapters": true,
  "speech_models": ["universal-3-pro", "universal-2"]
}
```

Do not submit the legacy `audio_url` + `auto_chapters`-only payload; the API now rejects it.

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

### Stage 9: Delivery Package, Audio Exports, And Shorts

After the final composites exist, create a clean deliverables folder and a separate working folder in the video project directory:

```bash
<VIDEO_TITLE>_DELIVERABLES_<source_stem>/
<VIDEO_TITLE>_WORKING_<source_stem>/
```

The deliverables folder must be safe to select-all and upload. It should contain only final handoff assets, not raw JSON, joined source media, EDL scratch files, QC snippets, or temp files.

Use simple editor-facing filenames inside the deliverables folder:

- `<title>_final_youtube.mp4`
- `<title>_final_substack.mp4`
- `<title>_podcast_full.mp3`
- `<title>_preview_intro_<duration>s.mp3`
- `shorts_raw_9x16_editorial/`
- `<title>_transcript.md`
- `<title>_youtube_captions.srt`
- `<title>_youtube_description.md`
- `<title>_podcast_description.md`
- `README_MANIFEST.md`
- `broll_manifest.md`
- any useful QC contact sheets, if they exist

Use the working folder for:

- raw AssemblyAI transcript JSON
- raw-source readable transcript
- raw-source concat lists or joined raw source media
- editorial EDL JSON/Markdown
- QC stills/contact sheets
- start/end audio snippets
- any temporary render files

Create a human-readable transcript Markdown file from the AssemblyAI transcript JSON:

- Use the transcript `text` field as the primary source.
- Format it as readable paragraphs, not one giant wall of text.
- Include source video name, total duration, and generation date at the top.
- If `chapters` are available, add a chapter/timestamp outline before the full transcript.
- Preserve the words as spoken; do not rewrite the transcript into polished prose.
- Save it as `<deliverables_dir>/<title>_transcript.md`.

Create a YouTube-ready captions file from the completed AssemblyAI transcript:

- Save it as `<deliverables_dir>/<title>_youtube_captions.srt`.
- Use AssemblyAI's SRT subtitle export endpoint for the completed transcript ID; do not rely on YouTube auto-captions when an AssemblyAI transcript already exists.
- Keep this YouTube-only for now. Do not add VTT, Resolve caption files, or custom caption CSVs unless the user asks.
- Use plain UTF-8 SRT with no styling markup.
- Prefer readable captions with a reasonable `chars_per_caption` value when the export endpoint supports it.
- If the AssemblyAI SRT export fails, record the failure in `README_MANIFEST.md` and do not invent a hand-made captions file unless the user explicitly asks for a fallback.

Create the full podcast MP3 from the final stitched source video audio unless the user explicitly asks for composite audio:

```bash
ffmpeg -y -i "<source_video>.mp4" \
  -map 0:a:0 -vn -codec:a libmp3lame -b:a 192k \
  "<deliverables_dir>/<title>_podcast_full.mp3"
```

Create a sub-60-second preview MP3 from the beginning. Choose a natural sentence or thought break from the transcript words; do not cut mid-phrase just to get closer to 60 seconds. Add a short fade out only if it improves the edit:

```bash
ffmpeg -y -i "<source_video>.mp4" \
  -map 0:a:0 -vn -t <break_seconds> \
  -af "afade=t=out:st=<fade_start>:d=0.30" \
  -codec:a libmp3lame -b:a 192k \
  "<deliverables_dir>/<title>_preview_intro_<duration>s.mp3"
```

Preferred preview selection workflow:

1. Inspect the first 60 seconds of transcript words.
2. Pick the strongest complete opener under 60 seconds.
3. Prefer the first clean thesis/tease break over an arbitrary length target.
4. Verify the exported preview duration is under 60 seconds.

Create a YouTube description draft with Nate's current format:

- Save it as `<deliverables_dir>/<title>_youtube_description.md`.
- Start with one Substack link line when a post, playbook, skill pack, or interview URL is available:
  `<link label>: https://natesnewsletter.substack.com/...`
  Choose a concrete label such as `Full Post w/ ...`, `Full article w/ ...`, or `Exclusive Interview w/ ...`. If no URL is known, write `[SUBSTACK LINK TK]`.
- Add a separator line of underscores: `__________________________________`.
- Use this opening shape:
  1. A question beginning `What's really happening...`
  2. A contrast sentence: `The common story is that ... — but the reality is ...`
  3. `In this video, I share the inside scoop on ...`
  4. 3-5 scannable topic bullets or lines, preferably starting with `Why`, `How`, `What`, or `Where`.
  5. One stakes paragraph naming who should care and what shift or action matters.
- Then add `Chapters:` followed by timestamped chapter lines.
  Use AssemblyAI `chapters` when available; if chapters are missing, infer draft chapter candidates from transcript structure and label the file as draft/review-needed.
  Format timestamps as `MM:SS` or `HH:MM:SS`, zero-padded where natural; do not invent precision beyond what the transcript supports.
- End with this footer:
  `Subscribe for daily AI strategy and news.`
  `For deeper playbooks and analysis: https://natesnewsletter.substack.com/`
  blank line
  `Listen to this video as a podcast.`
  `Spotify: https://open.spotify.com/show/0gkFdjd...`
  `Apple Podcasts: https://podcasts.apple.com/us/podcast...`
- Keep the copy concrete and upload-facing. Do not use generic SEO filler, do not over-polish away Nate's framing, and do not call placeholder URLs final.

Create a podcast description draft:

- Save it as `<deliverables_dir>/<title>_podcast_description.md`.
- Use the Acast-native version of the YouTube description, not a copy/paste of the YouTube upload text.
- Do not include chapters by default.
- Do not include `Listen to this video as a podcast.` in the podcast description.
- Put the Substack CTA first because podcast descriptions should serve the subscriber/sales pipeline:
  `For deeper playbooks and analysis: https://natesnewsletter.substack.com/`
- Use this structure:
  1. Substack CTA first line.
  2. A `What's really happening...` opening question.
  3. A `The common story is that ... — but the reality is ...` contrast.
  4. `In this video, I share the inside scoop on ...`.
  5. 3-5 key idea bullets or short lines, preferably starting with `Why`, `How`, `What`, or `Where`.
  6. One stakes/so-what paragraph for operators, builders, marketers, executives, or the relevant audience.
  7. `Subscribe for daily AI strategy and news.` when it fits the episode and current feed style.
  8. Optional Spotify/Apple links only if the current feed format expects them; otherwise omit them because the listener is already in a podcast player.
  9. Final line: `Hosted on Acast. See acast.com/privacy for more information.`
- Keep paragraph spacing clean for podcast apps: short paragraphs, bullets separated enough to scan, no YouTube separators, no hashtags, no tags, no chapter list unless the user explicitly requests podcast chapters.
- Treat the current podcast format as the source of truth when a newer reference is available.
- Do not claim the podcast description is final unless it has been checked against the current publishing format.

Create vertical short-video candidates from the original raw wide source media when that media folder is available. Do not use the b-roll composite for shorts unless the user explicitly asks. The social shorts are discovery/editing assets and should preserve the wider original framing for a full 9x16 punch-in.

If the matching raw media folder contains one or more source clips:

1. Sort them by filename/time order.
2. Join them into a working source timeline for transcript discovery, or map EDL ranges back to the original files if needed.
3. Generate a separate AssemblyAI transcript for the raw joined source.
4. Use that raw transcript for shorts discovery, not the edited full-video transcript.
5. Expect false starts, repeated takes, gaps, and unused material. The selector must make editorial decisions, not blindly cut every candidate span.

If the raw media folder is unavailable, fall back to the clean stitched edited source video and note that limitation in the manifest.

Selection rules:

- Use the word-level transcript timestamps.
- Hard cap the first-pass editorial shorts package at five clips unless the user explicitly asks for more.
- Do not repeat the same idea across clips.
- Do not reuse source transcript spans across clips.
- Each clip must be under 2 minutes.
- Each clip must be self-contained for a cold viewer.
- Prefer complete thought units with a clear hook, context, and payoff.
- Starts must not depend on dangling references like "this", "that", "as I said", "the thing", or "what we just talked about" unless the clip itself supplies that context.
- Endings must resolve a complete thought; never end on a half-thought or obvious lead-in to missing context.
- Cut on natural sentence/thought boundaries and use small boundary handles so first/last words are not clipped.
- Stitched clips are allowed: combine multiple non-contiguous source ranges when that makes the short more self-contained or removes dead air, false starts, repeated takes, or long ramps before the point.
- Skip weak or context-dependent moments even if they fill a quota.
- Name files with a two-digit prefix and content slug: `01_clear_content_title.mp4`, `02_next_clip.mp4`, etc.

For every selected short, create an editorial EDL record in the working folder before rendering:

- number
- output filename slug
- readable title
- one-sentence summary
- hook sentence
- payoff sentence
- source ranges
- why the clip is self-contained
- QC notes after render

Export the short clips in the raw-source editorial vertical format:

- output canvas: `1080x1920`
- source crop: centered full-height `9x16` punch-in from the raw `1920x1080` source, typically `crop=608:1080:(iw-608)/2:0,scale=1080:1920`
- placement: full-frame vertical
- padding: none
- audio: original source audio preserved

Example FFmpeg shape for a single continuous range:

```bash
ffmpeg -nostdin -y -i "<source_video>.mp4" \
  -ss <start_seconds> -t <duration_seconds> \
  -vf "crop=608:1080:(iw-608)/2:0,scale=1080:1920,setsar=1,format=yuv420p" \
  -map 0:v:0 -map "0:a?" \
  -c:v libx264 -preset veryfast -crf 18 \
  -c:a aac -b:a 192k -movflags +faststart \
  "<deliverables_dir>/shorts_raw_9x16_editorial/01_content_slug.mp4"
```

For stitched clips, use `trim`/`atrim` plus `concat` in `filter_complex` so source ranges combine into one output. Keep the EDL in the working folder.

Shorts QC:

- Verify every short is `1080x1920`, has audio, and is under 2 minutes.
- Extract first and last 3 seconds of audio into the working folder and check for clipped words or half-thought endings.
- Generate preview stills/contact sheet in the working folder, not the clean deliverables folder unless the user asks to include them.
- If a start has dangling context or an ending feels unresolved, revise the EDL and rerender before finalizing.

Create a human-readable `README_MANIFEST.md` in the deliverables folder. It must explain:

- what is inside the delivery folder
- what lives in the sibling working folder and should not be bulk-uploaded
- final platform video filenames
- full podcast MP3 filename and duration
- preview MP3 filename, duration, and why that cut point was chosen
- human-readable transcript filename
- YouTube captions SRT filename and whether it came directly from AssemblyAI
- YouTube description filename, Substack link status, and chapter source
- podcast description filename and whether it matched a confirmed current format or is a draft
- short-video format and source
- every generated short clip with number, filename, readable title, duration, source timestamp range(s), hook, payoff, self-contained note, and one-sentence summary

### Stage 10: Delivery Verification

Verify:

- both final composites exist
- the deliverables folder exists
- the working folder exists
- the deliverables folder contains only handoff/upload assets
- raw JSON, joined raw source media, EDL scratch files, QC snippets, and temp files are not in the deliverables folder
- both copied platform videos exist inside the deliverables folder
- the human-readable transcript Markdown exists inside the deliverables folder
- the YouTube captions SRT exists inside the deliverables folder, is plain UTF-8, and came from AssemblyAI's completed transcript export
- the YouTube description Markdown exists inside the deliverables folder and includes the Nate-format Substack/link placeholder, separator, common-story/reality framing, chapters or marked draft chapter candidates, and standard subscribe/podcast footer
- the podcast description Markdown exists inside the deliverables folder and indicates whether the format is confirmed or draft
- the full podcast MP3 exists and duration matches the source/final videos
- the preview MP3 exists and is under 60 seconds
- the editorial shorts folder exists
- there are exactly five first-pass editorial shorts unless the user requested a different count
- every editorial short is `1080x1920`, has audio, and is under 2 minutes
- every editorial short has a working EDL entry with hook, payoff, source ranges, and self-contained note
- no editorial short reuses source spans from another short
- the human-readable `README_MANIFEST.md` exists and lists every deliverable
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
- Never leave the final deliverables scattered when the user asks for a full delivery package.
- Never mix working files into the clean deliverables folder.
- Never cut the preview audio mid-thought when a natural break under 60 seconds is available.
- Never create short-video cutdowns from the b-roll composite unless the user explicitly asks.
- Never use padded vertical shorts when raw wide media is available; use full 9x16 raw-source punch-ins with no padding.
- Never hardcode a large shorts count; first-pass editorial shorts are capped at five unless the user asks for more.
- Never allow a short to depend on missing context, dangling references, clipped words, or half-thought endings.
- Never reuse source spans across the five editorial shorts.
- Never render editorial shorts without a working EDL that records hook, payoff, source ranges, and self-contained rationale.
- Never omit the human-readable delivery manifest.
- Never leave only raw transcript JSON in the final deliverables; include a readable Markdown transcript.
- Never rely on YouTube auto-captions when an AssemblyAI transcript is already available; include the YouTube-ready SRT caption file.
- Never omit the YouTube description draft with Nate-format hook, chapters, and footer from a full delivery package.
- Never call the podcast description final unless the current podcast format has been checked.
- Never end the job early if the user asked for the full pipeline.
