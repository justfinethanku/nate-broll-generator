#!/usr/bin/env python3
"""Create a transcript-driven radio-edit FCPXML from AssemblyAI word timings.

All timeline math is done in exact rational arithmetic (fractions.Fraction):
word timings, pads, durations, and offsets never accumulate float error, and
frame rates can be exact rationals such as 24000/1001 (23.976) or
30000/1001 (29.97). Alongside FCPXML/EDL/decisions/cuts artifacts, the script
emits a retimed SRT caption sidecar whose cues live on the edited timeline.
"""

from __future__ import annotations

import argparse
import csv
import html
import json
import math
import re
from collections import Counter
from dataclasses import dataclass
from fractions import Fraction
from pathlib import Path
from typing import Iterable


PROFANITY = {
    "ass",
    "asses",
    "asshole",
    "bullshit",
    "bitch",
    "damn",
    "fucked",
    "fucker",
    "fuckers",
    "fucking",
    "fuck",
    "goddamn",
    "hell",
    "shit",
    "shitty",
}

FILLER_ONLY = {
    "uh",
    "um",
    "erm",
    "hmm",
    "mm",
    "mmm",
    "ah",
    "oh",
}

WEAK_STARTS = {
    "and",
    "but",
    "so",
    "like",
    "okay",
    "right",
    "well",
}

TRAILING_FILLER = FILLER_ONLY | {"like", "right", "okay"}
SERIOUS_CUT_REASONS = {
    "profanity",
    "false-start-retake",
    "duplicate-retake",
    "orphan-fragment",
    "opening-reset",
    "semantic-retake",
    "llm-high",
    "llm-medium",
    "paper-edit-drop",
}
STOPWORDS = {
    "a",
    "about",
    "actually",
    "again",
    "all",
    "also",
    "am",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "because",
    "been",
    "but",
    "by",
    "can",
    "could",
    "did",
    "do",
    "does",
    "doing",
    "for",
    "from",
    "get",
    "go",
    "going",
    "had",
    "has",
    "have",
    "here",
    "how",
    "i",
    "if",
    "in",
    "inside",
    "is",
    "it",
    "it's",
    "just",
    "kind",
    "know",
    "like",
    "lot",
    "mean",
    "need",
    "not",
    "of",
    "on",
    "or",
    "our",
    "out",
    "really",
    "right",
    "say",
    "see",
    "so",
    "some",
    "something",
    "that",
    "that's",
    "the",
    "them",
    "then",
    "there",
    "there's",
    "this",
    "to",
    "up",
    "was",
    "way",
    "we",
    "we're",
    "what",
    "when",
    "where",
    "which",
    "who",
    "why",
    "with",
    "work",
    "you",
    "your",
    "you're",
}


@dataclass
class Word:
    index: int
    text: str
    clean: str
    start: Fraction
    end: Fraction
    remove: bool = False
    reason: str = ""


@dataclass
class Segment:
    start_i: int
    end_i: int
    start: Fraction
    end: Fraction
    text: str
    norm_tokens: list[str]

    @property
    def duration(self) -> Fraction:
        return self.end - self.start


def to_fraction(value: object) -> Fraction:
    """Convert JSON/CLI numbers to an exact Fraction.

    Floats go through their shortest string representation so a value that was
    parsed from "1.234" becomes the exact rational 1234/1000 rather than the
    float's binary expansion; ints, Fractions, and numeric strings pass
    through exactly.
    """
    if isinstance(value, Fraction):
        return value
    if isinstance(value, float):
        try:
            return Fraction(str(value))
        except ValueError:
            return Fraction(value)
    return Fraction(str(value))


def clean_token(text: str) -> str:
    return re.sub(r"[^a-z0-9']", "", text.lower()).strip("'")


def load_words(path: Path) -> list[Word]:
    data = json.loads(path.read_text())
    words = []
    for i, raw in enumerate(data.get("words") or []):
        text = raw.get("text") or ""
        start = to_fraction(raw.get("start") or 0) / 1000
        end = to_fraction(raw.get("end") or raw.get("start") or 0) / 1000
        words.append(Word(i, text, clean_token(text), start, end))
    return words


def normalize_tokens(words: Iterable[Word]) -> list[str]:
    tokens = []
    for word in words:
        token = word.clean
        if not token or token in FILLER_ONLY or token in PROFANITY:
            continue
        tokens.append(token)
    return tokens


def stem_token(token: str) -> str:
    for suffix in ("ingly", "edly", "ing", "edly", "ed", "ly", "es", "s"):
        if len(token) > len(suffix) + 3 and token.endswith(suffix):
            return token[: -len(suffix)]
    return token


def content_tokens(tokens: Iterable[str]) -> list[str]:
    return [
        stem_token(t)
        for t in tokens
        if t and t not in STOPWORDS and t not in FILLER_ONLY and t not in PROFANITY and len(t) > 2
    ]


