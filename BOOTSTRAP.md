# B-Roll Pipeline — Bootstrap Prompt

Copy everything below the line and paste it into a fresh Claude Code session. Claude will handle the entire installation.

---

I need you to install the Nate Jones Media b-roll pipeline on this computer from scratch. This is a one-time setup. Do everything below in order, checking each step as you go. Do not ask me questions unless something fails — just execute.

## 1. Check and install prerequisites

Check if each of these tools is installed. For any that are missing, install them:

- **Xcode Command Line Tools**: run `xcode-select -p` — if it errors, run `xcode-select --install` and wait for it to finish
- **Homebrew**: run `brew --version` — if not found, install it with `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"` then run the PATH setup commands it prints (the `eval "$(/opt/homebrew/bin/brew shellenv)"` line)
- **Node.js**: run `node --version` — needs v20+. If missing or too old: `brew install node`
- **pnpm**: run `pnpm --version` — if missing: `npm install -g pnpm`
- **FFmpeg**: run `ffmpeg -version` — if missing: `brew install ffmpeg`
- **git**: run `git --version` — if missing: `brew install git`
- **Python 3**: run `python3 --version` — should already exist on macOS

After checking/installing everything, print a summary of what was already installed vs what you had to install.

## 2. Clone the repository

```bash
cd ~
git clone https://github.com/justfinethanku/nate-broll-generator.git
cd ~/nate-broll-generator
```

If this fails because the directory already exists, just `cd ~/nate-broll-generator && git pull` instead.

## 3. Install Remotion dependencies

```bash
cd ~/nate-broll-generator/remotion
pnpm install
```

## 4. Verify TypeScript compiles

```bash
cd ~/nate-broll-generator/remotion
pnpm exec tsc --noEmit
```

If there are errors, tell me what they are. If it's clean, move on.

## 5. Install the Claude Code skill and agents

Run the install script. This copies the b-roll pipeline skill and the two AI agents (broll-scout and broll-builder) into `~/.claude/` so they're available in all future Claude Code sessions. It also sets the `BROLL_HOME` environment variable.

```bash
bash ~/nate-broll-generator/claude/install.sh
```

Verify all three files were installed:
```bash
ls -la ~/.claude/skills/broll-pipeline/SKILL.md
ls -la ~/.claude/agents/broll-scout.md
ls -la ~/.claude/agents/broll-builder.md
```

Verify BROLL_HOME is set:
```bash
grep BROLL_HOME ~/.claude/.env
```

## 6. Set up the AssemblyAI API key

Add this key to `~/.claude/.env` (create the file if it doesn't exist). The key is:

```
ASSEMBLYAI_API_KEY=PASTE_KEY_HERE
```

(The user will replace PASTE_KEY_HERE with the actual key Jon provides.)

Check if ASSEMBLYAI_API_KEY already exists in `~/.claude/.env` first. If it does, leave it alone. If not, ask me for the key and add it.

## 7. Create the assets directory and check for chyrons

```bash
mkdir -p ~/nate-broll-generator/assets
```

Check if the chyron files exist:
```bash
ls -lh ~/nate-broll-generator/assets/*.mov 2>/dev/null
```

If they don't exist, tell me:
> "The chyron overlay files need to be downloaded separately (they're ~15 GB total). Ask Jon for the download link, then move them to `~/nate-broll-generator/assets/`. The files are called `Youtube Chyron.mov` and `Substack Chyron.mov`. The pipeline will still work for generating and rendering b-roll clips without them — they're only needed for the final compositing step."

## 8. Final verification

Run these checks and report the results:

1. `node --version` (need v20+)
2. `pnpm --version`
3. `ffmpeg -version | head -1`
4. `python3 --version`
5. `cat ~/.claude/.env` (confirm BROLL_HOME and ASSEMBLYAI_API_KEY are present — mask the actual key value in your output)
6. `ls ~/.claude/skills/broll-pipeline/SKILL.md && echo "Skill: OK"`
7. `ls ~/.claude/agents/broll-scout.md && echo "Scout agent: OK"`
8. `ls ~/.claude/agents/broll-builder.md && echo "Builder agent: OK"`
9. `ls ~/nate-broll-generator/remotion/node_modules/.package-lock.json && echo "Remotion deps: OK"`
10. `ls ~/nate-broll-generator/assets/*.mov 2>/dev/null && echo "Chyrons: OK" || echo "Chyrons: MISSING (download from Jon)"`

Print a clean summary like:

```
Setup Complete!

  Node.js:        v22.x.x
  pnpm:           10.x.x
  FFmpeg:         installed
  Python:         3.x.x
  BROLL_HOME:     /Users/username/nate-broll-generator
  API Key:        configured
  Skill:          installed
  Scout Agent:    installed
  Builder Agent:  installed
  Remotion Deps:  installed
  Chyrons:        OK / MISSING

Next steps:
  1. [If chyrons missing] Download chyrons from Jon and put them in ~/nate-broll-generator/assets/
  2. To process a video, cd to its directory and run: /broll-pipeline video.mp4
```

That's it. Do all of this now.
