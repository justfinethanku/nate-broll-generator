# Troubleshooting

This repo is Codex-first. If an older doc mentions Claude Code or `/broll-pipeline`, use the Codex invocation instead:

```text
Use $broll-pipeline on video.mp4
```

## Render crashes

**Symptom:** Remotion render exits with a crash or segfault.

**Causes & fixes:**
- **Parallel renders:** Never run two renders at once. Chrome instances conflict. Always sequential.
- **h265 codec:** Apple Silicon crashes with h265. Always use `--codec h264`.
- **Memory:** Close other heavy apps. Each render uses ~2 GB.

## TypeScript errors

**Symptom:** `pnpm exec tsc --noEmit` shows errors.

**Fix:** Filter errors by the batch prefix you just built:
```bash
cd $BROLL_HOME/remotion
pnpm exec tsc --noEmit 2>&1 | grep "XX_Clips"
```

Common TS errors:
| Error | Fix |
|-------|-----|
| `Expected 3 arguments, but got 2` | Check animation function signatures: `ease(frame, start, end)`, `bouncePop(frame, start, fps)` |
| `Property 'DARK' does not exist` | Use `OB1.BG_DARK` not `OB1.DARK` |
| `Cannot find module 'lucide-react'` | Add missing import |

## Chyron not found

**Symptom:** `ERROR: Missing Chyrons!` when running composite.

**Fix:** Verify both files exist in `$BROLL_HOME/assets/`:
```bash
ls -la "$BROLL_HOME/assets/"
# Should show:
#   Youtube Chyron.mov  (~9.5 GB)
#   Substack Chyron.mov (~5.8 GB)
```

If missing, download from the shared link.

## AssemblyAI transcription fails

**Symptom:** Transcription API returns errors.

**Fix:** Check the API key:
```bash
grep ASSEMBLYAI ~/.codex/.env
```

If empty or wrong, update it:
```bash
# Edit ~/.codex/.env and set:
ASSEMBLYAI_API_KEY=your_actual_key_here
```

## Logo renders as white box

**Symptom:** A brand logo appears as an empty white rectangle.

**Fix:** The SVG slug may be wrong. Check aliases:
```bash
cat $BROLL_HOME/remotion/public/logos/aliases.json | python3 -m json.tool | grep -i "brand_name"
```

Or search the directory:
```bash
ls $BROLL_HOME/remotion/public/logos/ | grep -i "brand"
```

Known missing logos (render as white boxes): `nasdaq.svg`, `amazon.svg`.

## Clips don't appear in composite

**Symptom:** Composited video has no b-roll overlays.

**Fix:** The timecode is parsed from the filename. Verify filenames follow the pattern:
```
XX-NNN-three word cue-SECONDS.MILLISECONDS.mp4
```

Both compositors accept a final `-SECONDS.mp4` or `-SECONDS.MILLISECONDS.mp4`
suffix. They print `SKIP (invalid timecode)` for MP4 files with a missing or
malformed timecode. Non-MP4 files and directories are ignored.

Both scripts sort clips by insertion time, skip clips before 20 seconds, and
keep at least 15 seconds between accepted clip starts. Check the `SKIP` messages
for clips removed by these spacing rules. This is a gap between start times;
it does not trim long clips to prevent overlap.

## Scout manifest validation fails

Check a newly planned manifest before building clips:

```bash
python3 "$BROLL_HOME/scripts/eval_scout_manifest.py" \
  "$PWD/broll_manifest.md" "$PWD/chunked_transcript.json"
```

Use the actual chunked transcript filename. The cue must contain three exact
consecutive transcript words, preserving case and punctuation. Its timecode is
the first word's `start` in milliseconds divided by 1000, written with three
decimal places. The filename must repeat the same prefix, zero-padded clip
number, cue and timecode. A different filename time would move the clip in the
compositor even if the manifest's Timecode column were correct.

Run the provider-free regression checks from the repo root with
`python3 scripts/test_scout_manifest.py`. This validates the planned scout stage;
later `built`, `qc'd` and `rendered` statuses are not scout inputs.

## Pipeline stops / session crashes

**Symptom:** Codex session ends before the pipeline finishes.

**Fix:** Re-run `Use $broll-pipeline on video.mp4` in the same project folder. The pipeline reads `broll_manifest.md` and resumes from the last incomplete clip. You won't lose progress.

## Remotion Studio won't launch

**Symptom:** `pnpm studio` fails.

**Fix:**
```bash
cd $BROLL_HOME/remotion
pnpm install          # Re-install deps
pnpm studio           # Try again
```

If still failing, check Node version: `node --version` (need 20+).

## BROLL_HOME not set

**Symptom:** Codex can't find the Remotion project or scripts.

**Fix:** Re-run the install script:
```bash
cd /path/to/nate-broll-generator
./setup.sh codex
```

Or manually add to `~/.codex/.env`:
```
BROLL_HOME=/path/to/nate-broll-generator
```

## Codex skill not available

**Symptom:** Codex does not recognize `$broll-pipeline`.

**Fix:**

```bash
cd /path/to/nate-broll-generator
bash Codex/install.sh
```

Then restart Codex or open a fresh session.

## Package readiness check fails

**Symptom:** `./scripts/package_check.sh` reports missing files.

**Fix:** Follow the reported item. The most common failures are:

- missing `assets/Youtube Chyron.mov`
- missing `assets/Substack Chyron.mov`
- missing `ASSEMBLYAI_API_KEY` in `~/.codex/.env`
- Remotion dependencies not installed

Run:

```bash
./setup.sh codex
./scripts/package_check.sh
```
