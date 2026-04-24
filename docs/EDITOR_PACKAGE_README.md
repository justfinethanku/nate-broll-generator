# Editor Package README

This package lets Codex generate b-roll clips from a source video and pause for editor approval before final compositing.

## The Editor's Job

The editor validates the AI's work. The editor does not design graphics manually.

Approve clips that:

- explain the spoken idea clearly
- use the right template
- are readable at video speed
- feel useful, not decorative

Reject clips with specific feedback:

```text
Reject this clip. It should be comparison, not stack. The spoken idea is rented reach versus owned audience.
```

## One-Time Setup

From the repo root:

```bash
./setup.sh codex
```

Then add the two chyron files from Jon:

```text
assets/Youtube Chyron.mov
assets/Substack Chyron.mov
```

Then verify:

```bash
./scripts/package_check.sh
```

## Visual Smoke Test

Render all template preview stills:

```bash
./scripts/render_template_previews.sh
```

Preview stills land in:

```text
remotion/out/template-previews/
```

## Running A Video

Create a project folder:

```bash
mkdir -p ~/Videos/broll-projects/MY-VIDEO-NAME
```

Put the source `.mp4` in that folder.

Open Codex in that folder and say:

```text
Use $broll-pipeline on MY-VIDEO-NAME.mp4
```

Codex should:

1. transcribe the video
2. choose b-roll moments
3. create template calls
4. render QC stills
5. render b-roll clips
6. pause for approval
7. composite YouTube and Substack versions after approval

## Current Template Menu

- `stack`
- `comparison`
- `sequence`
- `gate`
- `surface`
- `loop`
- `progression`
- `formula`
- `allocation`

## Do Not

- run two renders at the same time
- edit `shared.tsx`
- commit API keys
- commit chyron `.mov` files
- accept a graphic just because it moved

## If Something Breaks

Run:

```bash
./scripts/package_check.sh
```

Then check:

- [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- [SETUP_GUIDE.md](SETUP_GUIDE.md)
- [DAILY_WORKFLOW.md](DAILY_WORKFLOW.md)
