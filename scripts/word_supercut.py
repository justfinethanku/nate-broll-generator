#!/usr/bin/env python3
"""Create a word-level supercut from existing AssemblyAI transcripts."""

from __future__ import annotations

import argparse
import collections
import json
import re
import subprocess
from dataclasses import dataclass
from pathlib import Path
from typing import Any


PROJECT_ROOT = Path(
    "/Volumes/Plymouth Post House/CLIENTS/Business 3/Nate Jones Media LLC/"
    "NBJRESOLVE1/ForFuckingRealTho"
)
WORKING_ROOT = PROJECT_ROOT / "shorts" / "WORKING"
OUTPUT_ROOT = PROJECT_ROOT / "word_supercuts"

STOPWORDS = {
    "a", "about", "across", "after", "again", "all", "also", "am", "an",
    "and", "any", "anything", "are", "around", "as", "at", "back", "be",
    "because", "been", "before", "being", "between", "but", "by", "can",
    "could", "did", "do", "does", "doing", "don't", "done", "each", "even",
    "every", "everything", "for", "from", "get", "gets", "getting", "go",
    "going", "good", "got", "had", "has", "have", "having", "he", "her",
    "here", "his", "how", "i", "if", "i'm", "in", "into", "is", "it",
    "actually", "build", "building", "built", "it's", "its", "just", "kind", "know", "like", "look", "lot", "make",
    "makes", "making", "many", "may", "me", "mean", "means", "might",
    "mine", "more", "most", "much", "my", "new", "no", "not", "nothing",
    "need", "needed", "needs", "now", "of", "ok", "okay", "old", "on", "one", "or", "other", "our",
    "out", "over", "own", "part", "people", "probably", "really", "right",
    "said", "same", "say", "saying", "says", "see", "seen", "she", "so",
    "some", "something", "sort", "still", "stuff", "than", "that", "that's",
    "the", "their", "them", "then", "there", "there's", "these", "they",
    "they're", "thing", "things", "think", "thinking", "this", "those",
    "real", "should", "thought", "three", "through", "time", "to", "too", "two", "uh", "um",
    "under", "up", "us", "use", "used", "using", "very", "want", "wanted",
    "wants", "was", "way", "ways", "we", "we're", "well", "went", "were",
    "what", "when", "where", "which", "while", "who", "why", "will", "with",
    "first", "work", "worked", "working", "works", "would", "yeah", "yes", "you",
    "you're", "your", "yours",
    # Topic labels that are too obvious for this gag.
    "agent", "agents", "ai", "apple", "chatgpt", "claude", "code", "coding",
    "data", "google", "model", "models", "openai", "software", "system",
    "systems", "tool", "tools",
}


@dataclass(frozen=True)
class Occurrence:
    episode: str
    source: Path
    start: float
    end: float
    text: str


def run(cmd: list[str], *, capture: bool = False) -> subprocess.CompletedProcess:
    if cmd and cmd[0] == "ffmpeg":
        cmd = ["ffmpeg", "-hide_banner", "-loglevel", "error", *cmd[1:]]
    if cmd and cmd[0] == "ffprobe":
        cmd = ["ffprobe", "-hide_banner", *cmd[1:]]
    return subprocess.run(
        cmd,
        check=True,
        text=True,
        stdout=subprocess.PIPE if capture else None,
        stderr=subprocess.PIPE if capture else None,
    )


def normalize_word(text: str) -> str:
    text = text.replace("’", "'").lower()
    return re.sub(r"^[^a-z0-9']+|[^a-z0-9']+$", "", text)


def shell_quote_for_concat(path: Path) -> str:
    return "file '" + str(path).replace("'", "'\\''") + "'\n"


def load_state() -> list[dict[str, Any]]:
    state_path = WORKING_ROOT / "batch_state.json"
    records = json.loads(state_path.read_text(encoding="utf-8"))
    return [record for record in records if record.get("status") == "complete"]


def collect_counts(records: list[dict[str, Any]]) -> tuple[collections.Counter[str], dict[str, list[Occurrence]]]:
    counts: collections.Counter[str] = collections.Counter()
    occurrences: dict[str, list[Occurrence]] = collections.defaultdict(list)
    for record in records:
        episode = record["episode"]
        transcript_path = Path(record["working_dir"]) / "raw_source_transcript.json"
        if not transcript_path.exists():
            continue
        source = Path(record["source_joined"])
        transcript = json.loads(transcript_path.read_text(encoding="utf-8"))
        for word in transcript.get("words", []):
            normalized = normalize_word(word.get("text", ""))
            if len(normalized) < 3 or normalized in STOPWORDS or normalized.isdigit():
                continue
            start = float(word["start"]) / 1000.0
            end = float(word["end"]) / 1000.0
            counts[normalized] += 1
            occurrences[normalized].append(
                Occurrence(
                    episode=episode,
                    source=source,
                    start=start,
                    end=end,
                    text=word.get("text", ""),
                )
            )
    return counts, occurrences


