---
name: broll-pipeline
description: End-to-end automated b-roll pipeline for Nate Jones Media videos. Use this skill whenever the user mentions b-roll, "b-roll process", generating motion graphics for a video, compositing clips onto a video, applying chyrons, or asks to "go through the b-roll process" for any video. Also trigger when the user shares a video file path and asks you to create graphics, overlays, or visual enhancements for it. This skill covers the ENTIRE pipeline from transcript analysis through rendered Remotion clips to final composited deliverables with platform chyrons. Always use this skill — never freestyle the b-roll process.
---

# B-Roll Pipeline Skill

You are executing the automated b-roll pipeline for Nate Jones Media. This pipeline takes a video with a transcript and produces platform-ready deliverables (YouTube + Substack) with animated b-roll overlays and branded chyrons.

**The original video is NEVER modified.** All outputs are new files.

## Critical Rules (violations = pipeline failure)

1. **Use the existing Remotion project** at `$BROLL_HOME/remotion/`. Never create a throwaway project.
2. **Use BRollTemplate** from `src/broll/shared.tsx`. It enforces safe zones, backgrounds, grids, and title cards. Never reimplement these.
3. **File naming MUST include the timecode**: `CL-NNN-three word cue-SECONDS.MILLISECONDS.mp4`. The `multi_composite.py` script parses the timecode from the filename to place clips. Wrong naming = clips don't appear.
4. **Three-word cue must be EXACT verbatim transcript words.** No paraphrasing, no case changes. The editor searches by filename in Resolve.
5. **No b-roll before 20 seconds** of video. Let the speaker establish presence.
6. **15-second minimum gap between clip start times.** Clips are 10s each — this guarantees 5s of talking head between clips.
7. **Every clip must be a bespoke data visualization.** Text-only clips are a failure. Use SVGs, charts, diagrams, animated icons, node graphs. Each must be a handcrafted motion graphic.
8. **Render sequentially.** Never parallelize renders — Chrome instances conflict.
9. **QC screenshots at frames 50, 150, 250** before rendering. Check readability, overlap, and sizing.
10. **Always run compositing AND chyrons** as the final step. The pipeline is not done until `_YT.mp4` and `_SS.mp4` exist.
11. **Never use specific AI model version names** unless the transcript explicitly says them. Training data is obsolete. Use company/product names: "OpenAI" or "ChatGPT" (not "GPT-4 Turbo"), "Claude" (not "Claude 3.5 Sonnet"), "Gemini" (not "Gemini 1.5 Pro"). If the speaker says a specific model name, match it exactly.
12. **Readability minimums are non-negotiable.** All text ≥40px (`Math.round(40 * zone.scale)`). Max 4 elements per frame (1 dominant + ≤3 supporters). Total visible text ≤90 characters per clip. Lines never pass through container borders. No decorative empty boxes. Builders write a design spec BEFORE coding. See the broll-builder agent definition for the full rule set.
13. **Builder batches are 2-3 clips** (not 5). Smaller batches give each builder more context to think carefully about each clip's design and dwell timing.

## Pipeline Steps

### Step 0: Prerequisites & Video Specs

Before doing ANYTHING:

**Verify these exist:**

```
Required files:
- Source video MP4
- Transcript JSON (AssemblyAI word-level, `*_transcript.json`)
- Remotion project: $BROLL_HOME/remotion/
- BRollTemplate: $BROLL_HOME/remotion/src/broll/shared.tsx
- Logo pack: $BROLL_HOME/remotion/public/logos/ (3400+ brand SVGs)
- Logo catalog: .../public/logos/catalog.json + aliases.json
- Composite script: $BROLL_HOME/scripts/multi_composite.py
- YouTube Chyron: $BROLL_HOME/assets/Youtube Chyron.mov
- Substack Chyron: $BROLL_HOME/assets/Substack Chyron.mov
```

If the transcript doesn't exist, run transcription:

1. **Extract audio:**
   ```bash
   ffmpeg -i "<source>.mp4" -vn -acodec pcm_s16le -ar 44100 -ac 1 "<source>_audio.wav"
   ```

2. **Upload to AssemblyAI:**
   ```bash
   curl -s -X POST "https://api.assemblyai.com/v2/upload" \
     -H "authorization: $ASSEMBLYAI_API_KEY" \
     --data-binary @"<audio_file>"
   ```