def cosine_tokens(a: list[str], b: list[str]) -> float:
    if not a or not b:
        return 0.0
    ca = Counter(a)
    cb = Counter(b)
    common = set(ca) & set(cb)
    dot = sum(ca[t] * cb[t] for t in common)
    norm_a = math.sqrt(sum(v * v for v in ca.values()))
    norm_b = math.sqrt(sum(v * v for v in cb.values()))
    if not norm_a or not norm_b:
        return 0.0
    return dot / (norm_a * norm_b)


def has_reset_language(seg: Segment) -> bool:
    text = " ".join(seg.norm_tokens)
    reset_phrases = (
        "do that better",
        "try that again",
        "say that again",
        "riff",
        "take that",
        "start again",
        "let me",
    )
    return any(phrase in text for phrase in reset_phrases)


def segment_is_incomplete(seg: Segment) -> bool:
    if not seg.text:
        return False
    if not re.search(r"[.!?]$", seg.text.strip()):
        return True
    if len(seg.norm_tokens) <= 8:
        return True
    if seg.norm_tokens and seg.norm_tokens[0] in WEAK_STARTS:
        return True
    return has_reset_language(seg)


def segment_words(words: list[Word]) -> list[Segment]:
    if not words:
        return []
    starts = [0]
    for i in range(1, len(words)):
        prev = words[i - 1]
        cur = words[i]
        gap = cur.start - prev.end
        punctuated = bool(re.search(r"[.!?]$", prev.text))
        if gap >= 0.72 or (punctuated and gap >= 0.28):
            starts.append(i)
    starts.append(len(words))

    segments = []
    for a, b in zip(starts, starts[1:]):
        chunk = words[a:b]
        if not chunk:
            continue
        text = " ".join(w.text for w in chunk)
        segments.append(
            Segment(a, b - 1, chunk[0].start, chunk[-1].end, text, normalize_tokens(chunk))
        )
    return segments


def jaccard(a: list[str], b: list[str]) -> float:
    if not a or not b:
        return 0.0
    set_a, set_b = set(a), set(b)
    return len(set_a & set_b) / len(set_a | set_b)


def ordered_overlap(a: list[str], b: list[str]) -> float:
    if not a or not b:
        return 0.0
    bigrams_a = set(zip(a, a[1:])) if len(a) > 1 else set()
    bigrams_b = set(zip(b, b[1:])) if len(b) > 1 else set()
    if not bigrams_a or not bigrams_b:
        return jaccard(a, b)
    return len(bigrams_a & bigrams_b) / max(1, min(len(bigrams_a), len(bigrams_b)))


def lcs_ratio(shorter: list[str], longer: list[str]) -> float:
    if not shorter or not longer:
        return 0.0
    prev = [0] * (len(longer) + 1)
    for token in shorter:
        cur = [0]
        for j, other in enumerate(longer, 1):
            if token == other:
                cur.append(prev[j - 1] + 1)
            else:
                cur.append(max(cur[-1], prev[j]))
        prev = cur
    return prev[-1] / len(shorter)


def mark_range(words: list[Word], start_i: int, end_i: int, reason: str) -> None:
    for i in range(start_i, end_i + 1):
        if 0 <= i < len(words):
            words[i].remove = True
            words[i].reason = reason


def mark_time_range(words: list[Word], start: float, end: float, reason: str) -> None:
    for word in words:
        if word.end > start and word.start < end:
            word.remove = True
            word.reason = reason


def apply_extra_cuts(words: list[Word], path: Path | None, min_confidence: str) -> None:
    if not path:
        return
    rank = {"low": 0, "medium": 1, "high": 2}
    threshold = rank[min_confidence]
    data = json.loads(path.read_text())
    cuts = data.get("remove") if isinstance(data, dict) else data
    for cut in cuts or []:
        confidence = str(cut.get("confidence", "high")).lower()
        if rank.get(confidence, 2) < threshold:
            continue
        start = to_fraction(cut["start"])
        end = to_fraction(cut["end"])
        reason = f"llm-{confidence}"
        mark_time_range(words, start, end, reason)


def expand_segment_specs(specs: Iterable[object]) -> set[int]:
    ids: set[int] = set()
    for spec in specs:
        if isinstance(spec, int):
            ids.add(spec)
        elif isinstance(spec, list) and len(spec) == 2:
            start, end = int(spec[0]), int(spec[1])
            ids.update(range(start, end + 1))
        elif isinstance(spec, dict):
            if "id" in spec:
                ids.add(int(spec["id"]))
            else:
                start, end = int(spec["start"]), int(spec["end"])
                ids.update(range(start, end + 1))
        else:
            raise ValueError(f"Unsupported segment spec: {spec!r}")
    return ids


