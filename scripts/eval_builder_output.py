#!/usr/bin/env python3
"""
Validate a broll-builder output .tsx file against the API contract.
Usage: python3 eval_builder_output.py <tsx_file_path>
"""
import sys
import re
import os

def validate(tsx_path):
    if not os.path.exists(tsx_path):
        print(f"FAIL: File does not exist: {tsx_path}")
        return False

    with open(tsx_path) as f:
        code = f.read()

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

    filename = os.path.basename(tsx_path)
    print("=" * 60)
    print(f"BUILDER EVAL: {filename}")
    print(f"File size: {len(code)} bytes, {len(code.splitlines())} lines")
    print("=" * 60)

    # --- Import checks ---
    print("\n--- Import Validation ---")
    check('from "remotion"' in code or "from 'remotion'" in code,
          "Imports from remotion")
    check('useCurrentFrame' in code, "Imports useCurrentFrame")
    check('useVideoConfig' in code, "Imports useVideoConfig")
    check('from "./shared"' in code or "from './shared'" in code,
          "Imports from ./shared")
    check('BRollTemplate' in code, "Imports BRollTemplate")
    check('GfxZone' in code, "Imports GfxZone")
    check('OB1' in code, "Imports OB1")
    uses_explicit_variants = 'TitleNode' in code or 'MetricNode' in code or 'SubtitleCardNode' in code
    check('FONTS' in code or uses_explicit_variants,
          "Uses FONTS directly or shared node primitives")
    check(uses_explicit_variants,
          "Uses explicit node variants")

    # --- Structure checks ---
    print("\n--- Structure Validation ---")
    check('type ClipSpec' in code or 'interface ClipSpec' in code,
          "Defines ClipSpec type")
    check('const clipSpecs' in code, "Defines clipSpecs array")
    check('const makeClip' in code or 'function makeClip' in code,
          "Defines makeClip function")
    check('ClipComponent.displayName' in code, "Sets displayName on ClipComponent")

    # Check export pattern
    export_match = re.search(r'export const (\w+_CLIPS_\w+)', code)
    check(export_match is not None,
          f"Has export const PREFIX_CLIPS_LETTER pattern"
          + (f" ({export_match.group(1)})" if export_match else ""))

    # Check scenes always start:90, end:300
    scene_starts = re.findall(r'start:\s*(\d+)', code)
    scene_ends = re.findall(r'end:\s*(\d+)', code)
    # Filter to just scene definitions (near each other)
    check('start: 90' in code, "Scene start is 90")
    check('end: 300' in code, "Scene end is 300")

    # Count clipSpecs entries
    clip_count = code.count("render: (frame,") + code.count("render: (frame ,")
    check(clip_count >= 2, f"Has {clip_count} clip render functions (need >= 2)")

    # --- Banned pattern checks ---
    print("\n--- Banned Pattern Detection ---")

    # Hardcoded hex colors (outside of OB1 references and string literals in imports)
    # Look for color: "#..." or backgroundColor: "#..." patterns
    inline_hex = re.findall(r'(?:color|background|border|fill|stroke).*?["\']#[0-9a-fA-F]{3,8}["\']', code)
    # Filter out ones that are inside OB1 definitions or template strings referencing OB1
    real_inline_hex = [h for h in inline_hex if 'OB1.' not in h and '${OB1.' not in h]
    check(len(real_inline_hex) == 0,
          f"No inline hex colors ({len(real_inline_hex)} found)" if real_inline_hex else "No inline hex colors")

    # Hardcoded pixel values in fontSize without zone.scale
    bare_fontsize = re.findall(r'fontSize:\s*(\d+)\b', code)
    # These should be Math.round(N * zone.scale) instead
    check(len(bare_fontsize) == 0,
          f"No bare fontSize values ({bare_fontsize[:3]}...)" if bare_fontsize else "No bare fontSize values (all use zone.scale)")

    # Raw sans-serif font
    check('"sans-serif"' not in code and "'sans-serif'" not in code,
          "No raw 'sans-serif' font (uses FONTS.heading)")

    # Canvas-size SVGs
    check('width="1920"' not in code and "width='1920'" not in code,
          "No hardcoded 1920px SVG width")
    check('width="1080"' not in code and "width='1080'" not in code,
          "No hardcoded 1080px values")
    check('DiagramNode' not in code,
          "Does not use retired DiagramNode primitive")

    # Check for sceneFrame offset
    check('frame - 90' in code or 'frame- 90' in code or 'frame -90' in code,
          "Uses scene-relative timing (frame - 90)")

    # --- Animation function arg count checks ---
    print("\n--- Animation Signature Checks ---")

    # ease() should have 3 args
    ease_calls = re.findall(r'ease\(([^)]+)\)', code)
    ease_bad = [c for c in ease_calls if len(c.split(',')) != 3]
    check(len(ease_bad) == 0,
          f"All ease() calls have 3 args" if not ease_bad else f"ease() calls with wrong arg count: {len(ease_bad)}")

    # bouncePop() should have 3 args (frame, start, fps)
    bp_calls = re.findall(r'bouncePop\(([^)]+)\)', code)
    bp_bad = [c for c in bp_calls if len(c.split(',')) != 3]
    check(len(bp_bad) == 0,
          f"All bouncePop() calls have 3 args (incl fps)" if not bp_bad else f"bouncePop() with wrong args: {len(bp_bad)}")

    # countUp() should have 4 args
    cu_calls = re.findall(r'countUp\(([^)]+)\)', code)
    cu_bad = [c for c in cu_calls if len(c.split(',')) != 4]
    check(len(cu_bad) == 0,
          f"All countUp() calls have 4 args" if not cu_bad else f"countUp() with wrong args: {len(cu_bad)}")

    # --- OB1 key checks ---
    print("\n--- OB1 Key Validation ---")
    valid_keys = {'BG_DARK', 'BG_MID', 'ORANGE', 'STEEL', 'WHITE', 'DIM', 'GREEN', 'CYAN', 'RED', 'AMBER', 'PURPLE'}
    ob1_refs = re.findall(r'OB1\.(\w+)', code)
    invalid_keys = [k for k in ob1_refs if k not in valid_keys]
    check(len(invalid_keys) == 0,
          f"All OB1 keys are valid" if not invalid_keys else f"Invalid OB1 keys: {set(invalid_keys)}")

    # --- Text visibility checks ---
    print("\n--- Text Visibility Rules ---")
    if uses_explicit_variants:
        check(True, "Delegates zIndex handling to shared primitives")
    else:
        check('zIndex: 10' in code or 'zIndex:10' in code,
              "Uses zIndex: 10 for text elements")
        check('zIndex: 0' in code or 'zIndex:0' in code,
              "Uses zIndex: 0 for decorative elements",
              warn_only=True)

    # --- Zone-relative sizing ---
    print("\n--- Zone Usage ---")
    check('zone.width' in code, "Uses zone.width for sizing")
    check('zone.height' in code, "Uses zone.height for sizing")
    check('zone.scale' in code or uses_explicit_variants,
          "Uses zone.scale directly or shared node primitives for scaling")
    node_variant_count = code.count('<TitleNode') + code.count('<MetricNode') + code.count('<SubtitleCardNode')
    if node_variant_count >= 2:
        check('assertSceneSpacing' in code,
              "Uses scene-level spacing guard when rendering multiple nodes")

    # --- Clip ID format ---
    print("\n--- Clip ID Format ---")
    clip_ids = re.findall(r'id:\s*"([^"]+)"', code)
    id_issues = 0
    for cid in clip_ids:
        if not re.match(r'^[A-Z]{2,3}-\d{3}-\w+', cid):
            print(f"  FAIL: Clip ID doesn't match PREFIX-NNN-ShortName: {cid}")
            fails += 1
            id_issues += 1
    if id_issues == 0 and clip_ids:
        check(True, f"All {len(clip_ids)} clip IDs match PREFIX-NNN-ShortName format")

    # --- Summary ---
    print("\n" + "=" * 60)
    print(f"RESULTS: {passes} passed, {fails} failed, {warnings} warnings")
    print(f"VERDICT: {'PASS' if fails == 0 else 'FAIL'}")
    print("=" * 60)

    return fails == 0

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <file.tsx>")
        sys.exit(1)
    success = validate(sys.argv[1])
    sys.exit(0 if success else 1)
