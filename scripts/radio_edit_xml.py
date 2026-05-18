#!/usr/bin/env python3
"""Create a transcript-driven radio-edit FCPXML from AssemblyAI word timings."""

from __future__ import annotations

import argparse
import csv
import html
import json
import math
import re
from collections import Counter
from dataclasses import dataclass
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
    start: float
    end: float
    remove: bool = False
    reason: str = ""


@dataclass
class Segment:
    start_i: int
    end_i: int
    start: float
    end: float
    text: str
    norm_tokens: list[str]

    @property
    def duration(self) -> float:
        return self.end - self.start


def clean_token(text: str) -> str:
    return re.sub(r"[^a-z0-9']", "", text.lower()).strip("'")


def load_words(path: Path) -> list[Word]:
    data = json.loads(path.read_text())
    words = []
    for i, raw in enumerate(data.get("words") or []):
        text = raw.get("text") or ""
        start = (raw.get("start") or 0) / 1000
        end = (raw.get("end") or raw.get("start") or 0) / 1000
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
        start = float(cut["start"])
        end = float(cut["end"])
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


def kept_ranges(words: list[Word], pad: float, min_gap: float) -> list[dict]:
    ranges = []
    active = None
    for word in words:
        if word.remove or not word.clean:
            if active:
                ranges.append(active)
                active = None
            continue
        start = max(0.0, word.start - pad)
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
    head_pad: float,
    tail_pad: float,
    keep_pause: float,
    min_range_duration: float,
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
        start = max(0.0, r["speech_start"] - head_pad)
        end = r["speech_end"] + tail_pad

        prev_i = r["first_word"] - 1
        while prev_i >= 0 and not words[prev_i].clean:
            prev_i -= 1
        if prev_i >= 0 and words[prev_i].remove and words[prev_i].reason in SERIOUS_CUT_REASONS:
            start = max(start, words[prev_i].end + 0.02)

        next_i = r["last_word"] + 1
        while next_i < len(words) and not words[next_i].clean:
            next_i += 1
        if next_i < len(words) and words[next_i].remove and words[next_i].reason in SERIOUS_CUT_REASONS:
            end = min(end, max(r["speech_end"], words[next_i].start - 0.02))

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


def fmt_time(seconds: float, fps: int = 24) -> str:
    frames = max(0, round(seconds * fps))
    return f"{frames}/{fps}s"


def fmt_offset(seconds: float) -> str:
    # FCPXML likes rational frame offsets for video timing.
    return fmt_time(seconds)


