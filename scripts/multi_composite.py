#!/usr/bin/env python3
"""
Multi-Chyron Full Composite Script
==================================
Composites b-roll clips onto a source video using FFmpeg -itsoffset.
Also applies TWO different full-length Chyrons in a single pass, resulting
in two final output files (YouTube and Substack versions).
"""

import os
import re
import sys
import subprocess
from pathlib import Path

BROLL_HOME = os.environ.get("BROLL_HOME", os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CHYRON_DIR = os.path.join(BROLL_HOME, "assets")
YT_CHYRON = os.path.join(CHYRON_DIR, "Youtube Chyron.mov")
SS_CHYRON = os.path.join(CHYRON_DIR, "Substack Chyron.mov")

def parse_clips(broll_dir: str):
    clips = []
    for f in sorted(os.listdir(broll_dir)):
        if not f.endswith(".mp4"): continue
        match = re.search(r'-([\d\.]+)\.mp4$', f)
        if match:
            start_sec = float(match.group(1))
            clips.append({
                "file": os.path.join(broll_dir, f),
                "start": start_sec,
                "name": f,
            })
    clips.sort(key=lambda c: c["start"])
    return clips

def composite_all(source_video: str, broll_dir: str):
    clips = parse_clips(broll_dir)
    print(f"Found {len(clips)} B-roll clips.")
    
    if not os.path.exists(YT_CHYRON) or not os.path.exists(SS_CHYRON):
        print(f"ERROR: Missing Chyrons! Check {CHYRON_DIR}")
        sys.exit(1)

    base = source_video.rsplit(".mp4", 1)[0]
    out_yt = f"{base}_composite_YT.mp4"
    out_ss = f"{base}_composite_SS.mp4"

    cmd = ["ffmpeg", "-y", "-i", source_video]
    
    # Inputs 1 to N: B-roll
    for c in clips:
        cmd += ["-itsoffset", str(c["start"]), "-i", c["file"]]
        
    # Inputs N+1, N+2: Chyrons
    yt_idx = len(clips) + 1
    ss_idx = len(clips) + 2
    cmd += ["-i", YT_CHYRON, "-i", SS_CHYRON]

    # Build the filter_complex for b-roll layers
    filter_parts = []
    prev_label = "0:v"
    
    for i in range(len(clips)):
        out_label = f"b{i+1}"
        filter_parts.append(f"[{prev_label}][{i+1}:v]overlay=eof_action=pass[{out_label}]")
        prev_label = out_label
        
    final_broll_label = prev_label
    
    # Split the main composite into two branches
    filter_parts.append(f"[{final_broll_label}]split=2[comp1][comp2]")
    
    # Add YT Chyron
    filter_parts.append(f"[comp1][{yt_idx}:v]overlay=eof_action=pass[final_yt]")
    
    # Add SS Chyron
    filter_parts.append(f"[comp2][{ss_idx}:v]overlay=eof_action=pass[final_ss]")
    
    cmd += ["-filter_complex", ";".join(filter_parts)]
    
    # Map and output YT
    cmd += [
        "-map", "[final_yt]", "-map", "0:a",
        "-c:v", "libx264", "-crf", "18", "-preset", "fast",
        "-c:a", "copy",
        out_yt
    ]
    
    # Map and output SS
    cmd += [
        "-map", "[final_ss]", "-map", "0:a",
        "-c:v", "libx264", "-crf", "18", "-preset", "fast",
        "-c:a", "copy",
        out_ss
    ]

    print("Running dual pass composite... this will take a while.")
    print("Command length:", len(cmd))
    
    res = subprocess.run(cmd)
    if res.returncode == 0:
        print("SUCCESS! Created:")
        print("  - " + out_yt)
        print("  - " + out_ss)
    else:
        print(f"FAILED with code {res.returncode}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 multi_composite.py <source> <broll_dir>")
        sys.exit(1)
    composite_all(sys.argv[1], sys.argv[2])
