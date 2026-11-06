"""Exercise the scout's editor-facing manifest contract without provider calls.

Run: python3 scripts/test_scout_manifest.py
"""

import contextlib
import copy
import io
import json
import math
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

from broll_timeline import parse_clips
from eval_scout_manifest import validate


class ScoutManifestTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.manifest = self.root / "manifest.md"
        self.transcript = self.root / "transcript.json"
        self.rows = []
        self.words = []
        for index, start in enumerate((30125, 100250, 170375, 240500,
                                       315625, 390750, 465875, 540000), 1):
            cue = f"Topic{index} grows, quickly."
            timecode = f"{start / 1000:.3f}"
            self.rows.append([str(index), "planned", timecode, f'"{cue}"',
                              f"Topic{index} growth diagram",
                              f"AB-{index:03d}-{cue}-{timecode}.mp4"])
            for offset, word in enumerate(cue.split()):
                self.words.append({"text": word, "start": start + offset * 200,
                                   "end": start + offset * 200 + 150})

    def write_inputs(self, rows=None, words=None, duration=600):
        rows = self.rows if rows is None else rows
        self.manifest.write_text(
            "# B-Roll Manifest\n\n**Source:** source.mp4\n"
            "**Resolution:** 1920x1080\n**Duration:** 600s\n"
            "**Batch Prefix:** AB\n**Generated:** 2026-11-06\n\n"
            "| # | Status | Timecode | 3-Word Cue | Concept | Filename |\n"
            "|---|--------|----------|------------|---------|----------|\n"
            + "\n".join("| " + " | ".join(row) + " |" for row in rows)
            + "\n", encoding="utf-8")
        self.transcript.write_text(json.dumps({
            "duration": duration, "words": self.words if words is None else words,
        }), encoding="utf-8")

    def evaluate(self, **kwargs):
        self.write_inputs(**kwargs)
        output = io.StringIO()
        with contextlib.redirect_stdout(output):
            result = validate(self.manifest, self.transcript)
        return result, output.getvalue()

    def assert_rejected(self, **kwargs):
        result, output = self.evaluate(**kwargs)
        self.assertFalse(result, output)
        self.assertIn("FAIL", output)

    def test_valid_manifest_preserves_verbatim_case_and_punctuation(self):
        result, output = self.evaluate()
        self.assertTrue(result, output)
        self.assertIn("VERDICT: PASS", output)

    def test_valid_filenames_produce_the_manifest_insertion_times(self):
        result, output = self.evaluate()
        self.assertTrue(result, output)
        clips_dir = self.root / "broll"
        clips_dir.mkdir()
        for row in self.rows:
            (clips_dir / row[5]).touch()
        self.assertEqual([float(row[2]) for row in self.rows],
                         [clip["start"] for clip in parse_clips(clips_dir)])

    def test_cue_must_start_at_selected_time_not_merely_exist_elsewhere(self):
        self.rows[0][2] = "40.125"
        self.rows[0][5] = self.rows[0][5].replace("30.125", "40.125")
        self.assert_rejected()

    def test_repeated_cue_uses_occurrence_at_selected_time(self):
        earlier = copy.deepcopy(self.words[:3])
        for word in earlier:
            word["start"] -= 25000
            word["end"] -= 25000
        result, output = self.evaluate(words=earlier + self.words)
        self.assertTrue(result, output)

    def test_cue_must_keep_case_and_punctuation(self):
        for cue in ('"topic1 grows, quickly."', '"Topic1 grows quickly"'):
            with self.subTest(cue=cue):
                rows = copy.deepcopy(self.rows)
                rows[0][3] = cue
                cue_text = cue.strip('"')
                rows[0][5] = f'AB-001-{cue_text}-30.125.mp4'
                self.assert_rejected(rows=rows)

    def test_filename_must_identify_the_same_clip_cue_and_time(self):
        for filename in (
            "AB-1-Topic1 grows, quickly.-30.125.mp4",
            "AB-002-Topic1 grows, quickly.-30.125.mp4",
            "AB-001-other words here-30.125.mp4",
            "AB-001-Topic1 grows, quickly.-99.000.mp4",
            "AB-001-Topic1 grows, quickly..mp4",
            "AB-001-Topic1 grows, quickly.-30.125.mp4.extra.mp4",
            "../AB-001-Topic1 grows, quickly.-30.125.mp4",
        ):
            with self.subTest(filename=filename):
                rows = copy.deepcopy(self.rows)
                rows[0][5] = filename
                self.assert_rejected(rows=rows)

    def test_clip_numbers_must_be_unique_positive_integers(self):
        for number in ("0", "one", "2"):
            with self.subTest(number=number):
                rows = copy.deepcopy(self.rows)
                rows[0][0] = number
                rows[0][5] = f'AB-{number.zfill(3)}-Topic1 grows, quickly.-30.125.mp4'
                self.assert_rejected(rows=rows)

    def test_nonfinite_and_malformed_timecodes_fail_without_traceback(self):
        for timecode in ("nan", "inf", "-inf", "-1.000", "30.12", "30.1250",
                         "30..125", "999999999.000"):
            with self.subTest(timecode=timecode):
                rows = copy.deepcopy(self.rows)
                rows[0][2] = timecode
                rows[0][5] = f'AB-001-Topic1 grows, quickly.-{timecode}.mp4'
                words = copy.deepcopy(self.words)
                try:
                    start = float(timecode) * 1000
                except ValueError:
                    start = math.nan
                if math.isfinite(start) and start >= 0:
                    words[0]['start'] = start
                self.assert_rejected(rows=rows, words=words)

    def test_every_clip_obeys_timing_limits_and_spacing(self):
        for index, timecode in ((0, "19.999"), (1, "40.000"), (7, "585.000")):
            with self.subTest(index=index, timecode=timecode):
                rows = copy.deepcopy(self.rows)
                rows[index][2] = timecode
                rows[index][5] = rows[index][5].replace(self.rows[index][2], timecode)
                words = copy.deepcopy(self.words)
                for offset in range(3):
                    words[index * 3 + offset]['start'] = float(timecode) * 1000 + offset * 200
                self.assert_rejected(rows=rows, words=words)

    def test_uneven_distribution_is_a_warning_not_a_failure(self):
        result, output = self.evaluate(rows=self.rows[:6])
        self.assertTrue(result, output)
        self.assertIn('WARN: Distribution', output)

    def test_aligned_markdown_table_is_accepted(self):
        self.write_inputs()
        self.manifest.write_text(self.manifest.read_text().replace(
            '|---|--------|----------|------------|---------|----------|',
            '| :--- | :------: | -------: | :---------- | ------- | -------- |'))
        with contextlib.redirect_stdout(io.StringIO()):
            self.assertTrue(validate(self.manifest, self.transcript))

    def test_planned_status_and_density_remain_required(self):
        self.rows[0][1] = "built"
        self.assert_rejected()
        self.assert_rejected(rows=self.rows[:1])

    def test_malformed_table_row_cannot_be_silently_dropped(self):
        rows = copy.deepcopy(self.rows)
        rows[0].pop()  # Seven other valid rows are still within target density.
        self.assert_rejected(rows=rows)

    def test_invalid_transcript_is_an_actionable_failure(self):
        for duration in (0, -1, float("nan"), "600"):
            with self.subTest(duration=duration):
                self.assert_rejected(duration=duration)
        words = copy.deepcopy(self.words)
        words[0].pop("start")
        self.assert_rejected(words=words)

    def test_cli_exit_status_matches_verdict(self):
        self.write_inputs()
        script = Path(__file__).with_name("eval_scout_manifest.py")
        args = [sys.executable, str(script), str(self.manifest), str(self.transcript)]
        valid = subprocess.run(args, capture_output=True, text=True)
        self.assertEqual(valid.returncode, 0, valid.stdout + valid.stderr)
        self.rows[0][5] = self.rows[0][5].replace("30.125", "99.000")
        self.write_inputs()
        invalid = subprocess.run(args, capture_output=True, text=True)
        self.assertEqual(invalid.returncode, 1, invalid.stdout + invalid.stderr)
        self.assertIn("VERDICT: FAIL", invalid.stdout)
        self.assertNotIn("Traceback", invalid.stderr)


if __name__ == "__main__":
    unittest.main()
