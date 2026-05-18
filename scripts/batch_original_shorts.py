#!/usr/bin/env python3
"""
Batch-generate raw-source 9x16 editorial shorts for the ForFuckingRealTho media set.

This script is intentionally conservative:
- reads only the original Media folders
- keeps working files under shorts/WORKING
- writes clean, uploadable episode folders under shorts/
- uses word-level AssemblyAI transcripts for transcript-aware cutdowns
"""

from __future__ import annotations

import argparse
import json
import math
import os
import re
import shutil
import subprocess
import sys
import tempfile
import textwrap
import time
import urllib.error
import urllib.request
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any

try:
    from fpdf import FPDF
except Exception:  # pragma: no cover
    FPDF = None


MEDIA_ROOT = Path(
    "/Volumes/Plymouth Post House/CLIENTS/Business 3/Nate Jones Media LLC/"
    "NBJRESOLVE1/ForFuckingRealTho/Media"
)
SHORTS_ROOT = Path(
    "/Volumes/Plymouth Post House/CLIENTS/Business 3/Nate Jones Media LLC/"
    "NBJRESOLVE1/ForFuckingRealTho/shorts"
)

VIDEO_EXTS = {".mp4", ".mov", ".m4v", ".MP4", ".MOV", ".M4V"}
BAD_PATH_PATTERNS = [
    "proxy",
    "screen recording",
    "screen recordings",
    "assets",
    "qc",
    "stills",
    "composite",
    "trimmed",
    "ss_audio",
    "_podcast",
    "_preview",
    "promo",
    "cta",
    "insert",
]
DISCOURSE_STARTERS = {
    "so",
    "and",
    "but",
    "because",
    "then",
    "now",
    "well",
    "like",
    "this",
    "that",
    "these",
    "those",
    "it",
    "they",
    "he",
    "she",
    "we",
    "you",
}
WEAK_ENDINGS = {
    "and",
    "but",
    "or",
    "so",
    "because",
    "when",
    "while",
    "if",
    "to",
    "of",
    "for",
    "with",
    "the",
    "a",
    "an",
}
STOPWORDS = {
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "so",
    "this",
    "that",
    "these",
    "those",
    "is",
    "are",
    "was",
    "were",
    "to",
    "of",
    "in",
    "for",
    "on",
    "with",
    "you",
    "your",
    "they",
    "their",
    "we",
    "our",
    "its",
    "it's",
    "i",
    "me",
    "my",
}


@dataclass
class Sentence:
    index: int
    start: float
    end: float
    text: str
    word_count: int


@dataclass
class Segment:
    sentence_index: int
    start: float
    end: float
    text: str


@dataclass
class ShortPlan:
    number: int
    title: str
    slug: str
    duration: float
    hook: str
    payoff: str
    rationale: str
    segments: list[Segment]
    output: str


def run(cmd: list[str], check: bool = True, capture: bool = False) -> subprocess.CompletedProcess:
    if cmd and cmd[0] == "ffmpeg" and "-loglevel" not in cmd:
        cmd = ["ffmpeg", "-hide_banner", "-loglevel", "error", *cmd[1:]]
    if cmd and cmd[0] == "ffprobe" and "-hide_banner" not in cmd:
        cmd = ["ffprobe", "-hide_banner", *cmd[1:]]
    return subprocess.run(
        cmd,
        check=check,
        text=True,
        stdout=subprocess.PIPE if capture else None,
        stderr=subprocess.PIPE if capture else None,
    )


def ffprobe_json(path: Path) -> dict[str, Any]:
    proc = run(
        [
            "ffprobe",
            "-v",
            "error",
            "-print_format",
            "json",
            "-show_format",
            "-show_streams",
            str(path),
        ],
        capture=True,
    )
    return json.loads(proc.stdout)


def duration_of(path: Path) -> float:
    data = ffprobe_json(path)
    return float(data.get("format", {}).get("duration") or 0)


def video_size(path: Path) -> tuple[int, int]:
    data = ffprobe_json(path)
    for stream in data.get("streams", []):
        if stream.get("codec_type") == "video":
            return int(stream.get("width", 0)), int(stream.get("height", 0))
    return 0, 0


