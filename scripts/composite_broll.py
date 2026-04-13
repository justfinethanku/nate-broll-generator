#!/usr/bin/env python3
"""
B-Roll Composite Script
========================
Composites b-roll clips onto a source video using FFmpeg -itsoffset.
Parses timecodes from filenames, applies spacing rules, produces versioned output.

Usage:
  python3 composite_broll.py <source_video> <broll_directory> [--version N]

The script:
1. Reads all .mp4 files in the broll directory
2. Parses timecodes from filenames (format: ...-SECONDS.mp4)
3. Enforces spacing rules (20s minimum start, 15s gap between clips)
4. Composites using FFmpeg -itsoffset + chained overlay filters
5. Outputs a versioned composite alongside the source video

Requirements: ffmpeg, ffprobe in PATH
"""

import os
import re
import sys
import json
import subprocess
from pathlib import Path


MIN_START = 20.0   # No b-roll before 20 seconds
MIN_GAP = 15.0     # 15 seconds between clip start times


def get_duration(filepath: str) -> float:
    result = subprocess.run(
        ["ffprobe", "-v", "quiet", "-print_format", "json", "-show_format", filepath],
        capture_output=True, text=True
    )
    return float(json.loads(result.stdout)["format"]["duration"])


def parse_broll_clips(broll_dir: str) -> list[dict]:
    clips = []
    for f in sorted(os.listdir(broll_dir)):
        if not f.endswith(".mp4"):
            continue
        match = re.search(r'-(\d+\.\d+)\.mp4$', f)
        if match:
            start_sec = float(match.group(1))
            filepath = os.path.join(broll_dir, f)
            dur = get_duration(filepath)
            clips.append({
                "file": filepath,
                "start": start_sec,
                "duration": dur,
                "name": f,
            })
    clips.sort(key=lambda c: c["start"])
    return clips


def apply_spacing_rules(clips: list[dict]) -> list[dict]:
    filtered = []
    for c in clips:
        if c["start"] < MIN_START:
            print(f"  SKIP (before {MIN_START}s): {c['name']}")
            continue
        if filtered and (c["start"] - filtered[-1]["start"]) < MIN_GAP:
            gap = c["start"] - filtered[-1]["start"]
            print(f"  SKIP ({gap:.1f}s gap, need {MIN_GAP}s): {c['name']}")
            continue
        filtered.append(c)
    return filtered


def find_next_version(source_video: str) -> int:
    """Find the next available version number."""
    base = source_video.rsplit(".mp4", 1)[0]
    v = 1
    while os.path.exists(f"{base}_composite_v{v}.mp4"):
        v += 1
    return v


def composite(source_video: str, broll_dir: str, version: int = None):
    print(f"Source: {source_video}")
    print(f"B-roll: {broll_dir}")

    clips = parse_broll_clips(broll_dir)
    print(f"\nFound {len(clips)} b-roll clips")

    filtered = apply_spacing_rules(clips)
    print(f"\nUsing {len(filtered)} clips after spacing rules\n")

    if not filtered:
        print("No clips to composite. Done.")
        return

    for c in filtered:
        print(f"  {c['start']:>8.3f}s  {c['name']}")

    # Determine version
    if version is None:
        version = find_next_version(source_video)

    base = source_video.rsplit(".mp4", 1)[0]
    output = f"{base}_composite_v{version}.mp4"

    # Build FFmpeg command with -itsoffset
    cmd = ["ffmpeg", "-y", "-i", source_video]
    for c in filtered:
        cmd += ["-itsoffset", f"{c['start']:.3f}", "-i", c["file"]]

    filter_parts = []
    prev_label = "0:v"
    for i in range(len(filtered)):
        out_label = f"v{i+1}"
        filter_parts.append(
            f"[{prev_label}][{i+1}:v]overlay=eof_action=pass[{out_label}]"
        )
        prev_label = out_label

    cmd += [
        "-filter_complex", ";".join(filter_parts),
        "-map", f"[{prev_label}]",
        "-map", "0:a",
        "-codec:v", "libx264",
        "-crf", "18",
        "-preset", "medium",
        "-codec:a", "copy",
        output,
    ]

    print(f"\nRendering → {os.path.basename(output)}")
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=3600)

    if result.returncode == 0:
        size_mb = os.path.getsize(output) / (1024 * 1024)
        print(f"SUCCESS! {size_mb:.1f} MB")
        print(f"Output: {output}")
        return output
    else:
        print(f"FAILED (exit code {result.returncode})")
        print(result.stderr[-2000:])
        return None


def add_chyron(composite_path: str, chyron_path: str, suffix: str):
    """Overlay a ProRes 4444 alpha chyron onto the composite."""
    video_duration = get_duration(composite_path)
    output = composite_path.replace(".mp4", f"_{suffix}.mp4")

    cmd = [
        "ffmpeg", "-y",
        "-i", composite_path,
        "-t", str(video_duration),
        "-i", chyron_path,
        "-filter_complex", "[0:v][1:v]overlay=eof_action=pass[outv]",
        "-map", "[outv]",
        "-map", "0:a",
        "-codec:v", "libx264", "-crf", "18", "-preset", "medium",
        "-codec:a", "copy",
        output,
    ]

    print(f"Adding {suffix} chyron → {os.path.basename(output)}")
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=3600)

    if result.returncode == 0:
        size_mb = os.path.getsize(output) / (1024 * 1024)
        print(f"  SUCCESS! {size_mb:.1f} MB")
        return output
    else:
        print(f"  FAILED (exit code {result.returncode})")
        print(result.stderr[-2000:])
        return None


# --- Chyron paths ---
BROLL_HOME = os.environ.get("BROLL_HOME", os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CHYRON_DIR = os.path.join(BROLL_HOME, "assets")
YT_CHYRON = os.path.join(CHYRON_DIR, "Youtube Chyron.mov")
SS_CHYRON = os.path.join(CHYRON_DIR, "Substack Chyron.mov")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 composite_broll.py <source_video> <broll_directory> [--version N]")
        sys.exit(1)

    source = sys.argv[1]
    broll = sys.argv[2]
    version = None

    if "--version" in sys.argv:
        idx = sys.argv.index("--version")
        version = int(sys.argv[idx + 1])

    composite_path = composite(source, broll, version)

    if composite_path:
        print("\n--- Platform Deliverables ---")
        if os.path.exists(YT_CHYRON):
            add_chyron(composite_path, YT_CHYRON, "YT")
        else:
            print(f"YouTube chyron not found: {YT_CHYRON}")

        if os.path.exists(SS_CHYRON):
            add_chyron(composite_path, SS_CHYRON, "SS")
        else:
            print(f"Substack chyron not found: {SS_CHYRON}")

        print("\nDone!")
