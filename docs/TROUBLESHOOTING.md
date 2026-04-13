# Troubleshooting

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
grep ASSEMBLYAI ~/.claude/.env
```

If empty or wrong, update it:
```bash
# Edit ~/.claude/.env and set:
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

The `multi_composite.py` script matches `-(\d+\.\d+)\.mp4$` — if the timecode is missing or malformed, the clip is silently skipped.

## Pipeline stops / session crashes

**Symptom:** Claude Code session ends before the pipeline finishes.

**Fix:** Re-run `/broll-pipeline` in the same project folder. The pipeline reads `broll_manifest.md` and resumes from the last incomplete clip. You won't lose progress.

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

**Symptom:** Claude Code can't find the Remotion project or scripts.

**Fix:** Re-run the install script:
```bash
cd /path/to/nate-broll-generator
./claude/install.sh
```

Or manually add to `~/.claude/.env`:
```
BROLL_HOME=/path/to/nate-broll-generator
```