def has_audio(path: Path) -> bool:
    data = ffprobe_json(path)
    return any(stream.get("codec_type") == "audio" for stream in data.get("streams", []))


def shell_quote_for_concat(path: Path) -> str:
    return "file '" + str(path).replace("'", "'\\''") + "'\n"


def numbered_media_folders() -> list[Path]:
    folders = []
    for path in MEDIA_ROOT.iterdir():
        if not path.is_dir():
            continue
        match = re.match(r"^(\d{3})", path.name)
        if not match:
            continue
        if match.group(1) == "019":
            continue
        if 1 <= int(match.group(1)) <= 27:
            folders.append(path)
    return sorted(folders, key=lambda p: p.name[:3])


def score_source(path: Path) -> tuple[int, int, str]:
    lower = str(path).lower()
    score = 0
    if "/video/" in lower:
        score += 50
    if path.parent == path.parents[1]:
        score += 35
    if path.suffix == ".mp4" or path.suffix == ".MP4":
        score += 8
    if "raw" in lower:
        score += 12
    if "natejones" in lower or "cfr" in lower:
        score += 10
    if "edit" in lower:
        score -= 18
    try:
        size = path.stat().st_size
    except OSError:
        size = 0
    return (-score, -size, path.name.lower())


def source_candidates(folder: Path) -> list[Path]:
    candidates = []
    for path in folder.rglob("*"):
        if not path.is_file() or path.suffix not in VIDEO_EXTS:
            continue
        lower = str(path.relative_to(folder)).lower()
        if any(pattern in lower for pattern in BAD_PATH_PATTERNS):
            continue
        candidates.append(path)
    candidates = sorted(candidates, key=score_source)

    # If a Video/ folder exists, prefer its files as a matched multi-part source.
    video_dir_files = [p for p in candidates if "/video/" in str(p).lower()]
    if video_dir_files:
        return sorted(video_dir_files, key=lambda p: p.name.lower())

    def looks_like_part_set(paths: list[Path]) -> bool:
        names = " ".join(p.stem.lower() for p in paths)
        if "first half" in names and "second half" in names:
            return True
        numbered_parts = 0
        for p in paths:
            stem = p.stem.lower()
            if re.search(r"(^|[_\-\s])(part\s*)?[1234]($|[_\-\s])", stem):
                numbered_parts += 1
        return numbered_parts >= 2

    # Multiple numbered body-camera files are likely source parts. Otherwise,
    # pick one best source to avoid concatenating duplicate raw/export pairs.
    if len(candidates) > 1:
        direct = [p for p in candidates if p.parent == folder]
        if direct and looks_like_part_set(direct):
            return sorted(direct, key=lambda p: p.name.lower())
    return candidates[:1]


def concat_sources(sources: list[Path], output: Path) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    if len(sources) == 1:
        if output.exists() and output.stat().st_size > 0:
            return
        run(
            [
                "ffmpeg",
                "-y",
                "-i",
                str(sources[0]),
                "-map",
                "0:v:0",
                "-map",
                "0:a:0?",
                "-c",
                "copy",
                str(output),
            ]
        )
        return

    list_path = output.parent / "concat_sources.txt"
    list_path.write_text("".join(shell_quote_for_concat(p) for p in sources), encoding="utf-8")
    if output.exists() and output.stat().st_size > 0:
        return
    proc = run(
        [
            "ffmpeg",
            "-y",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            str(list_path),
            "-map",
            "0:v:0",
            "-map",
            "0:a:0?",
            "-c",
            "copy",
            str(output),
        ],
        check=False,
    )
    if proc.returncode != 0 or not output.exists() or output.stat().st_size == 0:
        run(
            [
                "ffmpeg",
                "-y",
                "-f",
                "concat",
                "-safe",
                "0",
                "-i",
                str(list_path),
                "-map",
                "0:v:0",
                "-map",
                "0:a:0?",
                "-c:v",
                "libx264",
                "-preset",
                "veryfast",
                "-crf",
                "18",
                "-c:a",
                "aac",
                "-b:a",
                "192k",
                str(output),
            ]
        )