3. **Request transcription WITH auto_chapters:**
   ```bash
   curl -s -X POST "https://api.assemblyai.com/v2/transcript" \
     -H "authorization: $ASSEMBLYAI_API_KEY" \
     -H "content-type: application/json" \
     -d '{"audio_url": "<upload_url>", "auto_chapters": true}'
   ```

4. **Poll for completion:**
   ```bash
   curl -s "https://api.assemblyai.com/v2/transcript/<id>" \
     -H "authorization: $ASSEMBLYAI_API_KEY"
   ```

5. **Save full response** as `<source>_transcript.json`

6. **Create chunked transcript sidecar** — extract the `chapters` and `words` arrays from the response and save as `<source>_transcript_chunked.json`:
   ```json
   {
     "video": "<absolute_path_to_source_video>",
     "duration": <duration_in_seconds>,
     "chapters": [
       {
         "summary": "Chapter summary text...",
         "headline": "Short headline",
         "start": 0,
         "end": 142350,
         "gist": "One-sentence description"
       }
     ],
     "words": [ /* full words array from response */ ]
   }
   ```
   Chapter times are in **milliseconds**. The chunked sidecar is what the @broll-scout agent reads.

The API key is in `~/.claude/.env` → `ASSEMBLYAI_API_KEY`.

**Auto-detect video specs with ffprobe:**

```bash
ffprobe -v quiet -print_format json -show_streams "<source_video>.mp4"
```

Extract and record:
- **Resolution** (width x height) — render b-roll at this resolution
- **FPS** — note for reference (source may be 24fps, b-roll renders at 30fps, FFmpeg handles the mismatch)
- **Duration** — used to calculate target clip density (8 per 10 minutes)

**Derive batch prefix from video title:**

Auto-generate a 2-3 letter prefix from the video folder name. Take the first letter of each significant word (skip articles/prepositions). Examples:
- "THE CONTEXT LAYER NOBODY IS TALKING ABOUT" → `CL` (Context Layer)
- "4 TYPES OF AGENTS" → `TA` (Types Agents)
- "CREATIVE IS NOT THE COMMAND LINE" → `CL` (Creative Line) — if collision, use `CN`

The prefix is used in all filenames: `<PREFIX>-NNN-cue-timecode.mp4`

### Step 1: Scout Agent → Build Manifest

Spawn the **@broll-scout** agent to analyze the transcript and produce the manifest.

**Provide the scout with:**
- Path to `<source>_transcript_chunked.json` (created in Step 0)
- Video duration (from ffprobe)
- Video directory path
- Video title (for batch prefix derivation)
- Resolution (from ffprobe)

The scout agent reads the chunked transcript (with semantic chapter boundaries from AssemblyAI auto_chapters), applies density and spacing rules, and writes `broll_manifest.md` in the video directory.

**The scout enforces all selection rules:**
- 8 clips per 10 minutes target density
- No b-roll before 20 seconds
- 15-second minimum gap between clip start times
- Chapter-aware moment selection
- EXACT verbatim 3-word cues from the words array

**Manifest format (what the scout produces):**

```markdown
# B-Roll Manifest — <Video Title>

**Source:** <source video path>
**Resolution:** <width>x<height>
**Duration:** <duration>s
**Batch Prefix:** <PREFIX>
**Generated:** <date>

## Clips

| # | Status | Timecode | 3-Word Cue | Concept | Filename |
|---|--------|----------|------------|---------|----------|
| 1 | planned | 42.350 | "is functionally infinite" | Data scale visualization | CL-001-is functionally infinite-42.350.mp4 |
| 2 | planned | 78.120 | "skills went from" | Personal to org transition | CL-002-skills went from-78.120.mp4 |
...
```

**Status values:** `planned` → `built` → `qc'd` → `rendered`

Update the status column as each clip progresses. If a session dies, the next one reads the manifest and resumes from the last incomplete clip.

**DO NOT stop for user approval on the manifest.** The moment table is an internal planning artifact. Proceed directly to building components.

### Step 2: Build Components (Parallel Builder Agents)

Spawn **@broll-builder** agents to generate component code in parallel.

**Split manifest into batches:**