def write_count_report(counts: collections.Counter[str], occurrences: dict[str, list[Occurrence]], out_dir: Path) -> None:
    lines = [
        "# Nate Word Supercut Counts",
        "",
        "Filtered out glue words plus broad topic labels such as AI, agent, model, system, and software.",
        "",
        "| Rank | Word | Count | Episodes |",
        "|---:|---|---:|---:|",
    ]
    for index, (word, count) in enumerate(counts.most_common(50), start=1):
        episode_count = len({occ.episode for occ in occurrences[word]})
        lines.append(f"| {index} | {word} | {count} | {episode_count} |")
    (out_dir / "word_count_report.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def video_filter(aspect: str) -> str:
    if aspect == "16x9":
        return "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1"
    return "crop=ih*9/16:ih:(iw-ih*9/16)/2:0,scale=1080:1920,setsar=1"


def render_word_clip(occurrence: Occurrence, output: Path, aspect: str) -> None:
    pre = 0.045
    post = 0.075
    start = max(0.0, occurrence.start - pre)
    end = occurrence.end + post
    duration = max(0.16, end - start)
    vf = video_filter(aspect)
    fade_out_start = max(0.08, duration - 0.02)
    run(
        [
            "ffmpeg",
            "-y",
            "-ss",
            f"{start:.3f}",
            "-t",
            f"{duration:.3f}",
            "-i",
            str(occurrence.source),
            "-vf",
            vf,
            "-af",
            f"afade=t=in:st=0:d=0.015,afade=t=out:st={fade_out_start:.3f}:d=0.02",
            "-r",
            "30",
            "-c:v",
            "libx264",
            "-preset",
            "veryfast",
            "-crf",
            "23",
            "-pix_fmt",
            "yuv420p",
            "-c:a",
            "aac",
            "-b:a",
            "192k",
            "-ar",
            "48000",
            "-ac",
            "2",
            str(output),
        ]
    )


def render_supercut(word: str, occurrences: list[Occurrence], out_dir: Path, limit: int | None, aspect: str) -> Path:
    clip_dir = out_dir / "clips"
    clip_dir.mkdir(parents=True, exist_ok=True)
    selected = occurrences if limit is None else occurrences[:limit]
    manifest_rows = ["episode,start,end,source_text,clip_file"]
    clip_paths: list[Path] = []
    for index, occurrence in enumerate(selected, start=1):
        clip_path = clip_dir / f"{index:04d}_{word}_{aspect}.mp4"
        render_word_clip(occurrence, clip_path, aspect)
        clip_paths.append(clip_path)
        manifest_rows.append(
            ",".join(
                [
                    json.dumps(occurrence.episode),
                    f"{occurrence.start:.3f}",
                    f"{occurrence.end:.3f}",
                    json.dumps(occurrence.text),
                    json.dumps(str(clip_path)),
                ]
            )
        )
    (out_dir / f"{word}_occurrences.csv").write_text("\n".join(manifest_rows) + "\n", encoding="utf-8")
    concat_path = out_dir / "concat.txt"
    concat_path.write_text("".join(shell_quote_for_concat(path) for path in clip_paths), encoding="utf-8")
    final_path = out_dir / f"nate_says_{word}_supercut_{len(clip_paths)}x_{aspect}.mp4"
    run(
        [
            "ffmpeg",
            "-y",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            str(concat_path),
            "-c",
            "copy",
            str(final_path),
        ]
    )
    return final_path


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--word", help="Specific normalized word to supercut. Defaults to top filtered word.")
    parser.add_argument("--limit", type=int, help="Limit occurrences for a test render.")
    parser.add_argument("--aspect", choices=["9x16", "16x9"], default="9x16")
    args = parser.parse_args()

    records = load_state()
    counts, occurrences = collect_counts(records)
    if not counts:
        raise SystemExit("No countable transcript words found.")

    word = normalize_word(args.word) if args.word else counts.most_common(1)[0][0]
    if word not in occurrences:
        raise SystemExit(f"No occurrences found for {word!r}.")

    out_dir = OUTPUT_ROOT / f"{word}_supercut" / args.aspect
    out_dir.mkdir(parents=True, exist_ok=True)
    write_count_report(counts, occurrences, out_dir)
    final_path = render_supercut(word, occurrences[word], out_dir, args.limit, args.aspect)
    print(f"word={word}")
    print(f"occurrences={len(occurrences[word]) if args.limit is None else min(args.limit, len(occurrences[word]))}")
    print(f"output={final_path}")
    print(f"report={out_dir / 'word_count_report.md'}")


if __name__ == "__main__":
    main()