def extract_audio(source: Path, audio_path: Path) -> None:
    if audio_path.exists() and audio_path.stat().st_size > 0:
        return
    run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(source),
            "-vn",
            "-ac",
            "1",
            "-ar",
            "44100",
            "-b:a",
            "96k",
            str(audio_path),
        ]
    )


def assembly_request(method: str, url: str, api_key: str, body: dict[str, Any] | None = None) -> dict[str, Any]:
    data = None
    headers = {"authorization": api_key}
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        headers["content-type"] = "application/json"
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    with urllib.request.urlopen(req, timeout=120) as resp:
        return json.loads(resp.read().decode("utf-8"))


def assembly_upload(path: Path, api_key: str) -> str:
    req = urllib.request.Request(
        "https://api.assemblyai.com/v2/upload",
        headers={"authorization": api_key},
        method="POST",
    )
    with path.open("rb") as fh:
        req.data = fh.read()
    with urllib.request.urlopen(req, timeout=600) as resp:
        return json.loads(resp.read().decode("utf-8"))["upload_url"]


def transcribe(audio_path: Path, transcript_path: Path, api_key: str) -> dict[str, Any]:
    if transcript_path.exists() and transcript_path.stat().st_size > 0:
        return json.loads(transcript_path.read_text(encoding="utf-8"))

    upload_url = assembly_upload(audio_path, api_key)
    job = assembly_request(
        "POST",
        "https://api.assemblyai.com/v2/transcript",
        api_key,
        {
            "audio_url": upload_url,
            "auto_chapters": True,
            "speech_models": ["universal-3-pro", "universal-2"],
            "punctuate": True,
            "format_text": True,
        },
    )
    transcript_id = job["id"]
    print(f"AssemblyAI transcript job: {transcript_id}", flush=True)
    while True:
        result = assembly_request(
            "GET", f"https://api.assemblyai.com/v2/transcript/{transcript_id}", api_key
        )
        status = result.get("status")
        if status == "completed":
            transcript_path.write_text(json.dumps(result, indent=2), encoding="utf-8")
            return result
        if status == "error":
            raise RuntimeError(result.get("error", "AssemblyAI transcription failed"))
        print(f"  transcription status: {status}", flush=True)
        time.sleep(20)


def words_to_sentences(words: list[dict[str, Any]]) -> list[Sentence]:
    sentences: list[Sentence] = []
    current: list[dict[str, Any]] = []
    for word in words:
        text = str(word.get("text") or "").strip()
        if not text:
            continue
        current.append(word)
        if re.search(r"[.!?]$|[.!?][\"']$", text) and len(current) >= 3:
            sentences.append(make_sentence(len(sentences), current))
            current = []
    if current:
        sentences.append(make_sentence(len(sentences), current))
    return sentences


def make_sentence(index: int, words: list[dict[str, Any]]) -> Sentence:
    text = " ".join(str(w.get("text", "")).strip() for w in words).strip()
    text = re.sub(r"\s+", " ", text)
    return Sentence(
        index=index,
        start=float(words[0]["start"]) / 1000.0,
        end=float(words[-1]["end"]) / 1000.0,
        text=text,
        word_count=len(words),
    )


def first_word(text: str) -> str:
    match = re.search(r"[A-Za-z0-9']+", text)
    return match.group(0).lower() if match else ""


def last_word(text: str) -> str:
    matches = re.findall(r"[A-Za-z0-9']+", text)
    return matches[-1].lower() if matches else ""


