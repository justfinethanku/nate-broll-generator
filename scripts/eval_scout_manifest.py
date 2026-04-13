#!/usr/bin/env python3
"""
Validate a broll_manifest.md against the scout agent's hard constraints.
Usage: python3 eval_scout_manifest.py <manifest_path> <chunked_transcript_path>
"""
import sys
import re
import json

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
    for line in text.split('\n'):
        line = line.strip()
        if line.startswith('| #'):
            in_table = True
            continue
        if in_table and line.startswith('|---'):
            continue
        if in_table and line.startswith('|'):
            parts = [p.strip() for p in line.split('|')[1:-1]]
            if len(parts) >= 6:
                clips.append({
                    'num': parts[0],
                    'status': parts[1],
                    'timecode': parts[2],
                    'cue': parts[3].strip('"'),
                    'concept': parts[4],
                    'filename': parts[5],
                })
        elif in_table and not line.startswith('|'):
            in_table = False
    return clips

def validate(manifest_path, chunked_path):
    text = load_manifest(manifest_path)
    chunked = load_chunked(chunked_path)

    duration = chunked['duration']
    words = chunked['words']
    word_texts = [w['text'].lower().rstrip('.,!?;:') for w in words]

    headers = extract_header(text)
    clips = extract_clips(text)

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
    check(len(prefix) >= 2 and len(prefix) <= 3 and prefix.isupper(),
          f"Batch prefix '{prefix}' is 2-3 uppercase chars")

    # --- Density check ---
    print("\n--- Density Validation ---")
    target = round(duration / 600 * 8)
    check(len(clips) >= target - 2, f"Clip count ({len(clips)}) >= target-2 ({target-2})")
    check(len(clips) <= target + 2, f"Clip count ({len(clips)}) <= target+2 ({target+2})")

    # --- Timing checks ---
    print("\n--- Timing Validation ---")
    timecodes = []
    for clip in clips:
        try:
            tc = float(clip['timecode'])
            timecodes.append(tc)
        except ValueError:
            print(f"  FAIL: Clip {clip['num']} has invalid timecode: {clip['timecode']}")
            fails += 1

    if timecodes:
        check(timecodes[0] >= 20.0,
              f"First clip at {timecodes[0]:.3f}s >= 20s")

        check(timecodes[-1] < duration - 15,
              f"Last clip at {timecodes[-1]:.3f}s is before video end minus 15s")

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
            q = min(3, int(tc / (duration / 4)))
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
    cue_issues = 0
    for clip in clips:
        cue_words = clip['cue'].lower().split()
        if len(cue_words) != 3:
            print(f"  FAIL: Clip {clip['num']} cue has {len(cue_words)} words, need 3: \"{clip['cue']}\"")
            fails += 1
            cue_issues += 1
            continue

        # Check if the 3 words appear consecutively in the transcript
        found = False
        for i in range(len(word_texts) - 2):
            if (word_texts[i] == cue_words[0].rstrip('.,!?') and
                word_texts[i+1] == cue_words[1].rstrip('.,!?') and
                word_texts[i+2] == cue_words[2].rstrip('.,!?')):
                found = True
                break
        if not found:
            # Try with punctuation still attached
            found_fuzzy = False
            for i in range(len(words) - 2):
                w0 = words[i]['text'].lower().rstrip('.,!?;:')
                w1 = words[i+1]['text'].lower().rstrip('.,!?;:')
                w2 = words[i+2]['text'].lower().rstrip('.,!?;:')
                c0 = cue_words[0].rstrip('.,!?;:')
                c1 = cue_words[1].rstrip('.,!?;:')
                c2 = cue_words[2].rstrip('.,!?;:')
                if w0 == c0 and w1 == c1 and w2 == c2:
                    found_fuzzy = True
                    break
            if found_fuzzy:
                passes += 1
            else:
                print(f"  FAIL: Clip {clip['num']} cue \"{clip['cue']}\" not found in transcript words")
                fails += 1
                cue_issues += 1

    if cue_issues == 0:
        check(True, "All cues are verbatim from transcript")

    # --- Filename validation ---
    print("\n--- Filename Validation ---")
    fn_issues = 0
    for clip in clips:
        fn = clip['filename']
        # Pattern: PREFIX-NNN-three word cue-SECONDS.MILLISECONDS.mp4
        if not fn.endswith('.mp4'):
            print(f"  FAIL: Clip {clip['num']} filename doesn't end with .mp4: {fn}")
            fails += 1
            fn_issues += 1
            continue

        if not fn.startswith(prefix + '-'):
            print(f"  FAIL: Clip {clip['num']} filename doesn't start with prefix '{prefix}-': {fn}")
            fails += 1
            fn_issues += 1
            continue

        # Check NNN pattern
        parts = fn.split('-', 2)
        if len(parts) >= 2:
            try:
                num = int(parts[1])
            except ValueError:
                print(f"  FAIL: Clip {clip['num']} filename has non-numeric NNN: {fn}")
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