def apply_keep_segments(words: list[Word], segments: list[Segment], path: Path | None, keep_key: str) -> None:
    if not path:
        return
    data = json.loads(path.read_text())
    specs = data.get(keep_key)
    if specs is None:
        specs = data.get("keep")
    keep_ids = expand_segment_specs(specs or [])
    for seg_id, seg in enumerate(segments):
        if seg_id in keep_ids:
            continue
        mark_range(words, seg.start_i, seg.end_i, "paper-edit-drop")


def mark_word_level_removals(words: list[Word]) -> None:
    for word in words:
        if word.clean in PROFANITY:
            word.remove = True
            word.reason = "profanity"
        elif word.clean in FILLER_ONLY:
            word.remove = True
            word.reason = "filler"

    for i, word in enumerate(words):
        if word.remove:
            continue
        if word.clean in WEAK_STARTS and i + 1 < len(words):
            prev_gap = word.start - words[i - 1].end if i else 99
            next_gap = words[i + 1].start - word.end
            if prev_gap >= 0.45 and next_gap <= 0.18:
                word.remove = True
                word.reason = "weak-start"

    for i in range(len(words) - 1):
        if words[i].remove:
            continue
        if words[i].clean and words[i].clean == words[i + 1].clean:
            words[i].remove = True
            words[i].reason = "stutter-repeat"


def mark_segment_removals(words: list[Word], segments: list[Segment]) -> None:
    # Remove early camera/setup chatter before the first obvious reset.
    for prev, nxt in zip(segments, segments[1:]):
        reset_gap = nxt.start - prev.end
        if prev.end <= 35 and reset_gap >= 6:
            for seg in segments:
                if seg.end <= prev.end:
                    mark_range(words, seg.start_i, seg.end_i, "opening-reset")
            break

    # Remove short abandoned starts when a stronger nearby retake follows.
    for i, seg in enumerate(segments):
        if len(seg.norm_tokens) < 3 or len(seg.norm_tokens) > 18:
            continue
        if seg.duration > 8:
            continue
        for nxt in segments[i + 1 : min(i + 12, len(segments))]:
            if nxt.start - seg.end > 60:
                break
            if len(nxt.norm_tokens) < max(5, len(seg.norm_tokens)):
                continue
            prefix = nxt.norm_tokens[: len(seg.norm_tokens)]
            score = max(
                jaccard(seg.norm_tokens, prefix),
                ordered_overlap(seg.norm_tokens, prefix),
                lcs_ratio(seg.norm_tokens, nxt.norm_tokens),
            )
            if score >= 0.62:
                mark_range(words, seg.start_i, seg.end_i, "false-start-retake")
                break

    # Remove near-duplicate complete thoughts when repeated close together; keep the later take.
    for i, seg in enumerate(segments):
        if len(seg.norm_tokens) < 6:
            continue
        for nxt in segments[i + 1 : min(i + 12, len(segments))]:
            if nxt.start - seg.end > 60:
                break
            if len(nxt.norm_tokens) < 6:
                continue
            length_ratio = min(len(seg.norm_tokens), len(nxt.norm_tokens)) / max(
                len(seg.norm_tokens), len(nxt.norm_tokens)
            )
            containment = lcs_ratio(seg.norm_tokens, nxt.norm_tokens)
            score = max(
                jaccard(seg.norm_tokens, nxt.norm_tokens),
                ordered_overlap(seg.norm_tokens, nxt.norm_tokens),
                containment,
            )
            if (length_ratio >= 0.58 and score >= 0.62) or containment >= 0.78:
                mark_range(words, seg.start_i, seg.end_i, "duplicate-retake")
                break

    # Remove semantically similar rough attempts when a fuller nearby take says
    # the same thing with different wording. This catches the common Nate pattern
    # of partial idea -> pause/reset -> cleaner version.
    for i, seg in enumerate(segments):
        if any(words[k].remove and words[k].reason in SERIOUS_CUT_REASONS for k in range(seg.start_i, seg.end_i + 1)):
            continue
        seg_content = content_tokens(seg.norm_tokens)
        if len(seg_content) < 3 or len(seg_content) > 28:
            continue
        if seg.duration > 12 and not segment_is_incomplete(seg):
            continue

        best_score = 0.0
        best_window_len = 0
        best_shared = 0
        best_lcs = 0.0
        for j in range(i + 1, min(i + 16, len(segments))):
            if segments[j].start - seg.end > 90:
                break
            future_tokens: list[str] = []
            future_end = segments[j].end
            for k in range(j, min(j + 4, len(segments))):
                if segments[k].start - seg.end > 90:
                    break
                future_tokens.extend(segments[k].norm_tokens)
                future_end = segments[k].end
                if future_end - segments[j].start > 35:
                    break

                future_content = content_tokens(future_tokens)
                if len(future_content) < max(5, len(seg_content)):
                    continue

                shared = len(set(seg_content) & set(future_content))
                if shared < 3:
                    continue
                containment = lcs_ratio(seg_content, future_content)
                cosine = cosine_tokens(seg_content, future_content)
                jac = jaccard(seg_content, future_content)
                score = (0.48 * containment) + (0.34 * cosine) + (0.18 * jac)
                if score > best_score:
                    best_score = score
                    best_window_len = len(future_content)
                    best_shared = shared
                    best_lcs = containment

        future_is_fuller = best_window_len >= len(seg_content) * 1.25
        rough_attempt = segment_is_incomplete(seg) or len(seg_content) <= 12
        strong_retread = best_score >= 0.56 or (best_lcs >= 0.72 and best_shared >= 4)
        likely_rough_retread = rough_attempt and best_score >= 0.42
        if future_is_fuller and (strong_retread or likely_rough_retread):
            mark_range(words, seg.start_i, seg.end_i, "semantic-retake")

    # Trim tiny orphan fragments that are surrounded by cuts.
    for seg in segments:
        kept = [w for w in words[seg.start_i : seg.end_i + 1] if not w.remove and w.clean]
        if not kept:
            continue
        if len(kept) <= 2 and seg.duration < 1.1:
            mark_range(words, seg.start_i, seg.end_i, "orphan-fragment")

    # Trim trailing hesitation words at the end of a sentence-like segment.
    for seg in segments:
        i = seg.end_i
        while i >= seg.start_i and words[i].clean in TRAILING_FILLER:
            words[i].remove = True
            words[i].reason = "trailing-filler"
            i -= 1