def clean_sentence_text(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def good_start(sentence: Sentence) -> bool:
    word = first_word(sentence.text)
    if word in DISCOURSE_STARTERS:
        return False
    if sentence.word_count < 5:
        return False
    return True


def good_end(sentence: Sentence) -> bool:
    word = last_word(sentence.text)
    if word in WEAK_ENDINGS:
        return False
    return bool(re.search(r"[.!?]$", sentence.text.strip()))


def interesting_score(text: str) -> int:
    lower = text.lower()
    score = 0
    for term in [
        "agent",
        "ai",
        "model",
        "tool",
        "work",
        "company",
        "product",
        "value",
        "trust",
        "build",
        "change",
        "system",
        "why",
        "because",
        "actually",
        "means",
        "matters",
    ]:
        if term in lower:
            score += 1
    if "?" in text:
        score += 2
    return score


def slugify(text: str, fallback: str) -> str:
    words = re.findall(r"[A-Za-z0-9']+", text.lower())
    useful = [w.replace("'", "") for w in words if w not in STOPWORDS]
    slug = "_".join(useful[:7]) or fallback
    slug = re.sub(r"[^a-z0-9_]+", "_", slug).strip("_")
    return slug[:72] or fallback


def title_from_text(text: str) -> str:
    words = re.findall(r"[A-Za-z0-9']+", text)
    useful = [w for w in words if w.lower() not in STOPWORDS]
    return " ".join(useful[:8]).title() or "Short Clip"


def merge_segments(sentences: list[Sentence]) -> list[Segment]:
    raw = [
        Segment(
            sentence_index=s.index,
            start=max(0.0, s.start - 0.08),
            end=s.end + 0.14,
            text=s.text,
        )
        for s in sentences
    ]
    if not raw:
        return []
    merged: list[Segment] = []
    current = raw[0]
    for seg in raw[1:]:
        if seg.start - current.end <= 0.65:
            current = Segment(
                sentence_index=current.sentence_index,
                start=current.start,
                end=max(current.end, seg.end),
                text=current.text + " " + seg.text,
            )
        else:
            merged.append(current)
            current = seg
    merged.append(current)
    return merged


def plan_shorts(sentences: list[Sentence], episode_num: str) -> list[ShortPlan]:
    usable = [s for s in sentences if s.word_count >= 4 and s.end > s.start]
    if not usable:
        return []
    total_duration = usable[-1].end
    windows = []
    if total_duration <= 1:
        windows = [(0, len(usable))]
    else:
        for i in range(5):
            ws = (total_duration * i) / 5
            we = (total_duration * (i + 1)) / 5
            start_idx = next((j for j, s in enumerate(usable) if s.start >= ws), 0)
            end_idx = next((j for j, s in enumerate(usable) if s.start >= we), len(usable))
            windows.append((start_idx, max(start_idx + 1, end_idx)))

    used: set[int] = set()
    plans: list[ShortPlan] = []

    for window_index, (w_start, w_end) in enumerate(windows, start=1):
        candidates = []
        for idx in range(w_start, min(w_end, len(usable))):
            s = usable[idx]
            if s.index in used or not good_start(s):
                continue
            candidates.append((interesting_score(s.text), -abs((s.end - s.start) - 8), idx))
        candidates.sort(reverse=True)

        selected_block: list[Sentence] | None = None
        for _, _, start_idx in candidates[:12]:
            block: list[Sentence] = []
            duration = 0.0
            for s in usable[start_idx:]:
                if s.index in used:
                    break
                if block and s.start - block[-1].end > 18:
                    break
                block.append(s)
                duration = sum(x.end - x.start for x in block)
                if duration >= 42 and good_end(block[-1]):
                    break
                if duration >= 108:
                    break
            if not block:
                continue
            if sum(x.end - x.start for x in block) < 24:
                continue
            while block and not good_end(block[-1]):
                block.pop()
            if not block:
                continue
            speech_duration = sum(x.end - x.start for x in block)
            if 24 <= speech_duration <= 115:
                selected_block = block
                break

        if selected_block is None:
            # Window fallback: find the next clean 30-80s paragraph-like run.
            for idx in range(w_start, min(w_end, len(usable))):
                if usable[idx].index in used or not good_start(usable[idx]):
                    continue
                block = []
                for s in usable[idx : min(idx + 18, len(usable))]:
                    if s.index in used:
                        break
                    block.append(s)
                    speech_duration = sum(x.end - x.start for x in block)
                    if speech_duration >= 30 and good_end(block[-1]):
                        selected_block = block
                        break
                    if speech_duration > 100:
                        break
                if selected_block:
                    break

        if not selected_block:
            continue

        for s in selected_block:
            used.add(s.index)
        merged = merge_segments(selected_block)
        rendered_duration = sum(seg.end - seg.start for seg in merged)
        hook = clean_sentence_text(selected_block[0].text)
        payoff = clean_sentence_text(selected_block[-1].text)
        title = title_from_text(hook)
        number = len(plans) + 1
        slug = slugify(hook, f"{episode_num}_short_{number:02d}")
        plans.append(
            ShortPlan(
                number=number,
                title=title,
                slug=slug,
                duration=rendered_duration,
                hook=hook,
                payoff=payoff,
                rationale=(
                    "Chosen as a self-contained thought with a clear opening line, "
                    "a contained explanation, and a complete end beat."
                ),
                segments=merged,
                output=f"{number:02d}_{slug}.mp4",
            )
        )
        if len(plans) == 5:
            break

    # If sparse windows produced fewer than five, continue globally without reusing spans.
    idx = 0
    while len(plans) < 5 and idx < len(usable):
        if usable[idx].index in used or not good_start(usable[idx]):
            idx += 1
            continue
        block = []
        for s in usable[idx:]:
            if s.index in used:
                break
            block.append(s)
            speech_duration = sum(x.end - x.start for x in block)
            if speech_duration >= 35 and good_end(block[-1]):
                break
            if speech_duration > 105:
                break
        if block and sum(x.end - x.start for x in block) >= 24 and good_end(block[-1]):
            for s in block:
                used.add(s.index)
            merged = merge_segments(block)
            number = len(plans) + 1
            hook = clean_sentence_text(block[0].text)
            payoff = clean_sentence_text(block[-1].text)
            plans.append(
                ShortPlan(
                    number=number,
                    title=title_from_text(hook),
                    slug=slugify(hook, f"{episode_num}_short_{number:02d}"),
                    duration=sum(seg.end - seg.start for seg in merged),
                    hook=hook,
                    payoff=payoff,
                    rationale="Global fallback candidate with non-overlapping source spans.",
                    segments=merged,
                    output=f"{number:02d}_{slugify(hook, f'{episode_num}_short_{number:02d}')}.mp4",
                )
            )
        idx += max(1, len(block))

    return plans[:5]


def render_short(source: Path, plan: ShortPlan, output: Path) -> None:
    if output.exists() and output.stat().st_size > 0:
        return
    filters = []
    labels = []
    for i, seg in enumerate(plan.segments):
        filters.append(
            f"[0:v]trim=start={seg.start:.3f}:end={seg.end:.3f},setpts=PTS-STARTPTS,"
            f"crop=ih*9/16:ih:(iw-ih*9/16)/2:0,scale=1080:1920,setsar=1[v{i}]"
        )
        filters.append(
            f"[0:a]atrim=start={seg.start:.3f}:end={seg.end:.3f},asetpts=PTS-STARTPTS[a{i}]"
        )
        labels.append(f"[v{i}][a{i}]")
    filters.append("".join(labels) + f"concat=n={len(plan.segments)}:v=1:a=1[v][a]")
    run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(source),
            "-filter_complex",
            ";".join(filters),
            "-map",
            "[v]",
            "-map",
            "[a]",
            "-c:v",
            "libx264",
            "-preset",
            "veryfast",
            "-crf",
            "20",
            "-c:a",
            "aac",
            "-b:a",
            "160k",
            "-movflags",
            "+faststart",
            "-pix_fmt",
            "yuv420p",
            str(output),
        ]
    )


