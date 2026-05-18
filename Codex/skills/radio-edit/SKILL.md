---
name: radio-edit
description: Create transcript-driven radio-edit rough cuts for Nate Jones Media videos. Use when the editor asks for a radio edit, clean spoken-flow edit, transcript edit, paper edit, false-start cleanup, repetition cleanup, profanity cleanup, or Resolve/Premiere XML timeline from a talking-head source video.
metadata:
  priority: 9
  promptSignals:
    phrases:
      - "radio edit"
      - "clean spoken flow"
      - "false starts"
      - "repetition"
      - "repeated takes"
      - "paper edit"
      - "transcript edit"
      - "XML timeline"
      - "Resolve XML"
      - "Premiere XML"
      - "FCPXML"
    allOf:
      - [video, transcript]
      - [radio, edit]
      - [clean, timeline]
    anyOf:
      - "DaVinci Resolve"
      - "Premiere"
      - "XML"
      - "FCPXML"
      - "AssemblyAI"
      - "word-level"
    noneOf: []
    minScore: 6
---

# Radio Edit Skill

Use this skill to make a transcript-driven radio-edit rough cut for a talking-head source video. The output is a DaVinci Resolve-first FCPXML timeline that references the original media. Never modify, overwrite, or render over the source video.

This is intentionally a hybrid workflow:

- code handles transcription, timestamps, handles, XML, EDL, and deterministic cleanup
- Codex handles the editorial paper edit by choosing the best surviving spoken story

Do not use an OpenAI API key for the editorial pass. The editor will run Codex, and Codex itself is the LLM eyeballs.

## Output Contract

Create a new folder beside the source video:

```text
radio_edit_vN/
  <source>_transcript.json
  <source>_readable_transcript.md
  numbered_transcript_segments.tsv
  paper_edit_keep_vN.json
  <source>_radio_edit_vN_clean.fcpxml
  <source>_radio_edit_vN_clean.edl
  <source>_radio_edit_vN_clean_captions.srt
  <source>_radio_edit_vN_clean_cuts.csv
  <source>_radio_edit_vN_clean_decisions.json
  <source>_radio_edit_vN_aggressive.fcpxml
  <source>_radio_edit_vN_aggressive.edl
  <source>_radio_edit_vN_aggressive_captions.srt
  <source>_radio_edit_vN_aggressive_cuts.csv
  <source>_radio_edit_vN_aggressive_decisions.json
  resolve_package/
    <source>_radio_edit_vN_resolve_clean.fcpxml
    <source>_radio_edit_vN_resolve_clean_captions.srt
    <source>_radio_edit_vN_resolve_aggressive.fcpxml
    <source>_radio_edit_vN_resolve_aggressive_captions.srt
    README_IMPORT.md
  premiere_package/
    <source>_radio_edit_vN_premiere_clean.fcpxml
    <source>_radio_edit_vN_premiere_clean_captions.srt
    <source>_radio_edit_vN_premiere_aggressive.fcpxml
    <source>_radio_edit_vN_premiere_aggressive_captions.srt
    README_IMPORT.md
  experimental_caption_embedded_xml/
    README_EXPERIMENT.md
```

Use the next available `vN`. If prior folders exist (`radio_edit_v3`, `radio_edit_v4`, etc.), do not overwrite them.

## Setup

Load the repo env before commands that need it:

```bash
if [ -f ~/.codex/.env ]; then
  set -a
  source ~/.codex/.env
  set +a
fi
```

Required repo script:

```bash
python3 "$BROLL_HOME/scripts/radio_edit_xml.py" --help
```

If `BROLL_HOME` or the script is missing, run:

```bash
bash "$BROLL_HOME/Codex/install.sh" "$BROLL_HOME"
```

## Workflow

### 1. Locate And Inspect Source

Use the user-provided video path. If they are in a video folder and only say “this video,” locate the obvious `.mp4`/`.mov`.

Run `ffprobe` for duration, FPS, resolution, and audio channels:

```bash
ffprobe -v error \
  -show_entries format=duration:stream=index,codec_type,codec_name,width,height,r_frame_rate,channels,channel_layout,sample_rate \
  -of json "$SOURCE"
```

### 2. Reuse Or Create Word-Level Transcript

Prefer an existing transcript in nearby `radio_edit_*` folders or beside the source:

- `<source>_transcript.json`
- `radio_edit_v*/<source>_transcript.json`
- `radio_edit_prototype/<source>_transcript.json`

If missing, create one with AssemblyAI. Extract a small MP3 sidecar, upload it, and submit transcription with:

```json
{
  "audio_url": "<upload_url>",
  "speech_models": ["universal-3-pro", "universal-2"],
  "punctuate": true,
  "format_text": true,
  "disfluencies": true,
  "auto_chapters": false
}
```

Clean up temporary upload/job/audio sidecars after the final transcript is saved. Do not write API keys into project files.

### 3. Create Numbered Phrase Segments

Generate `numbered_transcript_segments.tsv` from the word-level transcript using `$BROLL_HOME/scripts/radio_edit_xml.py` as the segmenting contract. If needed, run a short Python snippet that imports the script, calls `load_words()` and `segment_words()`, and writes:

```text
segment_id<TAB>start<TAB>end<TAB>text
```

Also create `<source>_readable_transcript.md` for the editor/producer. Use readable paragraphs from the AssemblyAI transcript text, include source filename and generation date, and preserve the spoken wording.