def kept_ranges(words: list[Word], pad: Fraction, min_gap: Fraction) -> list[dict]:
    ranges = []
    active = None
    for word in words:
        if word.remove or not word.clean:
            if active:
                ranges.append(active)
                active = None
            continue
        start = max(Fraction(0), word.start - pad)
        end = word.end + pad
        if active and start - active["end"] <= min_gap:
            active["end"] = max(active["end"], end)
            active["last_word"] = word.index
            active["text"].append(word.text)
        else:
            if active:
                ranges.append(active)
            active = {"start": start, "end": end, "first_word": word.index, "last_word": word.index, "text": [word.text]}
    if active:
        ranges.append(active)
    return [r for r in ranges if r["end"] - r["start"] >= 0.05]


def phrase_kept_ranges(
    words: list[Word],
    head_pad: Fraction,
    tail_pad: Fraction,
    keep_pause: Fraction,
    min_range_duration: Fraction,
) -> list[dict]:
    """Build editor-friendly phrase ranges instead of cutting every word gap.

    The source of truth is still word-level timing, but this mode only splits on
    major spoken pauses or serious removals. Light cleanup flags are preserved
    in the decisions JSON without forcing tiny timeline slices.
    """

    ranges = []
    active = None
    previous_included = None

    for word in words:
        if not word.clean:
            continue

        excluded = word.remove and word.reason in SERIOUS_CUT_REASONS
        if excluded:
            if active:
                ranges.append(active)
                active = None
            previous_included = None
            continue

        if previous_included:
            gap = word.start - previous_included.end
            has_serious_cut_between = any(
                w.remove and w.reason in SERIOUS_CUT_REASONS
                for w in words[previous_included.index + 1 : word.index]
            )
            if gap > keep_pause or has_serious_cut_between:
                if active:
                    ranges.append(active)
                active = None

        if active:
            active["last_word"] = word.index
            active["speech_end"] = word.end
            active["text"].append(word.text)
        else:
            active = {
                "speech_start": word.start,
                "speech_end": word.end,
                "first_word": word.index,
                "last_word": word.index,
                "text": [word.text],
            }

        previous_included = word

    if active:
        ranges.append(active)

    padded = []
    for r in ranges:
        start = max(Fraction(0), r["speech_start"] - head_pad)
        end = r["speech_end"] + tail_pad

        prev_i = r["first_word"] - 1
        while prev_i >= 0 and not words[prev_i].clean:
            prev_i -= 1
        if prev_i >= 0 and words[prev_i].remove and words[prev_i].reason in SERIOUS_CUT_REASONS:
            start = max(start, words[prev_i].end + MIN_SEPARATION)

        next_i = r["last_word"] + 1
        while next_i < len(words) and not words[next_i].clean:
            next_i += 1
        if next_i < len(words) and words[next_i].remove and words[next_i].reason in SERIOUS_CUT_REASONS:
            end = min(end, max(r["speech_end"], words[next_i].start - MIN_SEPARATION))

        out = dict(r)
        out["start"] = start
        out["end"] = end
        padded.append(out)

    for i in range(1, len(padded)):
        if padded[i - 1]["end"] > padded[i]["start"]:
            midpoint = (padded[i - 1]["speech_end"] + padded[i]["speech_start"]) / 2
            padded[i - 1]["end"] = min(padded[i - 1]["end"], midpoint)
            padded[i]["start"] = max(padded[i]["start"], midpoint)

    return [r for r in padded if r["end"] - r["start"] >= min_range_duration]