def qc_short(path: Path, working_qc: Path) -> dict[str, Any]:
    working_qc.mkdir(parents=True, exist_ok=True)
    width, height = video_size(path)
    dur = duration_of(path)
    audio = has_audio(path)
    stem = path.stem
    still = working_qc / f"{stem}_middle.jpg"
    if not still.exists():
        run(["ffmpeg", "-y", "-ss", f"{max(0.1, dur / 2):.2f}", "-i", str(path), "-frames:v", "1", str(still)])
    first_audio = working_qc / f"{stem}_first3s.mp3"
    last_audio = working_qc / f"{stem}_last3s.mp3"
    if not first_audio.exists():
        run(["ffmpeg", "-y", "-t", "3", "-i", str(path), "-vn", "-b:a", "96k", str(first_audio)])
    if not last_audio.exists():
        run(["ffmpeg", "-y", "-ss", f"{max(0, dur - 3):.2f}", "-i", str(path), "-t", "3", "-vn", "-b:a", "96k", str(last_audio)])
    return {
        "file": path.name,
        "duration": round(dur, 2),
        "width": width,
        "height": height,
        "audio": audio,
        "under_2_minutes": dur < 120,
        "qc_middle_still": str(still),
        "qc_first_audio": str(first_audio),
        "qc_last_audio": str(last_audio),
    }


