#!/usr/bin/env python3
"""Test readiness verdicts with a complete disposable package and stub tools.

No provider or CMP code runs: node and pnpm are fixture executables.
"""

import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest

REPO = Path(__file__).resolve().parents[1]


class PackageCheckTests(unittest.TestCase):
    def run_check(self, *, typecheck_exit=0, missing_key=False, missing_deps=False):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            repo, home, tools = root / "repo", root / "home", root / "bin"
            (repo / "scripts").mkdir(parents=True)
            home.mkdir()
            tools.mkdir()
            checker = repo / "scripts/package_check.sh"
            shutil.copyfile(REPO / "scripts/package_check.sh", checker)
            # Keep the package shape independent of the checker's path inventory.
            paths = [
                "Codex/install.sh", "Codex/skills/nate-broll-production/SKILL.md",
                "Codex/skills/broll-pipeline/SKILL.md", "Codex/skills/radio-edit/SKILL.md",
                "Codex/agents/broll-scout.md", "Codex/agents/broll-builder.md",
                "Codex/plugins/nate-broll-production/.codex-plugin/plugin.json",
                "Codex/plugins/nate-broll-production/skills/nate-broll-production/SKILL.md",
                "remotion/src/broll/templates/templateToolRegistry.tsx",
                "remotion/src/broll/templates/UtilityTemplates.tsx",
                "remotion/src/broll/TemplateDemos.tsx",
                "scripts/render_template_previews.sh", "scripts/prepare_cmp_delivery.py",
                "scripts/cmp_upload_delivery.mjs", "scripts/test_cmp_upload_delivery.mjs",
                "docs/EDITOR_PACKAGE_README.md", "docs/EDITOR_ONBOARDING_CALL_GUIDE.md",
                "docs/EDITOR_TRAINING_GUIDE.md", "assets/Youtube Chyron.mov",
                "assets/Substack Chyron.mov",
            ]
            for path in paths:
                dest = repo / path
                dest.parent.mkdir(parents=True, exist_ok=True)
                dest.touch()
            if not missing_deps:
                (repo / "remotion/node_modules").mkdir()
            config = home / ".codex"
            for path in paths:
                if path.startswith("Codex/") and path != "Codex/install.sh":
                    dest = config / Path(path).relative_to("Codex")
                    dest.parent.mkdir(parents=True, exist_ok=True)
                    dest.touch()
            (config / ".env").write_text("BROLL_HOME=/synthetic/repo\n" +
                ("" if missing_key else "ASSEMBLYAI_API_KEY=synthetic_fixture\n"))
            for name in ("node", "ffmpeg", "python3", "codex"):
                tool = tools / name
                tool.write_text("#!/bin/sh\nexit 0\n")
                tool.chmod(0o755)
            pnpm = tools / "pnpm"
            pnpm.write_text("#!/bin/sh\nif [ \"$1\" = exec ]; then\n"
                            "  echo synthetic-typecheck-diagnostic\n"
                            f"  exit {typecheck_exit}\nfi\nexit 0\n")
            pnpm.chmod(0o755)
            env = {**os.environ, "HOME": str(home), "PATH": str(tools) + os.pathsep + os.environ["PATH"]}
            return subprocess.run(["bash", str(checker)], env=env,
                                  capture_output=True, text=True, timeout=30)

    def test_complete_fixture_passes(self):
        result = self.run_check()
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("Package check passed", result.stdout)

    def test_failed_typecheck_fails_readiness(self):
        result = self.run_check(typecheck_exit=42)
        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("TypeScript compile failed", result.stdout)
        self.assertIn("Package check failed with 1 error(s)", result.stdout)
        self.assertNotIn("Package check passed", result.stdout)

    def test_missing_key_fails_readiness(self):
        result = self.run_check(missing_key=True)
        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("ASSEMBLYAI_API_KEY missing", result.stdout)

    def test_missing_dependencies_fail_readiness(self):
        result = self.run_check(missing_deps=True)
        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("remotion/node_modules missing", result.stdout)


if __name__ == "__main__":
    unittest.main()