# Minimum gap (seconds) kept between a kept range and a seriously-cut neighbor.
MIN_SEPARATION = Fraction(1, 50)

# Common decimal spellings of NTSC-style rates. These are display aliases: the
# rates NLEs actually use are the exact rationals 24000/1001, 30000/1001, etc.
# Any other decimal (e.g. "25.5") is parsed as its exact decimal rational.
FPS_ALIASES = {
    "23.976": Fraction(24000, 1001),
    "23.98": Fraction(24000, 1001),
    "24.975": Fraction(25000, 1001),
    "29.97": Fraction(30000, 1001),
    "47.952": Fraction(48000, 1001),
    "59.94": Fraction(60000, 1001),
    "119.88": Fraction(120000, 1001),
}


def parse_fps(value: str) -> Fraction:
    """Parse a CLI frame rate into an exact Fraction.

    Accepts integers ("25"), rational numerator/denominator strings
    ("24000/1001", the form ffprobe reports for r_frame_rate), and decimal
    aliases ("23.976" -> 24000/1001, "29.97" -> 30000/1001).
    """
    text = str(value).strip()
    if text in FPS_ALIASES:
        return FPS_ALIASES[text]
    try:
        fps = Fraction(text)
    except (ValueError, ZeroDivisionError) as exc:
        raise argparse.ArgumentTypeError(f"invalid frame rate: {value!r}") from exc
    if fps <= 0:
        raise argparse.ArgumentTypeError(f"frame rate must be positive: {value!r}")
    return fps


def parse_fraction(value: str) -> Fraction:
    """Parse a CLI numeric argument (seconds) as an exact Fraction."""
    try:
        parsed = Fraction(str(value).strip())
    except (ValueError, ZeroDivisionError) as exc:
        raise argparse.ArgumentTypeError(f"invalid number: {value!r}") from exc
    return parsed


def format_rate_token(fps: Fraction) -> str:
    """Rate token used in FCPXML format names (e.g. FFVideoFormat1080p2398)."""
    tokens = {
        Fraction(24000, 1001): "2398",
        Fraction(30000, 1001): "2997",
        Fraction(60000, 1001): "5994",
        Fraction(120000, 1001): "11988",
    }
    if fps in tokens:
        return tokens[fps]
    if fps.denominator == 1:
        return str(fps.numerator)
    return f"{fps.numerator}x{fps.denominator}"


def frame_duration_token(fps: Fraction) -> str:
    """FCPXML <format> frameDuration: the exact inverse of the frame rate."""
    inverse = 1 / fps
    return f"{inverse.numerator}/{inverse.denominator}s"


def format_rational_time(frames: int, fps: Fraction) -> str:
    """Render an exact frame count as an FCPXML rational time.

    Integer rates render as "frames/rate s" (e.g. "48/24s"). Non-integer rates
    render as a nested fraction "frames/num/den s" (e.g. "33/30000/1001s"),
    which FCPXML defines as (frames/num)/den seconds — the standard way NTSC
    rates are expressed without rounding to a float.
    """
    frames = max(0, int(frames))
    if fps.denominator == 1:
        return f"{frames}/{fps.numerator}s"
    return f"{frames}/{fps.numerator}/{fps.denominator}s"


def fmt_time(seconds: float | Fraction | int, fps: float | Fraction | int = 24) -> str:
    """Project a duration/position onto the exact frame grid and format it."""
    rate = Fraction(fps)
    frames = round(to_fraction(seconds) * rate)
    return format_rational_time(frames, rate)


def fmt_offset(seconds: float | Fraction | int, fps: Fraction | int) -> str:
    # FCPXML likes rational frame offsets for video timing. The frame rate MUST
    # be forwarded here: offsets live on the timeline's own frame grid, and
    # silently falling back to the 24 fps default was the original bug.
    return fmt_time(seconds, fps)


def fmt_timecode_origin(seconds: Fraction, fps: Fraction) -> str:
    """Render an absolute timecode origin (asset start / sequence tcStart).

    Zero stays the bare "0s" the artifacts always used; nonzero origins render
    on the exact frame grid.
    """
    if seconds == 0:
        return "0s"
    return fmt_time(seconds, fps)


# NDF timecode is a pure frame counter displayed at the nominal integer rate
# (24 for 24000/1001, 30 for 30000/1001). Drop-frame counting only re-labels
# frame numbers to track wall clock at 29.97/59.94; it never drops actual
# frames and is undefined at 24000/1001. Every artifact this script writes is
# frame-count based and declares NDF (FCPXML tcFormat="NDF", EDL "FCM:
# NON-DROP FRAME"), so decomposing with the nominal rate is exact and
# unambiguous at all supported rates. If a broadcast DF deliverable is ever
# needed, that is a localized change to write_edl()'s FCM line and separator
# plus tcFormat — the timeline math does not change.
def nominal_fps(fps: Fraction) -> int:
    return max(1, int(round(fps)))