def transcript_markdown(transcript: dict[str, Any], episode_name: str) -> str:
    lines = [f"# Transcript - {episode_name}", ""]
    chapters = transcript.get("chapters") or []
    if chapters:
        lines.extend(["## Chapters", ""])
        for chapter in chapters:
            start = float(chapter.get("start", 0)) / 1000
            lines.append(f"- {format_time(start)} - {chapter.get('headline') or chapter.get('gist') or 'Chapter'}")
        lines.append("")
    lines.extend(["## Full Transcript", "", transcript.get("text") or ""])
    lines.append("")
    return "\n".join(lines)


def format_time(seconds: float) -> str:
    seconds = max(0, int(round(seconds)))
    return f"{seconds // 60:02d}:{seconds % 60:02d}"


def write_episode_manifest(
    episode_dir: Path,
    folder: Path,
    sources: list[Path],
    plans: list[ShortPlan],
    qc: list[dict[str, Any]],
    skipped_reason: str | None = None,
) -> None:
    lines = [f"# {folder.name} Shorts Manifest", ""]
    lines.append(f"Source folder: `{folder}`")
    if sources:
        lines.append("Source media:")
        for src in sources:
            lines.append(f"- `{src}`")
    if skipped_reason:
        lines.extend(["", f"Status: SKIPPED - {skipped_reason}", ""])
    else:
        lines.extend(["", "Format: 1080x1920 full 9x16 punch-in from original source media, no padding.", ""])
        for plan, check in zip(plans, qc):
            lines.extend(
                [
                    f"## {plan.number:02d}. {plan.title}",
                    "",
                    f"File: `{plan.output}`",
                    f"Duration: {check['duration']}s",
                    f"Hook: {plan.hook}",
                    f"Payoff: {plan.payoff}",
                    f"Why this clip: {plan.rationale}",
                    "Source ranges:",
                ]
            )
            for seg in plan.segments:
                lines.append(f"- {format_time(seg.start)}-{format_time(seg.end)}: {seg.text[:180]}")
            lines.append("")
    (episode_dir / "README_MANIFEST.md").write_text("\n".join(lines), encoding="utf-8")


def write_master_manifest(records: list[dict[str, Any]], output: Path) -> None:
    lines = ["# ForFuckingRealTho Original-Source Shorts Manifest", ""]
    lines.append("Batch rules: original Media folders only, 019 excluded, clean episode folders only, WORKING files separated.")
    lines.append("")
    total = sum(len(r.get("shorts", [])) for r in records)
    skipped = [r for r in records if r.get("status") == "skipped"]
    lines.append(f"Total shorts rendered: {total}")
    lines.append(f"Episodes skipped/flagged: {len(skipped)}")
    lines.append("")
    for record in records:
        lines.append(f"## {record['episode']}")
        lines.append("")
        if record.get("status") == "skipped":
            lines.append(f"Status: SKIPPED - {record.get('reason')}")
            lines.append("")
            continue
        lines.append(f"Clean folder: `{record['deliverables_dir']}`")
        lines.append(f"Source: `{record['source_joined']}`")
        lines.append("")
        for short in record.get("shorts", []):
            lines.append(f"### {short['number']:02d}. {short['title']}")
            lines.append(f"- File: `{short['file']}`")
            lines.append(f"- Duration: {short['duration']}s")
            lines.append(f"- Hook: {short['hook']}")
            lines.append(f"- Payoff: {short['payoff']}")
            lines.append("")
    output.write_text("\n".join(lines), encoding="utf-8")