Read `broll_manifest.md` and group clips into batches of **2-3** (smaller is better — gives each builder more context to think carefully about each clip's design and dwell timing). Use 3 as the default; drop to 2 only when clips are particularly complex.

- If total clips ≤ 3: Single batch (01)
- If total clips = 4-6: Two batches (01: 3, 02: remainder)
- If total clips = 7-9: Three batches (01: 3, 02: 3, 03: remainder)
- If total clips = 10-12: Four batches
- If total clips ≥ 13: Batches of 3, last batch gets remainder

Use **numeric batch identifiers** (01, 02, 03, ...) instead of letters for batches of 3.

**Spawn one @broll-builder agent per batch, in parallel:**

Each builder receives:
- Batch prefix (from manifest)
- Batch letter (A, B, C, ...)
- Manifest excerpt (the rows for that batch)
- Video resolution

The builder agents have the COMPLETE shared.tsx API contract embedded — all TypeScript interfaces, function signatures with exact arg counts, the OB1 palette, logo aliases, banned patterns, and a golden reference component. This eliminates API hallucination.

**Each builder produces:**
- `<PREFIX>_Clips<Letter>.tsx` in `$BROLL_HOME/remotion/src/broll/`
- Exports `<PREFIX>_CLIPS_<LETTER>` array of `{id, component}` objects

**Wait for all builders to complete** before proceeding.

**Update manifest:** Set each clip's status to `built` as builders finish.

### Step 3: Validate TypeScript

Before rendering ANY clips or taking QC screenshots, verify type correctness:

```bash
cd $BROLL_HOME/remotion
eval "$(/opt/homebrew/bin/brew shellenv)"
pnpm exec tsc --noEmit
```

**If errors occur:**

1. Read the error output carefully — TypeScript tells you the exact file, line, and problem.

2. **Common failures and fixes:**

   | Error | Cause | Fix |
   |-------|-------|-----|
   | `Expected 3 arguments, but got 2` | Wrong arg count to animation function | Check: `ease(frame, start, end)`, `bouncePop(frame, start, fps)` |
   | `Property 'DARK' does not exist on type...` | Misspelled OB1 color key | Use `OB1.BG_DARK` not `OB1.DARK` |
   | `Cannot find module 'lucide-react'` | Missing import | Add `import { IconName } from "lucide-react"` |
   | `Type '(f: number, zone: GfxZone) => ...' is not assignable` | Wrong render signature | Must be `(frame: number, fps: number, zone: GfxZone) => ReactNode` |
   | `Cannot find name 'staticFile'` | Missing import | Add `staticFile` to remotion import |

3. Fix the component, re-run tsc. Repeat until zero errors.

4. **DO NOT proceed to QC or rendering until tsc passes.** Type errors cause render crashes partway through a clip, wasting time.

### Step 4: Register Compositions

**Create batch aggregator file** `<PREFIX>Batch.tsx` in `src/broll/`:

```typescript
import { <PREFIX>_CLIPS_A } from "./<PREFIX>_ClipsA";
import { <PREFIX>_CLIPS_B } from "./<PREFIX>_ClipsB";
// ... import all batch exports

export const <PREFIX>_COMPS = [...<PREFIX>_CLIPS_A, ...<PREFIX>_CLIPS_B /* , ... */];
```

**Register in Root.tsx** — add import and spread into the BROLL_COMPS array:

```typescript
import { <PREFIX>_COMPS } from "./broll/<PREFIX>Batch";

// Add to BROLL_COMPS array:
...<PREFIX>_COMPS,
```

Each composition: match source video resolution, 30fps, 300 frames.

### Logo Pack (3,400+ brand SVGs)

The project includes a comprehensive logo library at `public/logos/`. The builder agents have the aliases embedded, but for reference:

**Location:** `$BROLL_HOME/remotion/public/logos/`
**Reusable copy:** `$BROLL_HOME/remotion/public/logos/`

**Three files for querying:**
- `catalog.json` — 3,400+ brands, each with `title` and `hex` (official brand color)
- `aliases.json` — friendly name → slug mapping (e.g., "VS Code" → "visualstudiocode", "ChatGPT" → "openai")
- `*.svg` — the actual SVG files, one per brand

**Common aliases:**
| Friendly Name | SVG File | Brand Color |
|--------------|----------|-------------|
| Claude | `claude.svg` | #D97757 |
| OpenAI / ChatGPT | `openai.svg` | #412991 |
| Copilot | `githubcopilot.svg` | — |
| Excel | `microsoftexcel.svg` | #217346 |
| Slack | `slack.svg` | #4A154B |
| VS Code | `visualstudiocode.svg` | #007ACC |
| GitHub | `github.svg` | #181717 |
| Cursor | `cursor.svg` | #000000 |
| Substack | `substack.svg` | #FF6719 |
| YouTube | `youtube.svg` | #FF0000 |

### Step 5: QC Screenshots

For EACH clip, take screenshots at frames 150 and 270 (the 9-second mark catches most failures):

```bash
cd $BROLL_HOME/remotion
eval "$(/opt/homebrew/bin/brew shellenv)"
pnpm exec remotion still src/index.ts CL-NNN-ShortName out/qc-cl-NNN-f150.png --frame=150
pnpm exec remotion still src/index.ts CL-NNN-ShortName out/qc-cl-NNN-f270.png --frame=270
```

**QC Checklist (every item must pass — any failure = fix before render):**

**Readability (blocking — failure = rebuild the clip, not just fix the screenshot):**

1. **40px text floor:** Every visible text string is at least 40px. NO exceptions. If a label looks tiny on screen, it almost certainly is — count pixels.
2. **Phone test:** Hold a phone at arm's length (or imagine you are). Can you read every word? If not, that text either gets enlarged or deleted.
3. **One-glance test:** Can a viewer grok the frame in 1 second? If you have to study the frame to understand it, the layout is too dense — split into time phases or remove elements.
4. **Element count ≤ 4:** Count distinct labeled elements. Max 1 dominant + 3 supporting. More than 4 = rebuild.
5. **Total visible text ≤ ~90 characters** in the GFX zone at any moment (bottomLabel doesn't count).
6. **No empty decorative containers:** No bracket frames, no empty squares "for visual rhythm," no faint background flourishes. Every element on screen carries meaning.
7. **Lines terminate at container edges:** Connecting lines must NOT pass through container borders. They stop at the edge.
8. **Radial layouts spread evenly:** Branches around a center are distributed across ≥270°, never bunched.

**Mechanical (existing):**

9. **No clipping:** At frame 270, verify NO text or icon is partially cut off at any edge of the GFX zone. If anything is clipped, the component is using hardcoded pixels instead of zone-relative sizing.
10. **All text readable:** Every text string is fully visible — no characters obscured by lines, shapes, icons, or zone boundaries.
11. **No overlapping elements:** Text is not covered by any visual element. Lines don't pass through text or icons.
12. **Content fits the GFX zone:** Nothing bleeds into the title zone area. The bottom label (pill) is cleanly separated from the graphics above.
13. **Real logos used:** Any real company/product (Claude, ChatGPT, Copilot, Excel, etc.) uses a brand logo from the logo pack, not a generic lucide icon.
14. **Not text-only:** Must have visual elements — icons, charts, diagrams, data visualizations.
15. **Brand colors correct:** Dark blue gradient background, OB1 palette colors, no stray defaults.

**Update manifest:** Set each clip's status to `qc'd` as it passes.

Fix any issues before proceeding to render.

### Step 6: Render Clips

**Sequential, one at a time:**

```bash
cd $BROLL_HOME/remotion
eval "$(/opt/homebrew/bin/brew shellenv)"
pnpm exec remotion render src/index.ts CL-NNN-ShortName \
  "<video_directory>/broll/CL-NNN-three word cue-SECONDS.MILLISECONDS.mp4" \
  --codec h264 --crf 23 --muted --scale 1
```

**Output goes to the video's `broll/` subdirectory** with the correct filename including the timecode.

**Update the manifest** — set each clip's status to `rendered` as it completes.

### Step 7: User Review (MANDATORY PAUSE)

**STOP here and wait for user approval before compositing.**

Present a summary:
- Total clips rendered
- List of all files in `broll/` with sizes
- Remind the user they can preview individual clips in the `broll/` folder
- Ask: "Ready to composite onto the video and apply chyrons? Or do you want changes first?"

**Do NOT proceed to compositing until the user explicitly approves.** They may want to:
- Remove specific clips
- Ask for revisions
- Adjust timing

### Step 8: Composite + Chyrons (Final Deliverables)

Run the compositing script:

```bash
python3 "$BROLL_HOME/scripts/multi_composite.py" \
  "<source_video>.mp4" \
  "<video_directory>/broll"
```

This single script:
1. Layers all b-roll clips onto the original video using `-itsoffset` (parses timecodes from filenames)
2. Splits into two streams
3. Applies YouTube Chyron → outputs `*_composite_YT.mp4`
4. Applies Substack Chyron → outputs `*_composite_SS.mp4`

**The original video is never modified.**

### Step 9: Verify Deliverables

Confirm these files exist:
- `<source>_composite_YT.mp4` — YouTube version with b-roll + chyron
- `<source>_composite_SS.mp4` — Substack version with b-roll + chyron
- `broll/` directory with all individual clips (properly named with timecodes)
- `broll_manifest.md` — manifest with all clips marked as `rendered`

Update manifest: set all clip statuses to `rendered`. Report file sizes and durations to the user.

## File Naming Reference

**Batch prefix:** Auto-derived from video title (first letter of each significant word, 2-3 chars). See Step 0.

**B-roll clips:** `<PREFIX>-NNN-three word cue-SECONDS.MILLISECONDS.mp4`
- `<PREFIX>` = batch prefix derived from video title (e.g., "CL" for Context Layer)
- `NNN` = sequential number (001, 002, ...)
- `three word cue` = EXACT verbatim 3 words from transcript (spaces OK in macOS filenames)
- `SECONDS.MILLISECONDS` = insertion timecode parsed by `multi_composite.py`

**Examples:**
- `CL-001-skills went from-63.360.mp4`
- `TA-005-hint is decomposition-516.280.mp4`

**Manifest:** `broll_manifest.md` — saved in the video directory, tracks all clips with status

**Composited outputs:**
- `VIDEO NAME_composite_YT.mp4`
- `VIDEO NAME_composite_SS.mp4`

## Key File Locations

| What | Where |
|------|-------|
| Remotion project | `$BROLL_HOME/remotion/` |
| B-roll components | `.../nate-jones/src/broll/` |
| Shared module (BRollTemplate) | `.../nate-jones/src/broll/shared.tsx` |
| Logo pack (3,400+ SVGs) | `.../nate-jones/public/logos/` |
| Logo catalog + aliases | `.../nate-jones/public/logos/catalog.json` + `aliases.json` |
| Composite script | `$BROLL_HOME/scripts/multi_composite.py` |
| YouTube Chyron | `$BROLL_HOME/assets/Youtube Chyron.mov` |
| Substack Chyron | `$BROLL_HOME/assets/Substack Chyron.mov` |
| Documentation | `$BROLL_HOME/docs/` |

## Common Failures to Avoid

| Failure | Cause | Fix |
|---------|-------|-----|
| Clips don't appear in composite | Filename missing timecode suffix | Use `CL-NNN-cue-SECONDS.MS.mp4` format |
| Text unreadable | Font sizes too small for video | 48px+ primary, 36px+ secondary at 1080p |
| Overlapping elements | No safe zone enforcement | Use BRollTemplate — it constrains content to title-safe |
| Text-only clips | Lazy generation | Every clip needs SVGs, icons, charts, diagrams |
| Lines covering text/icons | Wrong render order in JSX | Render SVG lines BEFORE solid elements; use zIndex: 0 for lines, zIndex: 1 for content |
| Generic icons for real products | No logo pack or not using it | Use `staticFile('logos/...')` for Claude, ChatGPT, Copilot, etc. |
| Clips overlap each other | Spacing violated | 15s minimum between start times |
| Viewer sees b-roll too early | No breathing room | First clip after 20 seconds |
| Render crashes | Parallel renders | Always sequential, one at a time |
| Missing chyrons | Pipeline stopped after render | Always run multi_composite.py as final step |
| Wrong Remotion project | Created throwaway project | Use `$BROLL_HOME/remotion/` |
| Lost progress between sessions | No manifest saved | Always save `broll_manifest.md` in video dir with status tracking |
| Wrong resolution | Assumed instead of checking | Run ffprobe on source video in Step 0, render at matching resolution |
| Composited without approval | Skipped review step | ALWAYS pause at Step 7 and wait for user to approve b-roll before compositing |
| Graphics clipped/cut off | Content exceeds GFX zone | Use `zone.width`/`zone.height` from render args — never hardcode pixel sizes |
| Text blocked by visual elements | Wrong z-ordering, elements overlap text | Text last in JSX + `zIndex: 10`; lines/shapes at `zIndex: 0`; verify at frames 50/150/250 |
| Lucide icons for real brands | Logo pack not used | Check `aliases.json`, use `staticFile("logos/SLUG.svg")` — lucide for real brands = QC failure |