def seconds_to_ndf_timecode(seconds: Fraction, fps: Fraction) -> str:
    frames = max(0, round(to_fraction(seconds) * fps))
    nominal = nominal_fps(fps)
    hh, frames = divmod(frames, nominal * 3600)
    mm, frames = divmod(frames, nominal * 60)
    ss, ff = divmod(frames, nominal)
    return f"{hh:02d}:{mm:02d}:{ss:02d}:{ff:02d}"


def write_fcpxml(
    path: Path,
    source: Path,
    ranges: list[dict],
    duration: Fraction,
    width: int,
    height: int,
    fps: Fraction,
    audio_channels: int,
    source_start: Fraction = Fraction(0),
    sequence_origin: Fraction = Fraction(0),
) -> None:
    src_uri = source.resolve().as_uri()
    total_timeline = sum((r["end"] - r["start"] for r in ranges), Fraction(0))
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<!DOCTYPE fcpxml>',
        '<fcpxml version="1.10">',
        '  <resources>',
        f'    <format id="r1" name="FFVideoFormat{height}p{format_rate_token(fps)}" frameDuration="{frame_duration_token(fps)}" width="{width}" height="{height}" colorSpace="1-1-1 (Rec. 709)"/>',
        f'    <asset id="r2" name="{html.escape(source.name)}" start="{fmt_timecode_origin(source_start, fps)}" duration="{fmt_time(duration, fps)}" hasVideo="1" hasAudio="1" audioSources="1" audioChannels="{audio_channels}" format="r1">',
        f'      <media-rep kind="original-media" src="{html.escape(src_uri)}"/>',
        "    </asset>",
        "  </resources>",
        '  <library location="file:///Users/jonathanedwards/Movies/">',
        '    <event name="Radio Edit Prototype">',
        f'      <project name="{html.escape(source.stem)} Radio Edit">',
        f'        <sequence format="r1" duration="{fmt_time(total_timeline, fps)}" tcStart="{fmt_timecode_origin(sequence_origin, fps)}" tcFormat="NDF" audioLayout="stereo" audioRate="48k">',
        "          <spine>",
    ]
    timeline_offset = Fraction(0)
    for idx, r in enumerate(ranges, 1):
        dur = r["end"] - r["start"]
        # Asset-clip `start` stays media-elapsed (offset from the first frame
        # of the file); the asset's own `start` attribute above declares the
        # media's timecode origin to the NLE. EDL FROM timecodes carry the
        # source_start explicitly instead. Confirm both behaviors during the
        # real Resolve/Premiere import pass (NAT-2989 step 5).
        lines.append(
            f'            <asset-clip name="cut_{idx:04d}" ref="r2" offset="{fmt_offset(timeline_offset, fps)}" start="{fmt_time(r["start"], fps)}" duration="{fmt_time(dur, fps)}" tcFormat="NDF"/>'
        )
        timeline_offset += dur
    lines += [
        "          </spine>",
        "        </sequence>",
        "      </project>",
        "    </event>",
        "  </library>",
        "</fcpxml>",
        "",
    ]
    path.write_text("\n".join(lines))


def write_edl(
    path: Path,
    source: Path,
    ranges: list[dict],
    fps: Fraction,
    source_start: Fraction = Fraction(0),
    sequence_origin: Fraction = Fraction(0),
) -> None:
    out = ["TITLE: RADIO_EDIT_PROTOTYPE", "FCM: NON-DROP FRAME", ""]
    timeline = Fraction(0)
    reel = re.sub(r"[^A-Z0-9]", "", source.stem.upper())[:8] or "SOURCE"
    for idx, r in enumerate(ranges, 1):
        dur = r["end"] - r["start"]
        # FROM/TO are absolute source timecodes, so a nonzero media TC start
        # shifts them; record timecodes shift by the sequence origin.
        out.append(
            f"{idx:03d}  {reel:<8} V     C        {seconds_to_ndf_timecode(source_start + r['start'], fps)} {seconds_to_ndf_timecode(source_start + r['end'], fps)} {seconds_to_ndf_timecode(sequence_origin + timeline, fps)} {seconds_to_ndf_timecode(sequence_origin + timeline + dur, fps)}"
        )
        out.append(f"* FROM CLIP NAME: {source.name}")
        out.append("")
        timeline += dur
    path.write_text("\n".join(out))


def json_default(value: object) -> object:
    if isinstance(value, Fraction):
        return float(value)
    raise TypeError(f"Object of type {type(value).__name__} is not JSON serializable")