def pdf_safe(text: str) -> str:
    text = text.replace("`", "")
    text = text.replace("\u2019", "'").replace("\u2018", "'").replace("\u201c", '"').replace("\u201d", '"')
    text = text.replace("\u2013", "-").replace("\u2014", "-")
    return text.encode("latin-1", "replace").decode("latin-1")


def write_pdf_from_markdown(md_path: Path, pdf_path: Path) -> None:
    if FPDF is None:
        raise RuntimeError("fpdf is not installed")
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_font("Helvetica", size=9)
    for raw_line in md_path.read_text(encoding="utf-8").splitlines():
        line = pdf_safe(raw_line).replace("`", "")
        font_size = 9
        style = ""
        leading = 4.5
        if line.startswith("# "):
            line = line[2:]
            font_size = 14
            style = "B"
            leading = 7
        elif line.startswith("## "):
            line = line[3:]
            font_size = 12
            style = "B"
            leading = 6
        elif line.startswith("### "):
            line = line[4:]
            font_size = 10
            style = "B"
            leading = 5
        pdf.set_font("Helvetica", style, font_size)
        wrapped = textwrap.wrap(
            line,
            width=96 if font_size <= 9 else 76,
            break_long_words=True,
            break_on_hyphens=True,
        ) or [""]
        for chunk in wrapped:
            if pdf.get_y() > 275:
                pdf.add_page()
                pdf.set_font("Helvetica", style, font_size)
            pdf.set_x(10)
            pdf.cell(0, leading, chunk[:160], new_x="LMARGIN", new_y="NEXT")
        if style == "B":
            pdf.ln(1)
    pdf.output(str(pdf_path))


