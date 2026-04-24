# B-Roll Pipeline Setup Guide

This is the Codex-first setup path for the Nate Jones Media b-roll pipeline.

The editor does not design graphics. Codex runs the automation, Remotion renders the clips, and the editor validates the output before final compositing.

Time estimate:

- 20-30 minutes for tools and repo setup
- extra time for the two chyron downloads, about 15 GB total

## What The Editor Needs

- Apple Silicon Mac
- Codex app or Codex CLI access
- GitHub access to this repo
- AssemblyAI API key from Jon
- Chyron files from Jon
- Terminal comfort enough to copy/paste commands

## 1. Install Apple Command Line Tools

```bash
xcode-select --install
```

If macOS says they are already installed, continue.

## 2. Install Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

After install, run the shell setup commands Homebrew prints. Then verify:

```bash
brew --version
```

## 3. Install Required Tools

```bash
brew install node ffmpeg git
npm install -g pnpm
```

Verify:

```bash
node --version
pnpm --version
ffmpeg -version | head -1
git --version
python3 --version
```

Node should be v20 or newer.

## 4. Clone The Repo

```bash
cd ~
git clone https://github.com/justfinethanku/nate-broll-generator.git
cd nate-broll-generator
```

If the repo already exists:

```bash
cd ~/nate-broll-generator
git pull
```

## 5. Run Codex Setup

```bash
./setup.sh codex
```

What this does:

- installs Remotion dependencies
- installs the Codex b-roll skill into `~/.codex/skills/broll-pipeline/`
- installs Codex agent prompt wrappers into `~/.codex/agents/`
- writes `BROLL_HOME` into `~/.codex/.env`
- asks for the AssemblyAI API key if missing
- runs a TypeScript check

If the script asks for the AssemblyAI API key, paste the key from Jon.

## 6. Add Chyron Files

Download these files from Jon and place them in `assets/`:

```text
assets/Youtube Chyron.mov
assets/Substack Chyron.mov
```

They are intentionally not in git.

Verify:

```bash
ls -lh assets/
```

You should see both `.mov` files.

## 7. Run Package Check

From the repo root:

```bash
./scripts/package_check.sh
```

This verifies the local install, required files, Codex skill files, chyrons, and TypeScript.

## 8. Render Template Previews

This is the simplest visual smoke test:

```bash
./scripts/render_template_previews.sh
```

It renders still previews for the approved template menu into:

```text
remotion/out/template-previews/
```

## 9. First Real Run

Create a project folder for a video:

```bash
mkdir -p ~/Videos/broll-projects/MY-VIDEO-NAME
```

Put the source `.mp4` in that folder.

Open Codex in that video folder and say:

```text
Use $broll-pipeline on MY-VIDEO-NAME.mp4
```

Codex should run the pipeline automatically and pause before final compositing.

## Editor Approval Role

At the approval pause, the editor reviews rendered b-roll clips and QC stills.

Approve only if:

- the graphic explains the spoken idea
- text is readable quickly
- the selected template makes sense
- it is not decorative filler

Reject with specific feedback, for example:

```text
Reject this clip. It should be comparison, not stack. The spoken idea is rented reach versus owned audience.
```

## Getting Updates

```bash
cd ~/nate-broll-generator
git pull
./setup.sh codex
./scripts/package_check.sh
```

## Important Files

- [EDITOR_PACKAGE_README.md](EDITOR_PACKAGE_README.md)
- [EDITOR_TRAINING_GUIDE.md](EDITOR_TRAINING_GUIDE.md)
- [DAILY_WORKFLOW.md](DAILY_WORKFLOW.md)
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
