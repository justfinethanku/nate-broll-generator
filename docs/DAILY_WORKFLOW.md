# Daily Workflow

## Starting a New Video

1. **Create a project folder** for the video:
   ```bash
   mkdir -p ~/Videos/broll-projects/MY-VIDEO-NAME
   ```

2. **Place the source video** (`.mp4`) in that folder.

3. **Open Codex** in the project folder:
   ```bash
   cd ~/Videos/broll-projects/MY-VIDEO-NAME
   ```

4. **Run the pipeline:**
   ```
   Use $broll-pipeline on MY-VIDEO-NAME.mp4
   ```

## What Happens

The pipeline runs through these stages automatically:

1. **Transcription** (if no transcript exists) — extracts audio, sends to AssemblyAI, saves JSON
2. **Scout** — analyzes transcript, selects b-roll moments, writes `broll_manifest.md`
3. **Build** — creates approved template calls and renders deterministic Remotion graphics
4. **Validate** — runs TypeScript compiler, checks for errors
5. **Register** — creates batch aggregator file, updates Root.tsx
6. **QC** — takes screenshots at key frames and checks editorial strength
7. **Render** — renders each clip sequentially (~10s per clip)
8. **PAUSE** — asks for your approval before compositing
9. **Composite** — layers clips onto video, applies YouTube/Substack chyrons

## After the Pipeline

You'll have these files in your project folder:

```
MY-VIDEO-NAME/
  MY-VIDEO-NAME.mp4              # Original (untouched)
  MY-VIDEO-NAME_audio.wav        # Extracted audio
  MY-VIDEO-NAME_transcript.json  # Full transcript
  broll_manifest.md              # Clip plan with statuses
  broll/                         # Individual rendered clips
    XX-001-three word cue-42.350.mp4
    XX-002-another three words-78.120.mp4
    ...
  MY-VIDEO-NAME_composite_YT.mp4  # YouTube deliverable
  MY-VIDEO-NAME_composite_SS.mp4  # Substack deliverable
```

## Composition Registration

The pipeline should register generated clips automatically. The editor should not edit `Root.tsx` during normal operation.

If Codex explicitly reports that registration failed, Jon or a technical operator can verify:

1. Open `$BROLL_HOME/remotion/src/Root.tsx`
2. Add the import: `import { XX_COMPS } from "./broll/XXBatch";`
3. Add to the BROLL_COMPS array: `...XX_COMPS,`

## Reviewing QC Screenshots

The pipeline takes screenshots before rendering. They're saved to the project `qc/` folder or `$BROLL_HOME/remotion/out/`, depending on the stage. Check that:

- The chosen template matches the spoken idea
- The graphic communicates a real point, not just decoration
- Text is readable in under two seconds
- No text is clipped, cramped, or touching borders
- `stack` and `comparison` do not use arrows

If anything looks wrong, tell Codex what to fix before approving the render.

Approved template guidance lives in [EDITOR_TRAINING_GUIDE.md](EDITOR_TRAINING_GUIDE.md).

## Tips

- The pipeline takes 10-30 minutes depending on video length
- Don't run two pipelines at the same time (Remotion renders conflict)
- If a session crashes, re-run `Use $broll-pipeline on MY-VIDEO-NAME.mp4` — it reads the manifest and resumes from where it stopped
- You can preview individual clips in `broll/` before compositing
