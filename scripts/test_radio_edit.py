#!/usr/bin/env python3
"""Radio-edit score/output checks; add --benchmark for a local CPU comparison."""

import hashlib
import itertools
import json
import random
import statistics
import sys
import tempfile
import time
import unittest
from pathlib import Path
from unittest.mock import patch

import radio_edit_xml as radio


def reference_lcs_ratio(first, second):
    """Conventional DP oracle, independent of the packed-bit implementation."""
    if not first or not second:
        return 0.0
    previous = [0] * (len(second) + 1)
    for token in first:
        current = [0]
        for column, other in enumerate(second, 1):
            current.append(previous[column - 1] + 1 if token == other else
                           max(previous[column], current[-1]))
        previous = current
    return previous[-1] / len(first)


def synthetic_transcript(segment_count=72, long_passages=False):
    """Deterministic timings, varied thoughts, repeated takes and filler."""
    rng = random.Random(533)
    vocabulary = "vector index retrieval ranking memory context design latency queue pipeline output storage token search graph".split()
    words, previous, now = [], [], 0
    for segment in range(segment_count):
        length = rng.randint(90, 130) if long_passages else rng.randint(8, 28)
        tokens = [rng.choice(vocabulary + [f"topic{segment}"] * 5) for _ in range(length)]
        if segment % 4 == 1:
            tokens = previous + tokens[:8]
        elif segment % 4 == 0:
            previous = tokens[:]
        if segment % 11 == 0:
            tokens = ["um", *tokens, "shit"]
        for index, token in enumerate(tokens):
            text = token + ("." if index == len(tokens) - 1 else "")
            words.append({"text": text, "start": now, "end": now + 180})
            now += 230
        now += 800
    return {"words": words}


def analyze(transcript, mode="phrase"):
    words = radio.load_words(transcript)
    radio.mark_word_level_removals(words)
    segments = radio.segment_words(words)
    radio.mark_segment_removals(words, segments)
    ranges = (radio.kept_ranges(words, .035, .18) if mode == "word" else
              radio.phrase_kept_ranges(words, .22, .38, 1.15, .45))
    return words, ranges


def export(root, words, ranges):
    duration = words[-1].end + 1
    source = root / "source with spaces.mp4"
    radio.write_fcpxml(root / "edit.fcpxml", source, ranges, duration, 1920, 1080, 24, 1)
    radio.write_edl(root / "edit.edl", source, ranges, 24)
    radio.write_csv(root / "cuts.csv", ranges)
    radio.write_decisions(root / "decisions.json", words, ranges, duration)
    return {name: (root / name).read_bytes() for name in
            ("edit.fcpxml", "edit.edl", "cuts.csv", "decisions.json")}


class LCSTests(unittest.TestCase):
    def test_order_repetitions_and_asymmetric_denominator(self):
        cases = [([], ["alpha"], 0), (["alpha"], [], 0),
                 (["alpha", "beta"], ["beta", "alpha"], .5),
                 (["alpha"] * 3, ["alpha"] * 2, 2 / 3),
                 (["alpha"], ["alpha", "beta", "gamma"], 1),
                 (["alpha", "beta", "gamma"], ["alpha"], 1 / 3),
                 (["Alpha", "beta!"], ["alpha", "beta"], 0)]
        for first, second, expected in cases:
            with self.subTest(first=first, second=second):
                self.assertEqual(radio.lcs_ratio(first, second), expected)

    def test_exhaustive_short_sequences_match_dp_oracle(self):
        sequences = [list(tokens) for length in range(6) for tokens in
                     itertools.product(("alpha", "beta"), repeat=length)]
        for first in sequences:
            for second in sequences:
                self.assertEqual(radio.lcs_ratio(first, second), reference_lcs_ratio(first, second),
                                 (first, second))

    def test_long_sequences_cross_machine_word_boundaries(self):
        rng = random.Random(533)
        for _ in range(150):
            first = [rng.choice(("a", "b", "c", "d", "e")) for _ in range(rng.randint(1, 220))]
            second = [rng.choice(("a", "b", "c", "d", "e")) for _ in range(rng.randint(1, 220))]
            self.assertEqual(radio.lcs_ratio(first, second), reference_lcs_ratio(first, second))
            self.assertEqual(radio.lcs_ratio(second, first), reference_lcs_ratio(second, first))

    def test_edit_decisions_and_all_exports_match_dp_oracle(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            transcript = root / "transcript.json"
            transcript.write_text(json.dumps(synthetic_transcript()))
            for mode in ("phrase", "word"):
                with self.subTest(mode=mode):
                    actual_words, actual_ranges = analyze(transcript, mode)
                    actual = export(root, actual_words, actual_ranges)
                    with patch.object(radio, "lcs_ratio", reference_lcs_ratio):
                        expected_words, expected_ranges = analyze(transcript, mode)
                    expected = export(root, expected_words, expected_ranges)
                    self.assertEqual(actual, expected)
                    self.assertEqual(actual_ranges, expected_ranges)
                    flags = [(w.remove, w.reason) for w in actual_words]
                    self.assertEqual(flags, [(w.remove, w.reason) for w in expected_words])
                    self.assertTrue(any(reason == "profanity" for _, reason in flags))
                    self.assertTrue(any(reason in ("false-start-retake", "duplicate-retake")
                                        for _, reason in flags))
                    self.assertTrue(actual_ranges)


def benchmark():
    results = []
    with tempfile.TemporaryDirectory() as temp:
        transcript = Path(temp) / "transcript.json"
        for name, count, long_passages in (("short_takes", 480, False),
                                           ("long_passages", 120, True)):
            data = synthetic_transcript(count, long_passages)
            transcript.write_text(json.dumps(data))
            timings = {"dp": [], "packed": []}
            digests = {}
            for repeat in range(5):
                # Alternate order to reduce systematic warm-cache/host drift.
                names = ("dp", "packed") if repeat % 2 == 0 else ("packed", "dp")
                for algorithm in names:
                    function = reference_lcs_ratio if algorithm == "dp" else radio.lcs_ratio
                    with patch.object(radio, "lcs_ratio", function):
                        started = time.perf_counter()
                        words, ranges = analyze(transcript)
                        timings[algorithm].append(time.perf_counter() - started)
                    digest = hashlib.sha256(json.dumps({
                        "flags": [(w.remove, w.reason) for w in words], "ranges": ranges
                    }, sort_keys=True).encode()).hexdigest()
                    if digests:
                        assert digest == next(iter(digests.values())), "edit behavior changed"
                    digests[algorithm] = digest
            medians = {key: statistics.median(value) for key, value in timings.items()}
            results.append({"fixture": name, "words": len(data["words"]), "segments": count,
                            "seconds": timings, "median_seconds": medians,
                            "speedup": medians["dp"] / medians["packed"],
                            "output_sha256": digests})
    print(json.dumps(results, indent=2))


if __name__ == "__main__":
    if sys.argv[1:] == ["--benchmark"]:
        benchmark()
    else:
        unittest.main(verbosity=2)
