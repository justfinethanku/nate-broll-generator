#!/usr/bin/env python3
"""
Validate a broll_manifest.md against the scout agent's hard constraints.
Usage: python3 eval_scout_manifest.py <manifest_path> <chunked_transcript_path>
"""
import sys
import re
import json
import math
from decimal import Decimal

def load_manifest(path):
    with open(path) as f:
        text = f.read()
    return text

def load_chunked(path):
    with open(path) as f:
        return json.load(f)

def extract_header(text):
    """Extract header metadata from manifest."""
    headers = {}
    for line in text.split('\n'):
        m = re.match(r'\*\*(\w[\w\s]*?):\*\*\s*(.+)', line)
        if m:
            headers[m.group(1).strip()] = m.group(2).strip()
    return headers

def extract_clips(text):
    """Extract clip rows from the manifest table."""
    clips = []
    in_table = False
    for line_number, line in enumerate(text.split('\n'), 1):
        line = line.strip()
        if re.match(r'^\|\s*#\s*\|', line):
            in_table = True
            continue
        if in_table and line.startswith('|'):
            parts = [p.strip() for p in line.split('|')[1:-1]]
            if parts and all(re.fullmatch(r':?-+:?', p) for p in parts):
                continue
            if not line.endswith('|') or len(parts) != 6:
                raise ValueError(f'Manifest line {line_number}: expected 6 table columns')
            clips.append({
                'num': parts[0],
                'status': parts[1],
                'timecode': parts[2],
                'cue': parts[3].removeprefix('"').removesuffix('"'),
                'concept': parts[4],
                'filename': parts[5],
            })
        elif in_table and not line.startswith('|'):
            in_table = False
    return clips

