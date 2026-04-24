#!/usr/bin/env python3
"""
Verify that mandatory full-size QC stills exist for a set of clip IDs.

Usage:
  python3 verify_qc_stills.py <qc_dir> <clip_id> [<clip_id> ...]

Required frames are fixed at 150 and 270. This script is meant to gate the
"built" status: if the stills are missing, the clip is not built yet.
"""

from pathlib import Path
import sys

REQUIRED_FRAMES = (150, 270)


def main() -> int:
    if len(sys.argv) < 3:
        print(f"Usage: {sys.argv[0]} <qc_dir> <clip_id> [<clip_id> ...]")
        return 1

    qc_dir = Path(sys.argv[1]).expanduser()
    clip_ids = sys.argv[2:]

    if not qc_dir.exists():
        print(f"FAIL: QC directory does not exist: {qc_dir}")
        return 1

    fails = 0
    passes = 0

    print("=" * 60)
    print(f"QC STILL CHECK: {qc_dir}")
    print(f"Clip count: {len(clip_ids)}")
    print("=" * 60)

    for clip_id in clip_ids:
        missing = []
        for frame in REQUIRED_FRAMES:
            still_path = qc_dir / f"{clip_id}-f{frame}.png"
            if not still_path.exists():
                missing.append(still_path.name)

        if missing:
            print(f"FAIL: {clip_id} missing {', '.join(missing)}")
            fails += 1
        else:
            print(f"PASS: {clip_id} has f150 and f270 stills")
            passes += 1

    print("=" * 60)
    print(f"RESULTS: {passes} passed, {fails} failed")
    print(f"VERDICT: {'PASS' if fails == 0 else 'FAIL'}")
    print("=" * 60)
    return 0 if fails == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
