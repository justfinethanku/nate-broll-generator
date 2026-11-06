#!/usr/bin/env python3
"""Exercise environment serialization through both real installers in a temp home."""

import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest

REPO = Path(__file__).resolve().parents[1]


class InstallerSecurityTests(unittest.TestCase):
    def test_setup_preserves_a_synthetic_key_without_execution(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            repo = root / "repo"
            repo.mkdir()
            shutil.copy(REPO / "setup.sh", repo)
            shutil.copytree(REPO / "Codex", repo / "Codex")
            (repo / "scripts").mkdir()
            shutil.copy(REPO / "scripts/shell_env.sh", repo / "scripts")
            (repo / "remotion").mkdir()
            home = root / "home"
            home.mkdir()
            tools = root / "bin"
            tools.mkdir()
            # Exercise setup's real key prompt and installer while replacing
            # dependency installation/typechecking and media tools with stubs.
            for command in ("node", "pnpm", "ffmpeg", "codex"):
                stub = tools / command
                stub.write_text("#!/bin/sh\nexit 0\n")
                stub.chmod(0o755)
            marker = root / "executed"
            key = "synthetic'key;$(touch " + str(marker) + ")\\value"
            env = dict(os.environ, HOME=str(home), CODEX_HOME=str(home / ".codex"),
                       PATH=str(tools) + os.pathsep + os.environ["PATH"])
            installed = subprocess.run(["bash", str(repo / "setup.sh"), "codex"],
                                       input=key + "\n", env=env,
                                       capture_output=True, text=True)
            self.assertEqual(installed.returncode, 0, installed.stderr)
            sourced = subprocess.run(
                ["bash", "-c", '. "$1"; test "$ASSEMBLYAI_API_KEY" = "$2"',
                 "bash", str(home / ".codex/.env"), key], env=env,
                capture_output=True, text=True,
            )
            self.assertEqual(sourced.returncode, 0, sourced.stderr)
            self.assertFalse(marker.exists())

    def test_paths_remain_data_when_environment_is_sourced(self):
        for installer, config in (("Codex/install.sh", ".codex"),
                                  ("claude/install.sh", ".claude")):
            with self.subTest(installer=installer), tempfile.TemporaryDirectory() as tmp:
                home = Path(tmp) / "home"
                home.mkdir()
                marker = Path(tmp) / "executed"
                env = dict(os.environ, HOME=str(home), CODEX_HOME=str(home / ".codex"))
                env_file = home / config / ".env"
                env_file.parent.mkdir(parents=True)
                env_file.write_text("UNRELATED_KEY=synthetic_fixture\n")
                paths = [
                    "/tmp/Nate's Project;touch " + str(marker) + ";#",
                    "/tmp/Project;touch " + str(marker) + ";#",
                    "/tmp/$(touch " + str(marker) + ")",
                    "/tmp/Back\\slash's Project",
                    '/tmp/"double quotes" and spaces',
                    "/tmp/new\nline's Project",
                    "/tmp/ordinary-project",
                ]
                for value in paths:
                    with self.subTest(value=value):
                        installed = subprocess.run(
                            ["bash", str(REPO / installer), value], env=env,
                            capture_output=True, text=True,
                        )
                        self.assertEqual(installed.returncode, 0, installed.stderr)
                        sourced = subprocess.run(
                            ["bash", "-c",
                             '. "$1"; test "$BROLL_HOME" = "$2" && '
                             'test "$UNRELATED_KEY" = synthetic_fixture',
                             "bash", str(env_file), value], env=env,
                            capture_output=True, text=True,
                        )
                        self.assertEqual(sourced.returncode, 0, sourced.stderr)
                        self.assertFalse(marker.exists(), "path executed a shell command")
                        self.assertEqual(sum(line.startswith("BROLL_HOME=")
                                             for line in env_file.read_text().splitlines()), 1)


if __name__ == "__main__":
    unittest.main()