def write_decisions(path: Path, words: list[Word], ranges: list[dict], original_duration: Fraction) -> None:
    removed = [w for w in words if w.remove]
    reason_counts = {}
    for word in removed:
        reason_counts[word.reason] = reason_counts.get(word.reason, 0) + 1
    edited = sum((r["end"] - r["start"] for r in ranges), Fraction(0))
    data = {
        "original_duration_seconds": float(original_duration),
        "edited_duration_seconds": float(edited),
        "reduction_percent": float(round(100 * (1 - edited / original_duration), 2)) if original_duration else 0.0,
        "source_word_count": len(words),
        "removed_word_count": len(removed),
        "kept_word_count": len(words) - len(removed),
        "reason_counts": reason_counts,
        "kept_ranges": ranges,
        "removed_words": [
            {
                "index": w.index,
                "text": w.text,
                "start": float(w.start),
                "end": float(w.end),
                "reason": w.reason,
            }
            for w in removed
        ],
    }
    path.write_text(json.dumps(data, indent=2, default=json_default))


def write_csv(path: Path, ranges: list[dict]) -> None:
    with path.open("w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["cut", "source_start", "source_end", "duration", "first_word", "last_word", "text_preview"])
        for idx, r in enumerate(ranges, 1):
            writer.writerow(
                [
                    idx,
                    f"{float(r['start']):.3f}",
                    f"{float(r['end']):.3f}",
                    f"{float(r['end'] - r['start']):.3f}",
                    r["first_word"],
                    r["last_word"],
                    " ".join(r["text"])[:180],
                ]
            )


# Caption block shaping. Cues break on timeline gaps, sentence-ending words,
# and these caps so blocks stay short and readable in an NLE.
CAPTION_MAX_CHARS = 84
CAPTION_MAX_DURATION = Fraction(5)
CAPTION_GAP_BREAK = Fraction(1)


def build_caption_cues(ranges: list[dict], words: list[Word]) -> list[dict]:
    """Map kept words onto the edited timeline — the one canonical mapping.

    Every range's words are shifted by the same cumulative timeline offsets the
    FCPXML asset-clip offsets use, so captions always match the cut. Words
    removed for light reasons (filler, weak-start, ...) are part of the phrase
    timeline and stay; seriously-cut words are not part of any range.
    """
    cues: list[dict] = []
    current: dict | None = None
    timeline_offset = Fraction(0)

    def flush() -> None:
        nonlocal current
        if current and current["words"]:
            cues.append(current)
        current = None

    for r in ranges:
        range_start = r["start"]
        range_end = r["end"]
        range_dur = range_end - range_start
        for wi in range(int(r["first_word"]), int(r["last_word"]) + 1):
            word = words[wi]
            if not word.clean or (word.remove and word.reason in SERIOUS_CUT_REASONS):
                continue
            # Clamp each word into its range, then slide it to the timeline.
            src_start = min(max(word.start, range_start), range_end)
            src_end = min(max(word.end, range_start), range_end)
            tl_start = timeline_offset + (src_start - range_start)
            tl_end = timeline_offset + (src_end - range_start)
            if current and (
                tl_start - current["end"] > CAPTION_GAP_BREAK
                or tl_end - current["start"] > CAPTION_MAX_DURATION
                or len(" ".join(current["words"])) + 1 + len(word.text) > CAPTION_MAX_CHARS
                or current["words"][-1].endswith((".", "!", "?"))
            ):
                flush()
            if current is None:
                current = {"start": tl_start, "end": tl_end, "words": [word.text]}
            else:
                current["start"] = min(current["start"], tl_start)
                current["end"] = max(current["end"], tl_end)
                current["words"].append(word.text)
        timeline_offset += range_dur
    flush()
    return cues


def project_cues_to_frames(cues: list[dict], fps: Fraction) -> list[dict]:
    """Project cue times onto the exact frame grid: start=floor, end=ceil.

    Bounds guarantees after projection: no negative times, end > start (a
    collapsed cue grows to one frame), and cues never overlap (a cue starting
    inside the previous one is pushed to its end).
    """
    projected = []
    prev_end_frame = 0
    for cue in cues:
        start_frame = max(0, math.floor(cue["start"] * fps))
        end_frame = math.ceil(cue["end"] * fps)
        if start_frame < prev_end_frame:
            start_frame = prev_end_frame
        if end_frame <= start_frame:
            end_frame = start_frame + 1
        projected.append({"start_frame": start_frame, "end_frame": end_frame, "text": " ".join(cue["words"])})
        prev_end_frame = end_frame
    return projected


def srt_timestamp(ms: int) -> str:
    hh, rem = divmod(ms, 3_600_000)
    mm, rem = divmod(rem, 60_000)
    ss, mmm = divmod(rem, 1000)
    return f"{hh:02d}:{mm:02d}:{ss:02d},{mmm:03d}"


def frame_to_ms(frame: int, fps: Fraction) -> int:
    # SRT only has millisecond precision, so exact frame boundaries are rounded
    # to the nearest ms (deterministic rational rounding, no float math).
    return max(0, round(Fraction(frame) / fps * 1000))


def write_srt(path: Path, ranges: list[dict], words: list[Word], fps: Fraction) -> None:
    cues = project_cues_to_frames(build_caption_cues(ranges, words), fps)
    blocks = []
    for idx, cue in enumerate(cues, 1):
        start_ms = frame_to_ms(cue["start_frame"], fps)
        end_ms = frame_to_ms(cue["end_frame"], fps)
        if end_ms <= start_ms:
            end_ms = start_ms + 1
        blocks.append(f"{idx}\n{srt_timestamp(start_ms)} --> {srt_timestamp(end_ms)}\n{cue['text']}\n")
    path.write_text("\n".join(blocks))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--transcript", required=True, type=Path)
    parser.add_argument("--source", required=True, type=Path)
    parser.add_argument("--out-dir", required=True, type=Path)
    parser.add_argument(
        "--fps",
        type=parse_fps,
        default=Fraction(24),
        help="frame rate: integer (25), exact rational (24000/1001), or decimal alias (23.976, 29.97)",
    )
    parser.add_argument("--width", type=int, default=1920)
    parser.add_argument("--height", type=int, default=1080)
    parser.add_argument("--audio-channels", type=int, default=1)
    parser.add_argument("--duration", type=parse_fraction, required=True)
    parser.add_argument("--pad", type=parse_fraction, default=Fraction(35, 1000))
    parser.add_argument("--merge-gap", type=parse_fraction, default=Fraction(18, 100))
    parser.add_argument("--mode", choices=["word", "phrase"], default="phrase")
    parser.add_argument("--head-pad", type=parse_fraction, default=Fraction(22, 100))
    parser.add_argument("--tail-pad", type=parse_fraction, default=Fraction(38, 100))
    parser.add_argument("--keep-pause", type=parse_fraction, default=Fraction(115, 100))
    parser.add_argument("--min-range-duration", type=parse_fraction, default=Fraction(45, 100))
    parser.add_argument(
        "--source-start",
        type=parse_fraction,
        default=Fraction(0),
        help="source media timecode origin in seconds (e.g. 3600 for 01:00:00:00)",
    )
    parser.add_argument(
        "--sequence-origin",
        type=parse_fraction,
        default=Fraction(0),
        help="edited sequence timecode origin in seconds",
    )
    parser.add_argument("--suffix", default="_radio_edit_v2")
    parser.add_argument("--extra-cuts", type=Path)
    parser.add_argument("--extra-cut-confidence", choices=["medium", "high"], default="high")
    parser.add_argument("--keep-segments", type=Path)
    parser.add_argument("--keep-key", default="keep_clean")
    args = parser.parse_args()

    args.out_dir.mkdir(parents=True, exist_ok=True)
    words = load_words(args.transcript)
    mark_word_level_removals(words)
    segments = segment_words(words)
    mark_segment_removals(words, segments)
    apply_extra_cuts(words, args.extra_cuts, args.extra_cut_confidence)
    apply_keep_segments(words, segments, args.keep_segments, args.keep_key)
    if args.mode == "word":
        ranges = kept_ranges(words, args.pad, args.merge_gap)
    else:
        ranges = phrase_kept_ranges(
            words,
            args.head_pad,
            args.tail_pad,
            args.keep_pause,
            args.min_range_duration,
        )

    base = args.source.stem
    fcpxml = args.out_dir / f"{base}{args.suffix}.fcpxml"
    edl = args.out_dir / f"{base}{args.suffix}.edl"
    decisions = args.out_dir / f"{base}{args.suffix}_decisions.json"
    csv_path = args.out_dir / f"{base}{args.suffix}_cuts.csv"
    srt = args.out_dir / f"{base}{args.suffix}_captions.srt"

    write_fcpxml(
        fcpxml,
        args.source,
        ranges,
        args.duration,
        args.width,
        args.height,
        args.fps,
        args.audio_channels,
        args.source_start,
        args.sequence_origin,
    )
    write_edl(edl, args.source, ranges, args.fps, args.source_start, args.sequence_origin)
    write_decisions(decisions, words, ranges, args.duration)
    write_csv(csv_path, ranges)
    write_srt(srt, ranges, words, args.fps)

    edited = sum((r["end"] - r["start"] for r in ranges), Fraction(0))
    print(
        json.dumps(
            {
                "fcpxml": str(fcpxml),
                "edl": str(edl),
                "decisions": str(decisions),
                "csv": str(csv_path),
                "srt": str(srt),
                "cuts": len(ranges),
                "mode": args.mode,
                "fps": f"{args.fps.numerator}/{args.fps.denominator}" if args.fps.denominator != 1 else args.fps.numerator,
                "original_duration_seconds": float(args.duration),
                "edited_duration_seconds": float(edited),
                "reduction_percent": float(round(100 * (1 - edited / args.duration), 2)) if args.duration else 0.0,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