### 4. Paper Edit With Codex

Read the numbered segments in chunks. Build a keep-list, not a cut-list.

Keep the best surviving spoken story. Prefer later, cleaner retakes when the speaker repeats an idea. Remove:

- setup chatter and post-roll checks
- abandoned starts
- repeated takes
- repeated examples
- rough phrasing followed by cleaner phrasing
- profanity or unsafe language
- isolated fragments
- redundant outros
- long tangents that do not serve the clean radio edit

Preserve:

- the main argument
- useful examples
- transitions needed for flow
- natural phrasing and enough surrounding breath to feel editable

Create `paper_edit_keep_vN.json`:

```json
{
  "notes": {
    "strategy": "Paper edit: selected segment IDs form the best spoken story; code turns this into FCPXML.",
    "clean": "Safer keep-list.",
    "aggressive": "Tighter keep-list for editor comparison."
  },
  "keep_clean": [[3, 12], [15, 24], 31],
  "keep_aggressive": [[3, 12], [15, 22], 31]
}
```

Use ranges for consecutive segment IDs. Keep both `clean` and `aggressive` unless the user asks for only one.

### 5. Generate XML Timelines

Use phrase mode, not word mode. Keep natural handles:

- `--head-pad 0.22`
- `--tail-pad 0.38`
- `--keep-pause 0.85`

Run:

```bash
python3 "$BROLL_HOME/scripts/radio_edit_xml.py" \
  --transcript "$OUT/<source>_transcript.json" \
  --source "$SOURCE" \
  --out-dir "$OUT" \
  --duration "$DURATION_SECONDS" \
  --fps "$FPS" \
  --width "$WIDTH" \
  --height "$HEIGHT" \
  --audio-channels "$AUDIO_CHANNELS" \
  --mode phrase \
  --keep-pause 0.85 \
  --head-pad 0.22 \
  --tail-pad 0.38 \
  --keep-segments "$OUT/paper_edit_keep_vN.json" \
  --keep-key keep_clean \
  --suffix _radio_edit_vN_clean
```

Repeat with:

```bash
--keep-key keep_aggressive --suffix _radio_edit_vN_aggressive
```

### 6. Create Editor Transcript And Caption Sidecars

The radio edit should save editors from retranscribing. Generate caption/transcript sidecars from the same AssemblyAI word-level transcript:

- full readable transcript: `<source>_readable_transcript.md`
- clean radio edit captions: `<source>_radio_edit_vN_clean_captions.srt`
- aggressive radio edit captions: `<source>_radio_edit_vN_aggressive_captions.srt`

Caption rules:

- SRT is the reliable cross-editor sidecar for now.
- Retimed SRT captions must match the edited timeline, not the original source timeline.
- Build captions from the kept word ranges after applying the same source cuts, handles, and timeline offsets used for the FCPXML.
- Keep caption blocks readable: short lines, complete phrase boundaries where possible, no styling markup, plain UTF-8.
- Do not ask Premiere or Resolve to re-transcribe when a word-level AssemblyAI transcript already exists.

Create editor-specific package folders:

- `resolve_package/`: Resolve-first FCPXML files plus matching SRT caption sidecars and a short `README_IMPORT.md`.
- `premiere_package/`: Premiere-friendly FCPXML/XML files plus matching SRT caption sidecars and a short `README_IMPORT.md`.

Package rule:

- The default package is XML + SRT sidecar, not one magic XML file.
- Include import instructions that tell the editor to import the timeline XML first, then import the matching SRT captions if the NLE does not attach them automatically.
- Do not claim captions are embedded in the XML unless that exact output has been tested in the target app/version.

Experimental path for later testing:

- Create `experimental_caption_embedded_xml/README_EXPERIMENT.md` describing the goal: one Resolve/Premiere import file that brings in timeline and captions together.
- If Codex creates experimental caption-embedded XML variants, name them clearly and keep them out of the default editor package until real import testing proves they work in the editor's Resolve/Premiere versions.
- Treat this as a test target, not production behavior.

### 7. Validate

Always run:

```bash
xmllint --noout "$OUT/<source>_radio_edit_vN_clean.fcpxml"
xmllint --noout "$OUT/<source>_radio_edit_vN_aggressive.fcpxml"
```

Also verify:

- `<source>_readable_transcript.md` exists
- clean and aggressive SRT captions exist
- the package folders exist
- each package has XML/FCPXML plus matching SRT sidecars
- each package has a `README_IMPORT.md`
- any experimental caption-embedded XML is labeled experimental and separated from the default packages

Summarize:

- output folder
- clean and aggressive FCPXML paths
- Resolve package path
- Premiere package path
- clean and aggressive SRT caption paths
- original duration
- edited duration
- reduction percentage
- clip count
- whether XML validation passed

## Rules

- Original media stays untouched.
- Do not use OpenAI API keys or any external LLM API for the editorial pass.
- Do not overwrite prior version folders.
- Do not delete earlier radio-edit outputs.
- Keep the XML as the source of truth, with JSON/CSV files as audit helpers.
- Prefer FCPXML for Resolve. EDL is a fallback.
- Include editor package folders with timeline XML plus SRT caption sidecars so editors do not have to re-transcribe.
- Do not promise one-file XML caption import until it has been tested in the actual Resolve/Premiere versions in use.
- If the user reports issues, make a new version folder and iterate.
