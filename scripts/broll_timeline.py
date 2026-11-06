"""Clip discovery and insertion policy shared by both FFmpeg compositors.

Filenames end in -SECONDS.mp4 or -SECONDS.MILLISECONDS.mp4. Clip duration is
not needed here: FFmpeg reads the media itself when building the composite.
"""

import math
import re
from pathlib import Path

MIN_START = 20.0
MIN_GAP = 15.0  # Between clip starts, matching the scout's contract.
TIMECODE = re.compile(r"-(\d+(?:\.\d+)?)\.mp4$")


def parse_clips(broll_dir: str) -> list[dict]:
    """Discover files deterministically; malformed MP4 names do not abort a job."""
    clips = []
    for path in sorted(Path(broll_dir).iterdir()):
        if not path.is_file() or path.suffix != ".mp4":
            continue
        match = TIMECODE.search(path.name)
        start = float(match.group(1)) if match else math.nan
        if not math.isfinite(start):
            print(f"  SKIP (invalid timecode): {path.name}")
            continue
        clips.append({"file": str(path), "start": start, "name": path.name})
    return sorted(clips, key=lambda clip: clip["start"])


def apply_spacing_rules(clips: list[dict]) -> list[dict]:
    """Select a chronological timeline with the established start/spacing rules."""
    selected = []
    for clip in sorted(clips, key=lambda clip: clip["start"]):
        if clip["start"] < MIN_START:
            print(f"  SKIP (before {MIN_START}s): {clip['name']}")
            continue
        if selected and clip["start"] - selected[-1]["start"] < MIN_GAP:
            gap = clip["start"] - selected[-1]["start"]
            print(f"  SKIP ({gap:.1f}s gap, need {MIN_GAP}s): {clip['name']}")
            continue
        selected.append(clip)
    return selected
