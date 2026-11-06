#!/usr/bin/env python3
"""Run with python3 scripts/test_composite_timeline.py (FFmpeg on PATH)."""

import contextlib
import io
import json
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import broll_timeline as timeline
import composite_broll as single
import multi_composite as dual


class TimelineTests(unittest.TestCase):
    def test_discovery_sorts_integer_and_fractional_times_without_probing(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            for name in ("AA-003-later-35.mp4", "AA-002-first-20.125.mp4",
                         "AA-001-first-20.125.mp4", "notes.txt", "bad-40..000.mp4",
                         "no-timecode.mp4"):
                (root / name).touch()
            (root / "folder-50.000.mp4").mkdir()
            with patch.object(subprocess, "run", side_effect=AssertionError("probe")):
                clips = timeline.parse_clips(temp)
            self.assertEqual([c["name"] for c in clips], [
                "AA-001-first-20.125.mp4", "AA-002-first-20.125.mp4", "AA-003-later-35.mp4"])
            self.assertTrue(all(Path(c["file"]).is_file() for c in clips))

    def test_spacing_uses_last_accepted_start_in_chronological_order(self):
        starts = [50, 34.999, 5, 20, 35, 20, 49.999, 19.999]
        clips = [{"name": str(start), "start": start} for start in starts]
        self.assertEqual([c["start"] for c in timeline.apply_spacing_rules(clips)], [20, 35, 50])
        self.assertEqual([c["start"] for c in clips], starts)

    def test_both_compositors_select_the_same_inputs(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            broll = root / "broll"
            broll.mkdir()
            for start in (5, 20, 25, 35):
                (broll / f"AA-clip-{start}.mp4").touch()
            (broll / "AA-bad-40..000.mp4").touch()
            source = str(root / "source with spaces.mp4")
            with patch.object(subprocess, "run") as run, \
                    patch.object(single.os.path, "getsize", return_value=1), \
                    patch.object(dual.os.path, "exists", return_value=True):
                run.return_value.returncode = 0
                single.composite(source, str(broll), version=1)
                dual.composite_all(source, str(broll))
            commands = [call.args[0] for call in run.call_args_list]
            self.assertEqual(len(commands), 2)
            for cmd in commands:
                inputs = [cmd[i + 1] for i, arg in enumerate(cmd) if arg == "-i"]
                self.assertEqual(inputs[:3], [source, str(broll / "AA-clip-20.mp4"),
                                             str(broll / "AA-clip-35.mp4")])
                self.assertFalse(any("AA-clip-5.mp4" in arg or "AA-clip-25.mp4" in arg for arg in cmd))
            dual_filter = commands[1][commands[1].index("-filter_complex") + 1]
            self.assertIn("[comp1][3:v]", dual_filter)
            self.assertIn("[comp2][4:v]", dual_filter)

    def test_empty_timeline_preserves_each_entry_points_behavior(self):
        with tempfile.TemporaryDirectory() as temp, patch.object(subprocess, "run") as run, \
                patch.object(dual.os.path, "exists", return_value=True):
            run.return_value.returncode = 0
            self.assertIsNone(single.composite("source.mp4", temp))
            run.assert_not_called()
            dual.composite_all("source.mp4", temp)
            cmd = run.call_args.args[0]
            graph = cmd[cmd.index("-filter_complex") + 1]
            self.assertIn("[0:v]split=2", graph)
            self.assertIn("[comp1][1:v]", graph)
            self.assertIn("[comp2][2:v]", graph)


@unittest.skipUnless(shutil.which("ffmpeg") and shutil.which("ffprobe"), "FFmpeg required")
class RenderTests(unittest.TestCase):
    def test_real_single_and_dual_outputs_keep_source_and_insertion_timing(self):
        # Tiny CPU fixtures only. Limit decoder, filter and encoder workers.
        real_run = subprocess.run

        def bounded_run(cmd, **kwargs):
            if cmd[0] == "ffmpeg":
                bounded = ["ffmpeg", "-hide_banner", "-loglevel", "error",
                           "-filter_complex_threads", "2", "-filter_threads", "2"]
                for arg in cmd[1:]:
                    if arg == "-i":
                        bounded += ["-threads", "2"]
                    if str(arg).endswith((".mp4", ".mov")) and "-i" not in bounded[-1:]:
                        bounded += ["-threads", "2"]
                    bounded.append(arg)
                cmd = bounded
            kwargs.setdefault("timeout", 30)
            return real_run(cmd, **kwargs)

        with tempfile.TemporaryDirectory() as temp, patch.object(subprocess, "run", bounded_run):
            root = Path(temp)
            broll = root / "broll"
            broll.mkdir()
            source = root / "source.mp4"

            def media(path, color, duration, audio=False, alpha=False):
                cmd = ["ffmpeg", "-y", "-f", "lavfi", "-i",
                       f"color=c={color}:s=64x64:r=2:d={duration}" + (",format=argb" if alpha else "")]
                if audio:
                    cmd += ["-f", "lavfi", "-i", f"sine=frequency=440:duration={duration}"]
                cmd += ["-c:v", "qtrle" if alpha else "libx264"]
                if audio:
                    cmd += ["-c:a", "aac"]
                cmd.append(str(path))
                subprocess.run(cmd, check=True, capture_output=True)

            media(source, "black", 40, audio=True)
            original_bytes = source.read_bytes()
            for start, color in ((5, "blue"), (20, "red"), (25, "yellow"), (35, "lime")):
                media(broll / f"AA-clip-{start}.000.mp4", color, 2)
            (broll / "AA-malformed-40..000.mp4").touch()
            yt, ss = root / "yt.mov", root / "ss.mov"
            media(yt, "black@0.0", 40, alpha=True)
            media(ss, "black@0.0", 40, alpha=True)
            single_path = single.composite(str(source), str(broll), version=1)
            self.assertIsNotNone(single_path)
            with patch.object(dual, "YT_CHYRON", str(yt)), patch.object(dual, "SS_CHYRON", str(ss)):
                dual.composite_all(str(source), str(broll))
            self.assertEqual(source.read_bytes(), original_bytes)
            outputs = [Path(single_path), root / "source_composite_YT.mp4", root / "source_composite_SS.mp4"]
            for output in outputs:
                probe = subprocess.run(["ffprobe", "-v", "error", "-show_format", "-show_streams",
                                        "-of", "json", str(output)], check=True, capture_output=True, text=True)
                data = json.loads(probe.stdout)
                self.assertAlmostEqual(float(data["format"]["duration"]), 40, delta=0.6)
                self.assertTrue(any(stream["codec_type"] == "audio" for stream in data["streams"]))
                pixels = subprocess.run(["ffmpeg", "-i", str(output), "-vf", "scale=1:1",
                                         "-pix_fmt", "rgb24", "-f", "rawvideo", "-"],
                                        check=True, capture_output=True).stdout
                for second, expected in ((5, (0, 0, 0)), (19, (0, 0, 0)), (20.5, (255, 0, 0)),
                                         (23, (0, 0, 0)), (25, (0, 0, 0)), (35.5, (0, 255, 0)),
                                         (38, (0, 0, 0))):
                    index = int(second * 2) * 3
                    rgb = tuple(pixels[index:index + 3])
                    self.assertEqual(len(rgb), 3)
                    self.assertTrue(all(abs(a - b) < 12 for a, b in zip(rgb, expected)),
                                    f"{output.name} at {second}s: {rgb} != {expected}")


if __name__ == "__main__":
    # Keep routine skip diagnostics out of the test runner's result lines.
    with contextlib.redirect_stdout(io.StringIO()):
        unittest.main(verbosity=2)
