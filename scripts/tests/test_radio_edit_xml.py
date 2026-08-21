"""Contract tests for scripts/radio_edit_xml.py (NAT-2989 steps 1-4).

Covers: exact rational frame rates, retimed SRT generation, nonzero source /
sequence timecode origins, and the range-building behaviors the artifacts
depend on (cuts, gaps, concatenation, duplicated spans, word-boundary cuts).
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
import xml.dom.minidom
from fractions import Fraction
from pathlib import Path

import pytest

import radio_edit_xml as rx

SCRIPT = Path(__file__).resolve().parents[1] / "radio_edit_xml.py"

FPS_24 = Fraction(24)
FPS_23976 = Fraction(24000, 1001)
FPS_2997 = Fraction(30000, 1001)


def make_words(specs: list[tuple[str, float, float]]) -> list[rx.Word]:
    """Build Word objects from (text, start_seconds, end_seconds) triples."""
    words = []
    for i, (text, start, end) in enumerate(specs):
        words.append(
            rx.Word(
                i,
                text,
                rx.clean_token(text),
                rx.to_fraction(start),
                rx.to_fraction(end),
            )
        )
    return words


def make_range(start: Fraction, end: Fraction, first: int, last: int) -> dict:
    return {
        "start": start,
        "end": end,
        "first_word": first,
        "last_word": last,
        "text": [],
    }


def parse_srt(text: str) -> list[dict]:
    blocks = [b for b in text.strip().split("\n\n") if b.strip()]
    cues = []
    pattern = re.compile(
        r"^(\d{2}):(\d{2}):(\d{2}),(\d{3}) --> (\d{2}):(\d{2}):(\d{2}),(\d{3})$"
    )
    for block in blocks:
        lines = block.strip().split("\n")
        assert len(lines) >= 3, f"malformed SRT block: {block!r}"
        assert lines[0].strip().isdigit(), f"bad cue index: {lines[0]!r}"
        match = pattern.match(lines[1].strip())
        assert match, f"bad SRT timing line: {lines[1]!r}"
        h1, m1, s1, ms1, h2, m2, s2, ms2 = map(int, match.groups())
        start = ((h1 * 60 + m1) * 60 + s1) * 1000 + ms1
        end = ((h2 * 60 + m2) * 60 + s2) * 1000 + ms2
        cues.append({"start_ms": start, "end_ms": end, "text": "\n".join(lines[2:])})
    return cues


# ---------------------------------------------------------------------------
# Frame-rate parsing
# ---------------------------------------------------------------------------


@pytest.mark.parametrize(
    ("value", "expected"),
    [
        ("24", Fraction(24)),
        ("25", Fraction(25)),
        ("30", Fraction(30)),
        ("24000/1001", Fraction(24000, 1001)),
        ("30000/1001", Fraction(30000, 1001)),
        ("23.976", Fraction(24000, 1001)),
        ("23.98", Fraction(24000, 1001)),
        ("29.97", Fraction(30000, 1001)),
        ("59.94", Fraction(60000, 1001)),
    ],
)
def test_parse_fps_accepts_integers_rationals_and_aliases(value, expected):
    assert rx.parse_fps(value) == expected


@pytest.mark.parametrize("value", ["abc", "zero", "0", "-24", "1/0", ""])
def test_parse_fps_rejects_invalid_rates(value):
    with pytest.raises(Exception):
        rx.parse_fps(value)


def test_parse_fraction_exact():
    assert rx.parse_fraction("0.035") == Fraction(35, 1000)
    assert rx.parse_fraction("1.15") == Fraction(23, 20)
    assert rx.parse_fraction("2") == Fraction(2)


# ---------------------------------------------------------------------------
# Time formatting (exact rational projection)
# ---------------------------------------------------------------------------


def test_fmt_time_integer_fps_matches_legacy_format():
    assert rx.fmt_time(1.0, 24) == "24/24s"
    assert rx.fmt_time(0, 30) == "0/30s"
    assert rx.fmt_time(Fraction(3, 2), 24) == "36/24s"
    assert rx.fmt_time(Fraction(11, 10), 25) == "28/25s"  # 27.5 frames, half-even


def test_fmt_time_rational_fps_uses_nested_fraction():
    assert rx.fmt_time(1, FPS_23976) == "24/24000/1001s"
    assert rx.fmt_time(Fraction(11, 10), FPS_2997) == "33/30000/1001s"


def test_fmt_offset_forwards_fps_regression():
    # The original bug: fmt_offset() dropped the fps argument and silently
    # rendered every offset on the 24 fps default grid.
    assert rx.fmt_offset(Fraction(11, 10), 30) == "33/30s"
    assert rx.fmt_offset(Fraction(11, 10), FPS_2997) == "33/30000/1001s"
    assert rx.fmt_offset(Fraction(11, 10), FPS_23976) == "26/24000/1001s"


def test_frame_duration_and_rate_tokens():
    assert rx.frame_duration_token(FPS_24) == "1/24s"
    assert rx.frame_duration_token(FPS_23976) == "1001/24000s"
    assert rx.frame_duration_token(FPS_2997) == "1001/30000s"
    assert rx.format_rate_token(FPS_24) == "24"
    assert rx.format_rate_token(FPS_23976) == "2398"
    assert rx.format_rate_token(FPS_2997) == "2997"


def test_ndf_timecode_decomposition():
    # NDF counts frames at the nominal rate: 24 for 23.976, 30 for 29.97.
    assert rx.seconds_to_ndf_timecode(Fraction(11, 10), FPS_2997) == "00:00:01:03"
    assert rx.seconds_to_ndf_timecode(1, FPS_23976) == "00:00:01:00"  # frame 24
    assert rx.seconds_to_ndf_timecode(Fraction(3600), FPS_24) == "01:00:00:00"
    assert rx.seconds_to_ndf_timecode(Fraction(11, 10), 25) == "00:00:01:03"  # 27.5 frames -> 28 (half-even)


# ---------------------------------------------------------------------------
# Range building: cuts, gaps, concatenation, word boundaries
# ---------------------------------------------------------------------------


def test_word_mode_cuts_removed_words():
    words = make_words(
        [
            ("Keep", 0.0, 0.5),
            ("shit", 0.6, 0.9),
            ("this", 1.0, 1.4),
        ]
    )
    rx.mark_word_level_removals(words)
    ranges = rx.kept_ranges(words, Fraction(0), Fraction(18, 100))
    assert len(ranges) == 2
    assert words[1].remove and words[1].reason == "profanity"
    assert ranges[0]["first_word"] == 0 and ranges[0]["last_word"] == 0
    assert ranges[1]["first_word"] == 2 and ranges[1]["last_word"] == 2


def test_word_mode_gaps_split_and_small_gaps_concatenate():
    words = make_words(
        [
            ("one", 0.0, 0.5),
            ("two", 0.58, 1.0),  # 0.08s gap -> concatenates (<= merge_gap 0.18)
            ("three", 5.0, 5.5),  # 4.0s gap -> splits
        ]
    )
    ranges = rx.kept_ranges(words, Fraction(0), Fraction(18, 100))
    assert [ (r["first_word"], r["last_word"]) for r in ranges ] == [(0, 1), (2, 2)]
    assert ranges[0]["end"] - ranges[0]["start"] == 1


def test_mark_time_range_respects_word_boundaries():
    words = make_words(
        [
            ("before", 0.5, 1.0),
            ("inside", 1.0, 2.0),
            ("after", 2.0, 2.5),
        ]
    )
    rx.mark_time_range(words, 1.0, 2.0, "paper-edit-drop")
    assert not words[0].remove  # ends exactly at the cut start: kept
    assert words[1].remove
    assert not words[2].remove  # starts exactly at the cut end: kept


def test_phrase_ranges_resolve_overlap_with_midpoint():
    # Pads (0.6 + 0.6) wider than the 1.18s pause make the padded ranges
    # overlap; the builder must resolve them to meet at the midpoint.
    words = make_words(
        [
            ("alpha", 0.0, 1.0),
            ("beta", 2.18, 3.0),
        ]
    )
    ranges = rx.phrase_kept_ranges(
        words,
        Fraction(6, 10),
        Fraction(6, 10),
        Fraction(115, 100),
        Fraction(45, 100),
    )
    assert len(ranges) == 2
    assert ranges[0]["end"] <= ranges[1]["start"]  # no overlap after midpoint split
    assert ranges[0]["end"] == ranges[1]["start"] == Fraction(159, 100)


# ---------------------------------------------------------------------------
# Artifacts: FCPXML / EDL with rational fps and nonzero origins
# ---------------------------------------------------------------------------

RANGES = [
    make_range(Fraction(1), Fraction(2), 0, 1),
    make_range(Fraction(5), Fraction(65, 10), 2, 3),
]


def test_fcpxml_integer_fps_is_backward_compatible(tmp_path):
    path = tmp_path / "out.fcpxml"
    rx.write_fcpxml(path, Path("/tmp/src.mp4"), RANGES, Fraction(10), 1920, 1080, FPS_24, 1)
    content = path.read_text()
    assert 'name="FFVideoFormat1080p24"' in content
    assert 'frameDuration="1/24s"' in content
    assert 'start="0s"' in content and 'tcStart="0s"' in content
    assert 'offset="0/24s"' in content
    assert 'offset="24/24s"' in content  # second cut starts at 1.0s on the timeline
    xml.dom.minidom.parseString(content)


def test_fcpxml_rational_fps_exact_offsets(tmp_path):
    path = tmp_path / "out.fcpxml"
    rx.write_fcpxml(path, Path("/tmp/src.mp4"), RANGES, Fraction(10), 1920, 1080, FPS_2997, 1)
    content = path.read_text()
    assert 'name="FFVideoFormat1080p2997"' in content
    assert 'frameDuration="1001/30000s"' in content
    assert 'offset="0/30000/1001s"' in content
    # Timeline offset 1.0s -> round(30000/1001) = 30 frames.
    assert 'offset="30/30000/1001s"' in content
    assert 'duration="30/30000/1001s"' in content  # first cut is exactly 1.0s
    xml.dom.minidom.parseString(content)


def test_fcpxml_nonzero_origins(tmp_path):
    path = tmp_path / "out.fcpxml"
    rx.write_fcpxml(
        path,
        Path("/tmp/src.mp4"),
        RANGES,
        Fraction(10),
        1920,
        1080,
        FPS_24,
        1,
        source_start=Fraction(3600),
        sequence_origin=Fraction(1800),
    )
    content = path.read_text()
    assert '<asset id="r2" name="src.mp4" start="86400/24s"' in content
    assert 'tcStart="43200/24s"' in content
    xml.dom.minidom.parseString(content)


def test_edl_zero_origins_matches_legacy_columns(tmp_path):
    path = tmp_path / "out.edl"
    rx.write_edl(path, Path("/tmp/My Source.mp4"), RANGES, FPS_24)
    lines = [line for line in path.read_text().splitlines() if line and not line.startswith("*") and not line.startswith("TITLE") and not line.startswith("FCM")]
    assert lines[0].startswith("001  MYSOURCE")
    assert lines[0].endswith("00:00:01:00 00:00:02:00 00:00:00:00 00:00:01:00")
    # Second cut: source 5.0-6.5s, record 1.0-2.5s.
    assert lines[1].endswith("00:00:05:00 00:00:06:12 00:00:01:00 00:00:02:12")


def test_edl_nonzero_origins_shift_timecodes(tmp_path):
    path = tmp_path / "out.edl"
    rx.write_edl(
        path,
        Path("/tmp/src.mp4"),
        RANGES,
        FPS_24,
        source_start=Fraction(3600),
        sequence_origin=Fraction(1800),
    )
    lines = [
        line
        for line in path.read_text().splitlines()
        if line and not line.startswith(("*", "TITLE", "FCM"))
    ]
    assert lines[0].endswith("01:00:01:00 01:00:02:00 00:30:00:00 00:30:01:00")
    assert lines[1].endswith("01:00:05:00 01:00:06:12 00:30:01:00 00:30:02:12")


def test_edl_2997_ndf_timecode_uses_nominal_rate(tmp_path):
    path = tmp_path / "out.edl"
    rx.write_edl(path, Path("/tmp/src.mp4"), [make_range(Fraction(0), Fraction(11, 10), 0, 1)], FPS_2997)
    line = next(
        line
        for line in path.read_text().splitlines()
        if line and not line.startswith(("*", "TITLE", "FCM"))
    )
    # 1.1s -> round(1.1 * 30000/1001) = 33 frames -> 00:00:01:03 NDF.
    assert line.endswith("00:00:00:00 00:00:01:03")


# ---------------------------------------------------------------------------
# Retimed SRT
# ---------------------------------------------------------------------------


def test_srt_floor_ceil_projection_at_24(tmp_path):
    words = make_words([("Hello", 0.5, 1.2)])
    ranges = [make_range(Fraction(0), Fraction(6, 5), 0, 0)]
    path = tmp_path / "out.srt"
    rx.write_srt(path, ranges, words, FPS_24)
    cues = parse_srt(path.read_text())
    assert len(cues) == 1
    # Timeline cue is 0.5-1.2s: start=floor(0.5*24)=12 frames -> 500ms;
    # end=ceil(1.2*24)=ceil(28.8)=29 frames -> 29/24s = 1208.33ms -> 1208.
    assert cues[0]["start_ms"] == 500
    assert cues[0]["end_ms"] == 1208
    assert cues[0]["text"] == "Hello"


def test_srt_rational_fps_exact_milliseconds(tmp_path):
    words = make_words([("Hi", 0.0, 1.0)])
    ranges = [make_range(Fraction(0), Fraction(1), 0, 0)]
    path = tmp_path / "out.srt"
    rx.write_srt(path, ranges, words, FPS_23976)
    cues = parse_srt(path.read_text())
    # end=ceil(23976/1001)=24 frames -> 24/24000*1001 = 1.001s exactly.
    assert cues[0]["start_ms"] == 0
    assert cues[0]["end_ms"] == 1001


def test_srt_bounds_zero_start_and_collapsed_cue(tmp_path):
    words = make_words([("A", 0.0, 0.0), ("B", 0.5, 0.5)])
    ranges = [make_range(Fraction(0), Fraction(3, 5), 0, 1)]
    path = tmp_path / "out.srt"
    rx.write_srt(path, ranges, words, FPS_24)
    cues = parse_srt(path.read_text())
    assert cues[0]["start_ms"] == 0
    for cue in cues:
        assert cue["end_ms"] > cue["start_ms"]


def test_srt_never_overlaps_after_projection(tmp_path):
    words = make_words(
        [
            ("one.", 0.0, 0.6),
            ("two", 0.55, 1.0),  # overlaps previous cue after floor/ceil
            ("three", 0.98, 1.4),
        ]
    )
    ranges = [make_range(Fraction(0), Fraction(7, 5), 0, 2)]
    path = tmp_path / "out.srt"
    rx.write_srt(path, ranges, words, FPS_2997)
    cues = parse_srt(path.read_text())
    assert len(cues) == 2  # sentence break splits the cue, then clamping kicks in
    for prev, nxt in zip(cues, cues[1:]):
        assert nxt["start_ms"] >= prev["end_ms"]


def test_srt_cues_are_retimed_to_edited_timeline(tmp_path):
    words = make_words(
        [
            ("first.", 0.0, 0.5),
            ("second", 10.0, 10.5),
        ]
    )
    ranges = [
        make_range(Fraction(0), Fraction(1, 2), 0, 0),
        make_range(Fraction(10), Fraction(21, 2), 1, 1),
    ]
    path = tmp_path / "out.srt"
    rx.write_srt(path, ranges, words, FPS_24)
    cues = parse_srt(path.read_text())
    assert cues[0]["start_ms"] == 0 and cues[0]["end_ms"] == 500
    # Second range maps source 10.0-10.5s to timeline 0.5-1.0s; the sentence
    # break after "first." keeps it as its own cue.
    assert cues[1]["start_ms"] == 500 and cues[1]["end_ms"] == 1000


def test_srt_breaks_cues_on_gaps_and_sentences(tmp_path):
    words = make_words(
        [
            ("Stop.", 0.0, 0.4),
            ("Wait", 2.5, 2.8),  # 2.1s timeline gap after previous word
            ("more", 2.9, 3.2),
        ]
    )
    ranges = [make_range(Fraction(0), Fraction(16, 5), 0, 2)]
    path = tmp_path / "out.srt"
    rx.write_srt(path, ranges, words, FPS_24)
    cues = parse_srt(path.read_text())
    assert [c["text"] for c in cues] == ["Stop.", "Wait more"]


def test_srt_duplicated_span_keeps_cues_disjoint(tmp_path):
    words = make_words([("echo.", 1.0, 2.0)])
    # The same source span used twice on the timeline (editor repeat); the
    # sentence break keeps one cue per use.
    ranges = [
        make_range(Fraction(1), Fraction(2), 0, 0),
        make_range(Fraction(1), Fraction(2), 0, 0),
    ]
    path = tmp_path / "out.srt"
    rx.write_srt(path, ranges, words, FPS_24)
    cues = parse_srt(path.read_text())
    assert len(cues) == 2
    assert cues[0]["end_ms"] <= cues[1]["start_ms"]
    assert cues[1]["text"] == "echo."


def test_srt_empty_ranges_writes_empty_file(tmp_path):
    path = tmp_path / "out.srt"
    rx.write_srt(path, [], make_words([("word", 0.0, 0.5)]), FPS_24)
    assert path.read_text() == ""


# ---------------------------------------------------------------------------
# End-to-end CLI
# ---------------------------------------------------------------------------


def write_transcript(path: Path) -> None:
    # Two clearly different sentences (near-identical phrasing would trigger
    # the script's real false-start/duplicate heuristics and change the cut).
    words = [
        {"text": "This", "start": 500, "end": 600},
        {"text": "is", "start": 640, "end": 740},
        {"text": "the", "start": 780, "end": 880},
        {"text": "first", "start": 920, "end": 1020},
        {"text": "take.", "start": 1060, "end": 1160},
        {"text": "This", "start": 1560, "end": 1660},
        {"text": "one", "start": 1700, "end": 1800},
        {"text": "feels", "start": 1840, "end": 1940},
        {"text": "much", "start": 1980, "end": 2080},
        {"text": "better.", "start": 2120, "end": 2220},
    ]
    path.write_text(json.dumps({"words": words}))


def run_cli(out_dir: Path, fps: str, transcript: Path, source: Path, extra: list[str] | None = None) -> dict:
    cmd = [
        sys.executable,
        str(SCRIPT),
        "--transcript",
        str(transcript),
        "--source",
        str(source),
        "--out-dir",
        str(out_dir),
        "--duration",
        "3.0",
        "--fps",
        fps,
        "--keep-pause",
        "10",  # keep both sentences in one phrase range for deterministic math
        "--suffix",
        "_radio_edit_v2",
    ]
    if extra:
        cmd.extend(extra)
    proc = subprocess.run(cmd, capture_output=True, text=True)
    assert proc.returncode == 0, f"CLI failed ({proc.returncode}):\n{proc.stderr}"
    return json.loads(proc.stdout)


@pytest.mark.parametrize("fps", ["24", "23.976", "29.97"])
def test_cli_end_to_end_artifacts(tmp_path, fps):
    transcript = tmp_path / "src_transcript.json"
    write_transcript(transcript)
    out_dir = tmp_path / "out"
    summary = run_cli(out_dir, fps, transcript, tmp_path / "src.mp4")

    stem = "src_radio_edit_v2"
    for suffix in (".fcpxml", ".edl", "_decisions.json", "_cuts.csv", "_captions.srt"):
        assert (out_dir / f"{stem}{suffix}").exists(), f"missing {suffix}"
    assert summary["srt"] == str(out_dir / f"{stem}_captions.srt")
    assert summary["cuts"] == 1

    content = (out_dir / f"{stem}.fcpxml").read_text()
    xml.dom.minidom.parseString(content)

    cues = parse_srt((out_dir / f"{stem}_captions.srt").read_text())
    assert len(cues) >= 1
    for prev, nxt in zip(cues, cues[1:]):
        assert nxt["start_ms"] >= prev["end_ms"]
    for cue in cues:
        assert cue["start_ms"] >= 0
        assert cue["end_ms"] > cue["start_ms"]
        assert cue["text"].startswith("This")


def test_cli_rational_fps_writes_exact_frame_tokens(tmp_path):
    transcript = tmp_path / "src_transcript.json"
    write_transcript(transcript)
    out_dir = tmp_path / "out"
    run_cli(out_dir, "29.97", transcript, tmp_path / "src.mp4")

    content = (out_dir / "src_radio_edit_v2.fcpxml").read_text()
    assert 'frameDuration="1001/30000s"' in content
    assert 'name="FFVideoFormat1080p2997"' in content
    assert 'offset="0/30000/1001s"' in content
    # Range is 0.28-2.60s (2.32s): round(2.32 * 30000/1001) = round(69.53) = 70.
    assert 'duration="70/30000/1001s"' in content
    edl = (out_dir / "src_radio_edit_v2.edl").read_text()
    assert "FCM: NON-DROP FRAME" in edl
    # FROM 0.28s -> 8 frames; TO 2.60s -> 78 frames; record end 70 frames.
    assert "00:00:00:08 00:00:02:18 00:00:00:00 00:00:02:10" in edl


def test_cli_deterministic_across_runs(tmp_path):
    transcript = tmp_path / "src_transcript.json"
    write_transcript(transcript)
    first = run_cli(tmp_path / "a", "23.976", transcript, tmp_path / "src.mp4")
    second = run_cli(tmp_path / "b", "23.976", transcript, tmp_path / "src.mp4")
    for key in ("fcpxml", "edl", "decisions", "csv", "srt"):
        assert Path(first[key]).read_bytes() == Path(second[key]).read_bytes(), key


def test_cli_nonzero_origins(tmp_path):
    transcript = tmp_path / "src_transcript.json"
    write_transcript(transcript)
    out_dir = tmp_path / "out"
    run_cli(
        out_dir,
        "24",
        transcript,
        tmp_path / "src.mp4",
        extra=["--source-start", "3600", "--sequence-origin", "1800"],
    )
    content = (out_dir / "src_radio_edit_v2.fcpxml").read_text()
    assert 'start="86400/24s"' in content
    assert 'tcStart="43200/24s"' in content
    edl = (out_dir / "src_radio_edit_v2.edl").read_text()
    # FROM 3600+0.28s -> round(86406.72)=86407 frames -> 01:00:00:07;
    # TO 3600+2.60s -> 86462 frames -> 01:00:02:14;
    # record 1800s (=30min) -> 00:30:00:00, end 1802.32s -> 43256 frames -> 00:30:02:08.
    assert "01:00:00:07 01:00:02:14 00:30:00:00 00:30:02:08" in edl


def test_cli_rejects_bad_fps(tmp_path, capsys):
    proc = subprocess.run(
        [
            sys.executable,
            str(SCRIPT),
            "--transcript",
            str(tmp_path / "t.json"),
            "--source",
            str(tmp_path / "s.mp4"),
            "--out-dir",
            str(tmp_path / "o"),
            "--duration",
            "1",
            "--fps",
            "banana",
        ],
        capture_output=True,
        text=True,
    )
    assert proc.returncode != 0
    assert "invalid frame rate" in proc.stderr