def process_episode(folder: Path, api_key: str, force: bool = False) -> dict[str, Any]:
    episode_num = folder.name[:3]
    clean_dir = SHORTS_ROOT / folder.name
    working_dir = SHORTS_ROOT / "WORKING" / folder.name
    clean_dir.mkdir(parents=True, exist_ok=True)
    working_dir.mkdir(parents=True, exist_ok=True)

    sources = source_candidates(folder)
    if not sources:
        reason = "No usable original source media found after filtering composites/proxies/assets."
        write_episode_manifest(clean_dir, folder, [], [], [], reason)
        return {"episode": folder.name, "status": "skipped", "reason": reason, "deliverables_dir": str(clean_dir)}

    raw_dir = working_dir / "raw"
    raw_dir.mkdir(parents=True, exist_ok=True)
    joined = raw_dir / f"{folder.name}_raw_joined.mp4"
    audio = raw_dir / f"{folder.name}_raw_audio.mp3"
    transcript_path = working_dir / "raw_source_transcript.json"
    transcript_md = working_dir / "raw_source_transcript.md"
    edl_json = working_dir / "editorial_edl.json"
    edl_md = working_dir / "editorial_edl.md"
    qc_dir = working_dir / "qc"

    print(f"\n=== {folder.name} ===", flush=True)
    print("Sources:", ", ".join(p.name for p in sources), flush=True)
    if len(sources) == 1:
        joined_source = sources[0]
    else:
        concat_sources(sources, joined)
        joined_source = joined
    extract_audio(joined_source, audio)
    transcript = transcribe(audio, transcript_path, api_key)
    transcript_md.write_text(transcript_markdown(transcript, folder.name), encoding="utf-8")
    words = transcript.get("words") or []
    sentences = words_to_sentences(words)
    plans = plan_shorts(sentences, episode_num)
    edl_json.write_text(json.dumps([asdict(p) for p in plans], indent=2), encoding="utf-8")
    edl_lines = [f"# Editorial EDL - {folder.name}", ""]
    for plan in plans:
        edl_lines.append(f"## {plan.number:02d}. {plan.title}")
        edl_lines.append(f"Hook: {plan.hook}")
        edl_lines.append(f"Payoff: {plan.payoff}")
        for seg in plan.segments:
            edl_lines.append(f"- {format_time(seg.start)}-{format_time(seg.end)}: {seg.text}")
        edl_lines.append("")
    edl_md.write_text("\n".join(edl_lines), encoding="utf-8")

    qc_results = []
    for plan in plans:
        out_path = clean_dir / plan.output
        print(f"Rendering {out_path.name}", flush=True)
        render_short(joined_source, plan, out_path)
        qc_results.append(qc_short(out_path, qc_dir))

    write_episode_manifest(clean_dir, folder, sources, plans, qc_results)
    return {
        "episode": folder.name,
        "status": "complete",
        "deliverables_dir": str(clean_dir),
        "working_dir": str(working_dir),
        "source_joined": str(joined_source),
        "sources": [str(p) for p in sources],
        "shorts": [
            {
                "number": p.number,
                "title": p.title,
                "file": p.output,
                "duration": qc_results[i]["duration"] if i < len(qc_results) else round(p.duration, 2),
                "hook": p.hook,
                "payoff": p.payoff,
            }
            for i, p in enumerate(plans)
        ],
        "qc": qc_results,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--episodes", nargs="*", help="Episode prefixes to process, e.g. 001 002")
    parser.add_argument("--triage", action="store_true", help="List source choices without rendering")
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    api_key = os.environ.get("ASSEMBLYAI_API_KEY")
    if not api_key and not args.triage:
        print("ASSEMBLYAI_API_KEY is missing", file=sys.stderr)
        return 2

    SHORTS_ROOT.mkdir(parents=True, exist_ok=True)
    (SHORTS_ROOT / "WORKING").mkdir(parents=True, exist_ok=True)
    folders = numbered_media_folders()
    if args.episodes:
        wanted = {e.zfill(3) for e in args.episodes}
        folders = [f for f in folders if f.name[:3] in wanted]

    if args.triage:
        for folder in folders:
            sources = source_candidates(folder)
            print(f"{folder.name}:")
            if not sources:
                print("  SKIP: no usable source")
            for src in sources:
                print(f"  {src}")
        return 0

    records: list[dict[str, Any]] = []
    state_path = SHORTS_ROOT / "WORKING" / "batch_state.json"
    if state_path.exists():
        try:
            records = json.loads(state_path.read_text(encoding="utf-8"))
        except Exception:
            records = []
    existing = {r.get("episode"): r for r in records}

    for folder in folders:
        if not args.force and existing.get(folder.name, {}).get("status") == "complete":
            print(f"Skipping already complete episode {folder.name}", flush=True)
            continue
        record = process_episode(folder, api_key or "", args.force)
        existing[folder.name] = record
        records = [existing[name] for name in sorted(existing) if isinstance(existing.get(name), dict)]
        state_path.write_text(json.dumps(records, indent=2), encoding="utf-8")
        write_master_manifest(records, SHORTS_ROOT / "MASTER_SHORTS_MANIFEST.md")
        write_pdf_from_markdown(SHORTS_ROOT / "MASTER_SHORTS_MANIFEST.md", SHORTS_ROOT / "MASTER_SHORTS_MANIFEST.pdf")

    write_master_manifest(records, SHORTS_ROOT / "MASTER_SHORTS_MANIFEST.md")
    write_pdf_from_markdown(SHORTS_ROOT / "MASTER_SHORTS_MANIFEST.md", SHORTS_ROOT / "MASTER_SHORTS_MANIFEST.pdf")
    print(f"\nDone. Master manifest: {SHORTS_ROOT / 'MASTER_SHORTS_MANIFEST.md'}", flush=True)
    print(f"PDF manifest: {SHORTS_ROOT / 'MASTER_SHORTS_MANIFEST.pdf'}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