def write_fcpxml(
    path: Path,
    source: Path,
    ranges: list[dict],
    duration: float,
    width: int,
    height: int,
    fps: int,
    audio_channels: int,
) -> None:
    src_uri = source.resolve().as_uri()
    total_timeline = sum(r["end"] - r["start"] for r in ranges)
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<!DOCTYPE fcpxml>',
        '<fcpxml version="1.10">',
        '  <resources>',
        f'    <format id="r1" name="FFVideoFormat{height}p{fps}" frameDuration="1/{fps}s" width="{width}" height="{height}" colorSpace="1-1-1 (Rec. 709)"/>',
        f'    <asset id="r2" name="{html.escape(source.name)}" start="0s" duration="{fmt_time(duration, fps)}" hasVideo="1" hasAudio="1" audioSources="1" audioChannels="{audio_channels}" format="r1">',
        f'      <media-rep kind="original-media" src="{html.escape(src_uri)}"/>',
        "    </asset>",
        "  </resources>",
        '  <library location="file:///Users/jonathanedwards/Movies/">',
        '    <event name="Radio Edit Prototype">',
        f'      <project name="{html.escape(source.stem)} Radio Edit">',
        f'        <sequence format="r1" duration="{fmt_time(total_timeline, fps)}" tcStart="0s" tcFormat="NDF" audioLayout="stereo" audioRate="48k">',
        "          <spine>",
    ]
    timeline_offset = 0.0
    for idx, r in enumerate(ranges, 1):
        dur = r["end"] - r["start"]
        lines.append(
            f'            <asset-clip name="cut_{idx:04d}" ref="r2" offset="{fmt_offset(timeline_offset)}" start="{fmt_time(r["start"], fps)}" duration="{fmt_time(dur, fps)}" tcFormat="NDF"/>'
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


def write_edl(path: Path, source: Path, ranges: list[dict], fps: int) -> None:
    def tc(seconds: float) -> str:
        frames = round(seconds * fps)
        hh = frames // (fps * 3600)
        frames %= fps * 3600
        mm = frames // (fps * 60)
        frames %= fps * 60
        ss = frames // fps
        ff = frames % fps
        return f"{hh:02d}:{mm:02d}:{ss:02d}:{ff:02d}"

    out = ["TITLE: RADIO_EDIT_PROTOTYPE", "FCM: NON-DROP FRAME", ""]
    timeline = 0.0
    reel = re.sub(r"[^A-Z0-9]", "", source.stem.upper())[:8] or "SOURCE"
    for idx, r in enumerate(ranges, 1):
        dur = r["end"] - r["start"]
        out.append(
            f"{idx:03d}  {reel:<8} V     C        {tc(r['start'])} {tc(r['end'])} {tc(timeline)} {tc(timeline + dur)}"
        )
        out.append(f"* FROM CLIP NAME: {source.name}")
        out.append("")
        timeline += dur
    path.write_text("\n".join(out))


def write_decisions(path: Path, words: list[Word], ranges: list[dict], original_duration: float) -> None:
    removed = [w for w in words if w.remove]
    reason_counts = {}
    for word in removed:
        reason_counts[word.reason] = reason_counts.get(word.reason, 0) + 1
    data = {
        "original_duration_seconds": original_duration,
        "edited_duration_seconds": sum(r["end"] - r["start"] for r in ranges),
        "reduction_percent": round(
            100 * (1 - (sum(r["end"] - r["start"] for r in ranges) / original_duration)), 2
        ),
        "source_word_count": len(words),
        "removed_word_count": len(removed),
        "kept_word_count": len(words) - len(removed),
        "reason_counts": reason_counts,
        "kept_ranges": ranges,
        "removed_words": [
            {
                "index": w.index,
                "text": w.text,
                "start": w.start,
                "end": w.end,
                "reason": w.reason,
            }
            for w in removed
        ],
    }
    path.write_text(json.dumps(data, indent=2))


def write_csv(path: Path, ranges: list[dict]) -> None:
    with path.open("w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["cut", "source_start", "source_end", "duration", "first_word", "last_word", "text_preview"])
        for idx, r in enumerate(ranges, 1):
            writer.writerow(
                [
                    idx,
                    f"{r['start']:.3f}",
                    f"{r['end']:.3f}",
                    f"{r['end'] - r['start']:.3f}",
                    r["first_word"],
                    r["last_word"],
                    " ".join(r["text"])[:180],
                ]
            )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--transcript", required=True, type=Path)
    parser.add_argument("--source", required=True, type=Path)
    parser.add_argument("--out-dir", required=True, type=Path)
    parser.add_argument("--fps", type=int, default=24)
    parser.add_argument("--width", type=int, default=1920)
    parser.add_argument("--height", type=int, default=1080)
    parser.add_argument("--audio-channels", type=int, default=1)
    parser.add_argument("--duration", type=float, required=True)
    parser.add_argument("--pad", type=float, default=0.035)
    parser.add_argument("--merge-gap", type=float, default=0.18)
    parser.add_argument("--mode", choices=["word", "phrase"], default="phrase")
    parser.add_argument("--head-pad", type=float, default=0.22)
    parser.add_argument("--tail-pad", type=float, default=0.38)
    parser.add_argument("--keep-pause", type=float, default=1.15)
    parser.add_argument("--min-range-duration", type=float, default=0.45)
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

    write_fcpxml(
        fcpxml,
        args.source,
        ranges,
        args.duration,
        args.width,
        args.height,
        args.fps,
        args.audio_channels,
    )
    write_edl(edl, args.source, ranges, args.fps)
    write_decisions(decisions, words, ranges, args.duration)
    write_csv(csv_path, ranges)

    print(
        json.dumps(
            {
                "fcpxml": str(fcpxml),
                "edl": str(edl),
                "decisions": str(decisions),
                "csv": str(csv_path),
                "cuts": len(ranges),
                "mode": args.mode,
                "original_duration_seconds": args.duration,
                "edited_duration_seconds": sum(r["end"] - r["start"] for r in ranges),
                "reduction_percent": round(
                    100 * (1 - (sum(r["end"] - r["start"] for r in ranges) / args.duration)), 2
                ),
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