def validate(manifest_path, chunked_path):
    try:
        text = load_manifest(manifest_path)
        chunked = load_chunked(chunked_path)
        duration = chunked['duration']
        words = chunked['words']
        if (isinstance(duration, bool) or not isinstance(duration, (int, float))
                or not math.isfinite(duration) or duration <= 0):
            raise ValueError('Transcript duration must be a positive finite number of seconds')
        if not isinstance(words, list):
            raise ValueError('Transcript words must be an array')
        for index, word in enumerate(words):
            if (not isinstance(word, dict) or not isinstance(word.get('text'), str)
                    or not word['text'] or isinstance(word.get('start'), bool)
                    or not isinstance(word.get('start'), (int, float))
                    or not math.isfinite(word['start']) or word['start'] < 0):
                raise ValueError(f'Transcript word {index + 1} needs text and a finite start in milliseconds')
        headers = extract_header(text)
        clips = extract_clips(text)
    except (OSError, ValueError, KeyError, TypeError, OverflowError) as exc:
        print(f'FAIL: Invalid scout input: {exc}')
        print('VERDICT: FAIL')
        return False

    passes = 0
    fails = 0
    warnings = 0

    def check(condition, label, warn_only=False):
        nonlocal passes, fails, warnings
        if condition:
            print(f"  PASS: {label}")
            passes += 1
        elif warn_only:
            print(f"  WARN: {label}")
            warnings += 1
        else:
            print(f"  FAIL: {label}")
            fails += 1

    print("=" * 60)
    print(f"SCOUT EVAL: {manifest_path}")
    print(f"Video duration: {duration}s ({duration/60:.1f} min)")
    print(f"Clips found: {len(clips)}")
    print("=" * 60)

    # --- Header checks ---
    print("\n--- Header Validation ---")
    check('Source' in headers, "Has Source field")
    check('Resolution' in headers, "Has Resolution field")
    check('Duration' in headers, "Has Duration field")
    check('Batch Prefix' in headers, "Has Batch Prefix field")
    check('Generated' in headers, "Has Generated field")

    prefix = headers.get('Batch Prefix', '')
    check(re.fullmatch(r'[A-Z]{2,3}', prefix) is not None,
          f"Batch prefix '{prefix}' is 2-3 uppercase chars")
    check([c['num'] for c in clips] == [str(i) for i in range(1, len(clips) + 1)],
          "Clip numbers are sequential positive integers starting at 1")

    # --- Density check ---
    print("\n--- Density Validation ---")
    target = round(duration / 600 * 8)
    check(len(clips) >= target - 2, f"Clip count ({len(clips)}) >= target-2 ({target-2})")
    check(len(clips) <= target + 2, f"Clip count ({len(clips)}) <= target+2 ({target+2})")

    # --- Timing checks ---
    print("\n--- Timing Validation ---")
    timecodes = []
    for clip in clips:
        tc = float(clip['timecode']) if re.fullmatch(r'[0-9]+\.[0-9]{3}', clip['timecode']) else math.nan
        if not math.isfinite(tc):
            print(f"  FAIL: Clip {clip['num']} has invalid timecode: {clip['timecode']}")
            fails += 1
            continue
        timecodes.append(tc)
        check(20 <= tc < duration - 15,
              f"Clip {clip['num']} at {tc:.3f}s is >= 20s and before video end minus 15s")

    if timecodes:
        # Spacing check
        spacing_ok = True
        for i in range(1, len(timecodes)):
            gap = timecodes[i] - timecodes[i-1]
            if gap < 15.0:
                print(f"  FAIL: Clips {i} and {i+1} are {gap:.1f}s apart (need 15s)")
                fails += 1
                spacing_ok = False
        if spacing_ok:
            check(True, "All consecutive clips >= 15s apart")

        # Even distribution
        quarters = [0, 0, 0, 0]
        for tc in timecodes:
            if 0 <= tc < duration:
                q = min(3, int(tc / duration * 4))
                quarters[q] += 1
        empty_quarters = sum(1 for q in quarters if q == 0)
        check(empty_quarters == 0,
              f"Distribution across quarters: {quarters} (no empty quarters)",
              warn_only=True)

    # --- Status checks ---
    print("\n--- Status Validation ---")
    all_planned = all(c['status'] == 'planned' for c in clips)
    check(all_planned, "All clips have status 'planned'")

    # --- Cue validation ---
    print("\n--- 3-Word Cue Validation ---")
    # Preserve case and punctuation, and retain every occurrence of a repeated
    # phrase. The first word's start is in milliseconds; manifest time is seconds.
    cue_starts = {}
    for i in range(len(words) - 2):
        cue = tuple(w['text'] for w in words[i:i+3])
        cue_starts.setdefault(cue, set()).add(Decimal(str(words[i]['start'])))
    cue_issues = 0
    for clip in clips:
        cue_words = tuple(clip['cue'].split())
        if len(cue_words) != 3:
            print(f"  FAIL: Clip {clip['num']} cue has {len(cue_words)} words, need 3: \"{clip['cue']}\"")
            fails += 1
            cue_issues += 1
            continue

        if not re.fullmatch(r'[0-9]+\.[0-9]{3}', clip['timecode']):
            cue_issues += 1
            continue  # Already reported by timing validation.
        if Decimal(clip['timecode']) * 1000 not in cue_starts.get(cue_words, set()):
            print(f"  FAIL: Clip {clip['num']} cue \"{clip['cue']}\" is not verbatim at {clip['timecode']}s")
            fails += 1
            cue_issues += 1

    if cue_issues == 0:
        check(True, "All cues are verbatim at their transcript start times")

    # --- Filename validation ---
    print("\n--- Filename Validation ---")
    fn_issues = 0
    for clip in clips:
        number = clip['num'].zfill(3)
        expected = f"{prefix}-{number}-{clip['cue']}-{clip['timecode']}.mp4"
        if (clip['filename'] != expected or '/' in clip['filename']
                or '\\' in clip['filename']):
            print(f"  FAIL: Clip {clip['num']} filename must be {expected}")
            fails += 1
            fn_issues += 1

    if fn_issues == 0:
        check(True, "All filenames match PREFIX-NNN-cue-timecode.mp4 pattern")

    # --- Concept quality ---
    print("\n--- Concept Quality ---")
    vague_concepts = 0
    for clip in clips:
        concept = clip['concept'].lower()
        if concept in ['important point', 'key insight', 'discussion', 'topic']:
            vague_concepts += 1
            print(f"  WARN: Clip {clip['num']} has vague concept: \"{clip['concept']}\"")
            warnings += 1
    if vague_concepts == 0:
        check(True, "All concepts are specific (not vague)")

    # --- Summary ---
    print("\n" + "=" * 60)
    print(f"RESULTS: {passes} passed, {fails} failed, {warnings} warnings")
    print(f"VERDICT: {'PASS' if fails == 0 else 'FAIL'}")
    print("=" * 60)

    return fails == 0

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print(f"Usage: {sys.argv[0]} <manifest.md> <chunked_transcript.json>")
        sys.exit(1)
    success = validate(sys.argv[1], sys.argv[2])
    sys.exit(0 if success else 1)
