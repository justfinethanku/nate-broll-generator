# Editor Onboarding Call Guide

Use this for a first call with a new editor. The goal is to get them from zero to a verified local setup, then teach the review role clearly enough that their first real run has a narrow approval loop instead of a vague "make it better" loop.

## What Jon Should Send Before The Call

- GitHub repo access for `justfinethanku/nate-broll-generator`
- Codex app access or a working Codex CLI login
- AssemblyAI API key
- Chyron download link for:
  - `Youtube Chyron.mov`
  - `Substack Chyron.mov`
- One short test `.mp4` for a supervised first run
- These docs:
  - `docs/SETUP_GUIDE.md`
  - `docs/DAILY_WORKFLOW.md`
  - `docs/EDITOR_TRAINING_GUIDE.md`

Do not send API keys in Slack or email if there is a safer shared secret path available.

## Call Agenda

### 0-10 Minutes: Explain The System

Use this framing:

```text
This pipeline turns a finished talking-head video into platform-ready deliverables. Codex transcribes the video, identifies moments that need visual support, creates approved Remotion b-roll graphics, validates them, renders them, then pauses for editor approval before final compositing.
```

The editor's role is not to design graphics from scratch. Their role is to review the AI's choices:

- Is the selected moment worth visualizing?
- Does the template match the idea?
- Is the text readable at video speed?
- Is anything clipped, cramped, or decorative filler?

### 10-35 Minutes: Machine Setup

Follow `docs/SETUP_GUIDE.md` in order.

Required tools:

```bash
xcode-select --install

/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

brew install node ffmpeg git
npm install -g pnpm
```

Clone or update the repo:

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

Run setup:

```bash
./setup.sh codex
```

Add the two chyron files into:

```text
assets/
```

Then verify:

```bash
./scripts/package_check.sh
```

The package check should pass before doing any real production work.

### 35-50 Minutes: Visual Smoke Test

Render the approved template previews:

```bash
./scripts/render_template_previews.sh
```

Open:

```text
remotion/out/template-previews/
```

Walk through the template menu:

- `stack`: layered systems and dependencies
- `comparison`: this-versus-that contrasts
- `sequence`: ordered steps
- `gate`: routing, access, approvals
- `surface`: visible work surface supported by hidden pieces
- `loop`: reinforcing cycles
- `progression`: maturity or level changes
- `formula`: inputs combining into an outcome
- `allocation`: weighted tradeoffs

The editor does not need to memorize every option on day one. They only need to know that weak template selection is a reason to reject a clip.

### 50-75 Minutes: First Supervised Run

Create a project folder outside the repo:

```bash
mkdir -p ~/Videos/broll-projects/MY-VIDEO-NAME
```

Place the source `.mp4` in that folder.

Open Codex in the video folder, not the repo folder:

```bash
cd ~/Videos/broll-projects/MY-VIDEO-NAME
```

Ask Codex:

```text
Use $broll-pipeline on MY-VIDEO-NAME.mp4
```

Let Codex run through transcript, scout, build, validation, and render prep. The important teaching moment is the approval pause before final compositing.

### 75-90 Minutes: Approval Practice

Have the editor review the generated QC stills and b-roll clips.

Approve only when:

- the graphic explains the spoken point
- the template matches the idea
- text is readable in under two seconds
- nothing is clipped or cramped
- it feels useful, not decorative

Reject with precise feedback:

```text
Reject this clip. The idea is comparison, not stack: rented reach versus owned audience. Revise with shorter labels and use comparison.
```

Avoid vague feedback:

```text
Make it cooler.
```

## Operating Rules To Reinforce

- Run the pipeline from the source video folder, not from the repo.
- Do not run two Remotion renders or two full pipeline jobs at the same time.
- Do not edit `shared.tsx`.
- Do not edit `.env` files into git.
- Do not commit or move the chyron `.mov` files into git.
- If a run crashes, rerun the same `$broll-pipeline` command and let it resume.
- The source video should remain untouched.

## First Week Success Criteria

By the end of the first week, the editor should be able to:

- install or update the repo with `git pull` and `./setup.sh codex`
- run `./scripts/package_check.sh`
- start a video project folder
- invoke `$broll-pipeline` from Codex
- review QC stills and rendered b-roll clips
- give specific approve/reject/revise feedback
- identify when to hand the run back to Jon or a technical operator

## Escalate To Jon When

- `package_check.sh` fails after setup
- the AssemblyAI key is missing or rejected
- either chyron file is missing
- Codex cannot find `$broll-pipeline`
- TypeScript fails
- Remotion rendering crashes repeatedly
- the source video has unusual formatting, multiple camera files, or missing audio
- the editor thinks a new template type is needed
