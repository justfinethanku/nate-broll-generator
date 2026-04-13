# B-Roll Pipeline — Installation Guide

This guide walks you through setting up the automated b-roll pipeline on your Mac from scratch. By the end, you'll be able to drop a video file into a folder, run one command, and get back a fully composited video with animated motion graphics and platform chyrons.

**Time estimate:** 20-30 minutes (plus chyron download time).

---

## Before You Start

You need:
- A Mac with Apple Silicon (M1, M2, M3, or M4)
- macOS Sonoma or newer
- An internet connection
- Access to the GitHub repo (Jon will send you an invite)
- The chyron files (Jon will share a download link — ~15 GB total)
- The AssemblyAI API key (Jon will send this to you directly)

---

## Step 1: Install Xcode Command Line Tools

Open **Terminal** (search for it in Spotlight, or find it in Applications > Utilities).

Run:

```bash
xcode-select --install
```

A popup will appear asking to install. Click **Install** and wait for it to finish. If it says "already installed," you're good.

---

## Step 2: Install Homebrew

Homebrew is a package manager that installs developer tools. Run this in Terminal:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Follow the prompts. When it finishes, it will print instructions to add Homebrew to your PATH. **Run those commands** — they look something like:

```bash
echo >> ~/.zprofile
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

Verify it works:

```bash
brew --version
```

---

## Step 3: Install Required Tools

Run these one at a time in Terminal:

```bash
# Node.js (JavaScript runtime — powers Remotion)
brew install node

# pnpm (fast package manager)
npm install -g pnpm

# FFmpeg (video processing — handles compositing)
brew install ffmpeg

# Git (version control — may already be installed)
brew install git
```

Verify each one:

```bash
node --version      # Should show v20+ or v22+
pnpm --version      # Should show 9+ or 10+
ffmpeg -version     # Should print version info
git --version       # Should show 2.x
```

---

## Step 4: Install Claude Code

Claude Code is the AI tool that runs the pipeline. Install it:

```bash
npm install -g @anthropic-ai/claude-code
```

Then authenticate. Run:

```bash
claude
```

It will open a browser window to log in. Use the Anthropic account credentials that Jon provides. Once authenticated, you can close the Claude Code session for now (type `/exit` or press `Ctrl+C`).

---

## Step 5: Clone the Repository

Pick a location on your Mac for the project. We recommend your home directory:

```bash
cd ~
git clone https://github.com/justfinethanku/nate-broll-generator.git
cd nate-broll-generator
```

If git asks for GitHub credentials, you'll need to either:
- Use a GitHub Personal Access Token (Jon can help set this up)
- Or Jon can add your GitHub username as a collaborator and you'll accept the invite

---

## Step 6: Run the Setup Script

This is the main installation step. It installs all dependencies, configures Claude Code with the b-roll skill and agents, and sets up environment variables.

```bash
./setup.sh
```

**What it does:**
1. Checks that all prerequisite tools are installed
2. Installs the Remotion project's Node.js dependencies
3. Copies the b-roll pipeline skill and AI agents to `~/.claude/`
4. Sets the `BROLL_HOME` path so the pipeline knows where everything is
5. Asks for the AssemblyAI API key
6. Verifies TypeScript compiles without errors

**When it asks for the AssemblyAI API key**, paste the key that Jon sent you. This is used for video transcription. If you don't have it yet, press Enter to skip — you can add it later.

When the script finishes you should see:

```
╔══════════════════════════════════════════════╗
║   Setup Complete!                           ║
╚══════════════════════════════════════════════╝
```

---

## Step 7: Download the Chyron Files

The chyron overlays are the branded lower-third graphics that get applied to YouTube and Substack versions of each video. They're too large for GitHub (~15 GB combined), so Jon shares them separately.

Download these two files from the link Jon provides and move them into the `assets` folder inside the repo:

```
nate-broll-generator/
  assets/
    Youtube Chyron.mov     <- put it here (9.5 GB)
    Substack Chyron.mov    <- put it here (5.8 GB)
```

You can do this with Finder (drag and drop) or Terminal:

```bash
# Example if downloaded to ~/Downloads:
mv ~/Downloads/"Youtube Chyron.mov" ~/nate-broll-generator/assets/
mv ~/Downloads/"Substack Chyron.mov" ~/nate-broll-generator/assets/
```

These files are in `.gitignore` so they won't be uploaded to GitHub.

---

## Step 8: Verify Everything Works

### Test 1: Remotion Studio

```bash
cd ~/nate-broll-generator/remotion
pnpm studio
```

This should open your browser to Remotion Studio. You'll see a list of example compositions on the left (AG-001, AG-002, etc.). Click one to preview the animated graphic. If you see animated motion graphics rendering in the preview, Remotion is working.

Press `Ctrl+C` in Terminal to stop the studio.

### Test 2: Claude Code Recognizes the Skill

```bash
cd ~
claude
```

Once Claude Code starts, type:

```
/broll-pipeline
```

If the skill is installed correctly, Claude will load the b-roll pipeline instructions and ask for a video file. Since we're just testing, you can exit with `Ctrl+C` or `/exit`.

### Test 3: Chyrons are in place

```bash
ls -lh ~/nate-broll-generator/assets/
```

You should see both `.mov` files with their sizes (~9.5 GB and ~5.8 GB).

---

## Step 9: Add the API Key (if you skipped it earlier)

If you didn't enter the AssemblyAI key during setup, add it now:

Open the file `~/.claude/.env` in any text editor:

```bash
open -a TextEdit ~/.claude/.env
```

Add or update this line:

```
ASSEMBLYAI_API_KEY=paste_your_key_here
```

Save and close the file.

---

## You're Done!

The pipeline is ready. Here's how to use it day-to-day:

### Running the pipeline on a video

1. Create a folder for the video project:
   ```bash
   mkdir -p ~/Videos/broll-projects/MY-VIDEO-NAME
   ```

2. Copy or move the source `.mp4` into that folder.

3. Open Claude Code in that folder:
   ```bash
   cd ~/Videos/broll-projects/MY-VIDEO-NAME
   claude
   ```

4. Tell it to run the pipeline:
   ```
   /broll-pipeline MY-VIDEO-NAME.mp4
   ```

5. The pipeline handles everything automatically — transcription, moment selection, component generation, rendering, and compositing. It will pause before the final composite step to get your approval.

6. When it's done, you'll have:
   - `MY-VIDEO-NAME_composite_YT.mp4` — YouTube version
   - `MY-VIDEO-NAME_composite_SS.mp4` — Substack version

For more details on the daily workflow, see `docs/DAILY_WORKFLOW.md`.

---

## Getting Updates

When Jon pushes improvements to the pipeline (new rules, better agents, bug fixes):

```bash
cd ~/nate-broll-generator
git pull
./claude/install.sh
```

The first command downloads the latest code. The second command updates the Claude Code skill and agents on your machine.

---

## Quick Reference

| What | Where |
|------|-------|
| Repo | `~/nate-broll-generator/` |
| Remotion project | `~/nate-broll-generator/remotion/` |
| Chyron files | `~/nate-broll-generator/assets/` |
| Claude config | `~/.claude/` (skill + agents installed here) |
| API keys | `~/.claude/.env` |
| Video projects | Wherever you create them (e.g. `~/Videos/broll-projects/`) |

---

## Something Went Wrong?

See `docs/TROUBLESHOOTING.md` for solutions to common issues, or reach out to Jon.
