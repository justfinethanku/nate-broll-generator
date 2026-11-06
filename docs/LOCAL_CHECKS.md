# Verify a local setup

Use these checks after cloning or updating the repository to verify the local
Remotion project and media scripts before a production run. You need Node.js
20+, pnpm, Python 3, `ffmpeg` and `ffprobe` on `PATH`.

These checks need no API key, Codex login, installed agent files, branded
chyrons or source video. The first dependency install requires network access.
The compositor tests create small synthetic CPU fixtures in temporary folders;
they do not use GPU rendering or production media.

## Install the locked dependencies

From the repository root, install dependencies in `remotion/`:

```bash
cd remotion
pnpm install --frozen-lockfile --child-concurrency=2
```

A successful command exits zero and leaves `pnpm-lock.yaml` unchanged. The
`packageManager` field in `package.json` specifies pnpm 10.31.0. If the frozen
install fails because the manifest and lockfile disagree, inspect the checkout
and upstream changes before regenerating the lockfile.

## Check TypeScript and create a bundle

From `remotion/`, run:

```bash
pnpm exec tsc --noEmit
pnpm exec remotion bundle src/index.ts --out-dir=out/setup-smoke
```

Both commands must exit zero. The bundle appears at
`remotion/out/setup-smoke/index.html` relative to the repository root. Reserve
`out/setup-smoke` for this generated output: rerunning the bundle command
replaces an existing bundle there. See the
[Remotion bundle reference](https://www.remotion.dev/docs/cli/bundle).

Bundling compiles the project; it does not launch Chromium, render frames or
verify graphic appearance. Run the template previews on the editor workstation
as described in the [setup guide](SETUP_GUIDE.md).

## Run the local behavior checks

Return to the repository root and run each command in order:

```bash
cd ..
python3 scripts/test_scout_manifest.py
python3 scripts/test_radio_edit.py
python3 scripts/test_composite_timeline.py
python3 scripts/test_installer_security.py
python3 scripts/test_package_check.py
node --test --test-concurrency=2 scripts/test_layout_guards.mjs
```

Each command must exit zero. These suites cover scout cue/filename contracts,
radio-edit decisions, compositor timing and outputs, installer serialization,
readiness verdicts, and layout guards. The compositor suite uses `ffmpeg` and `ffprobe`; a skipped
render test means the media check did not run. Install both tools and rerun it.
The installer suite writes only to its disposable test homes. The readiness
suite uses stub tools and a disposable package; it does not run CMP code.

## Interpret the result

On November 6, 2026, these commands passed on Linux ARM64 with Node.js 22.22.2,
pnpm 10.31.0, Python 3.12.3 and FFmpeg/ffprobe 8.1: TypeScript, bundling and all
31 behavior tests passed without skipped tests. The README's `./setup.sh codex`
also passed with a disposable operator home, real dependencies and a skipped
AssemblyAI key prompt. All three skills, both prompts, the plugin and the shell
hooks were installed in that home.

This verifies local setup and synthetic behavior. The documented editor target
is an Apple Silicon Mac; this Linux check does not verify macOS installation,
zsh startup, Codex workflow execution, branded chyron compositing, transcription
or production delivery. Follow the [setup guide](SETUP_GUIDE.md) for editor
assets and configuration, and [troubleshooting](TROUBLESHOOTING.md) for failures.
