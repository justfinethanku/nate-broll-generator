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
- CMP Supabase upload credentials from Jon, if this editor will upload finished packages
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
npm install -g pnpm@10.31.0
```

Verify:

```bash
node --version
pnpm --version
ffmpeg -version | head -1
ffprobe -version | head -1
git --version
python3 --version
```

Node should be v20 or newer. The pnpm version matches the `packageManager`
field in `remotion/package.json`; check that field when updating the toolchain.
See the [pnpm installation reference](https://pnpm.io/installation) for other
installation methods.

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
- installs the Codex production router into `~/.codex/skills/nate-broll-production/`
- installs the specialist b-roll and radio edit skills into `~/.codex/skills/`
- installs the plugin-style package into `~/.codex/plugins/nate-broll-production/`
- installs Codex agent prompt wrappers into `~/.codex/agents/`
- writes `BROLL_HOME` into `~/.codex/.env`
- asks for the AssemblyAI API key if missing
- runs a TypeScript check

If the script asks for the AssemblyAI API key, paste the key from Jon. You can
press Enter to skip it for the [local setup checks](LOCAL_CHECKS.md); transcription
still needs a key before processing real video.

Setup modifies your operator configuration: it writes `~/.codex/.env`, copies
repo-owned skills and prompts, replaces the repo plugin, and adds a marked hook
to `~/.zprofile` and `~/.zshrc`. Existing skill and agent files receive `.bak`
copies; this is not a full backup of your Codex configuration.

Load the generated environment into your current Bash or zsh session:

```bash
set -a
. "$HOME/.codex/.env"
set +a
printf '%s\n' "$BROLL_HOME"
```

The path should match your clone. The installer cannot export variables into
the shell that launched it. New zsh sessions load the hook automatically.

Run the [local setup checks](LOCAL_CHECKS.md) now. The setup script prints a
warning if TypeScript fails and can still print `Setup Complete!`; use the
explicit TypeScript command in those checks to verify compilation. These checks
can run before downloading chyrons or configuring delivery.

## 6. Add CMP Upload Credentials

This does not require the private Content Master Pro repo. The b-roll repo uploads finished packages directly to CMP's Supabase project.

Add these values to `~/.codex/.env`:

```bash
CMP_SUPABASE_URL="https://uaiiskuioqirpcaliljh.supabase.co"
CMP_SUPABASE_SERVICE_ROLE_KEY="<ask Jon>"
CMP_SYNC_USER_ID="<ask Jon if available>"
```

Then lock the file down:

```bash
chmod 600 ~/.codex/.env
```

Do not put these keys in this repo, and do not commit them.

## 7. Add Chyron Files

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

## 8. Run Package Check

From the repo root:

```bash
./scripts/package_check.sh
```

This is the full editor-package check: it expects the AssemblyAI configuration,
installed Codex files and both branded chyrons, and includes a CMP uploader smoke
test. It is not the key-free local check. Use the explicit TypeScript check in
[local setup checks](LOCAL_CHECKS.md) as well; a package-check summary alone is
not proof of a successful render or production delivery.

## 9. Render Template Previews

This is the simplest visual smoke test:

```bash
./scripts/render_template_previews.sh
```

This step launches the renderer, so run it after the local checks on the
editor workstation. It renders still previews for the approved template menu into:

```text
remotion/out/template-previews/
```

## 10. First Real Run

Create a project folder for a video:

```bash
mkdir -p ~/Videos/broll-projects/MY-VIDEO-NAME
```

Put the source `.mp4` in that folder.

Open Codex in that video folder and say:

```text
Use $nate-broll-production on MY-VIDEO-NAME.mp4
```

Codex should classify the folder first:

- raw recording -> `$radio-edit` package for the editor
- clean edit export -> `$broll-pipeline` b-roll run
- finished package -> delivery/CMP verification and direct CMP upload dry run

The direct `$broll-pipeline` command is still available when the clean edit is already ready and you want to skip the stage check.

For a finished package, the upload dry run is:

```bash
node "$BROLL_HOME/scripts/cmp_upload_delivery.mjs" \
  --deliverables-dir "$PWD/deliverables/upload" \
  --project-name "VIDEO TITLE HERE" \
  --publication-slug core_substack \
  --dry-run
```

Only replace `--dry-run` with `--yes` after Jon or the operator approves the parsed mapping.

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

- [EDITOR_ONBOARDING_CALL_GUIDE.md](EDITOR_ONBOARDING_CALL_GUIDE.md)
- [EDITOR_PACKAGE_README.md](EDITOR_PACKAGE_README.md)
- [EDITOR_TRAINING_GUIDE.md](EDITOR_TRAINING_GUIDE.md)
- [DAILY_WORKFLOW.md](DAILY_WORKFLOW.md)
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
