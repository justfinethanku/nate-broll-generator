# B-Roll Pipeline — Codex Bootstrap Prompt

Copy everything below the line and paste it into a fresh Codex session. Codex should handle the install from scratch.

---

I need you to install the Nate Jones Media b-roll pipeline on this computer for Codex. This is a one-time setup. Do everything below in order, checking each step as you go. Do not stop to ask me questions unless something fails.

## 1. Check and install prerequisites

Verify each tool below. Install anything missing:

- Xcode Command Line Tools
- Homebrew
- Node.js v20+
- pnpm
- FFmpeg
- Python 3
- Codex CLI (`codex`)

## 2. Clone or locate the repo

If `~/nate-broll-generator` does not exist yet:

```bash
cd ~
git clone https://github.com/justfinethanku/nate-broll-generator.git
cd ~/nate-broll-generator
```

If it already exists, use that copy.

## 3. Run the Codex setup

```bash
cd ~/nate-broll-generator
./setup.sh codex
```

If the script asks for an AssemblyAI key and one is already present in `~/.claude/.env`, copy it into `~/.codex/.env`. Otherwise ask me for the key and save it there.

## 4. Check for chyron files

Verify whether both files exist:

- `~/nate-broll-generator/assets/Youtube Chyron.mov`
- `~/nate-broll-generator/assets/Substack Chyron.mov`

If either is missing, tell me:

> "The chyron overlay files need to be downloaded separately. Ask Jon for the download link, then place `Youtube Chyron.mov` and `Substack Chyron.mov` in `~/nate-broll-generator/assets/`."

## 5. Final verification

Report:

1. `node --version`
2. `pnpm --version`
3. `ffmpeg -version | head -1`
4. `python3 --version`
5. `codex --version`
6. `grep '^BROLL_HOME=' ~/.codex/.env`
7. Whether `ASSEMBLYAI_API_KEY` is present in `~/.codex/.env` without printing the key
8. Whether these files exist:
   - `~/.codex/skills/broll-pipeline/SKILL.md`
   - `~/.codex/agents/broll-scout.md`
   - `~/.codex/agents/broll-builder.md`
9. `cd ~/nate-broll-generator/remotion && pnpm exec tsc --noEmit`

Then print a concise setup summary and tell me the Codex invocation to use from a video folder:

```text
Use $broll-pipeline on video.mp4
```
