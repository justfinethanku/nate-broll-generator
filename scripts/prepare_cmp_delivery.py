#!/usr/bin/env python3
"""
Prepare a b-roll delivery folder for Content Master Pro ingest.

This normalizes the b-roll package into the CMP contract:

deliverables/upload/
  delivery_manifest.json
  README_MANIFEST.md
  broll_manifest.md
  transcript.md
  youtube_description.md
  podcast_description.md
  youtube_captions.srt
  youtube_final.mp4
  substack_final.mp4
  podcast.mp3
  podcast_preview.mp3
  shorts/short_01.mp4
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Any


SCHEMA_VERSION = 1
DEFAULT_PUBLICATION_SLUG = "core_substack"
VIDEO_EXTS = {".mp4", ".mov", ".m4v", ".webm"}

CANONICAL_FILES = {
    "transcript": {
        "output": "transcript.md",
        "required": True,
        "patterns": ["transcript.md", "*_transcript.md", "*transcript*.md"],
    },
    "youtube_description": {
        "output": "youtube_description.md",
        "required": True,
        "patterns": ["youtube_description.md", "*youtube*description*.md", "*_youtube_description.md"],
    },
    "podcast_description": {
        "output": "podcast_description.md",
        "required": True,
        "patterns": ["podcast_description.md", "*podcast*description*.md", "*_podcast_description.md"],
    },
    "youtube_video": {
        "output": "youtube_final.mp4",
        "required": True,
        "patterns": ["youtube_final.mp4", "*final_youtube*.mp4", "*_final_youtube.mp4", "*composite_YT.mp4"],
    },
    "substack_video": {
        "output": "substack_final.mp4",
        "required": True,
        "patterns": ["substack_final.mp4", "*final_substack*.mp4", "*_final_substack.mp4", "*composite_SS.mp4"],
    },
    "podcast_audio": {
        "output": "podcast.mp3",
        "required": True,
        "patterns": ["podcast.mp3", "*podcast_full*.mp3", "*_podcast_full.mp3", "*final_podcast*.mp3"],
    },
    "preview_audio": {
        "output": "podcast_preview.mp3",
        "required": True,
        "patterns": ["podcast_preview.mp3", "*preview_intro*.mp3", "*preview*.mp3"],
    },
    "youtube_captions_srt": {
        "output": "youtube_captions.srt",
        "required": True,
        "patterns": ["youtube_captions.srt", "*youtube*captions*.srt", "*_youtube_captions.srt", "captions.srt"],
    },
    "readme_manifest": {
        "output": "README_MANIFEST.md",
        "required": True,
        "patterns": ["README_MANIFEST.md"],
    },
    "broll_manifest": {
        "output": "broll_manifest.md",
        "required": True,
        "patterns": ["broll_manifest.md"],
    },
    "qc_notes": {
        "output": "QC_NOTES.md",
        "required": False,
        "patterns": ["QC_NOTES.md", "qc_notes.md", "qc-notes.md"],
    },
}


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", value.strip().lower())
    slug = re.sub(r"-+", "-", slug).strip("-")
    return slug or "broll-delivery"


def find_candidate(root: Path, patterns: list[str], output_name: str, upload_dir: Path) -> Path | None:
    exact_upload = upload_dir / output_name
    if exact_upload.is_file():
        return exact_upload

    for pattern in patterns:
        matches = sorted(
            path for path in root.rglob(pattern) if path.is_file() and "WORKING" not in path.parts
        )
        if matches:
            return matches[0]
    return None


def copy_file(source: Path, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    if source.resolve() == destination.resolve():
        return
    shutil.copy2(source, destination)


def ffprobe_duration(path: Path) -> float | None:
    try:
        result = subprocess.run(
            [
                "ffprobe",
                "-v",
                "error",
                "-show_entries",
                "format=duration",
                "-of",
                "default=noprint_wrappers=1:nokey=1",
                str(path),
            ],
            check=True,
            capture_output=True,
            text=True,
        )
    except Exception:
        return None

    try:
        return round(float(result.stdout.strip()), 2)
    except ValueError:
        return None


def find_shorts_dir(input_dir: Path, upload_dir: Path) -> Path | None:
    for candidate in [
        upload_dir / "shorts",
        input_dir / "shorts",
        input_dir / "shorts_raw_9x16_editorial",
        input_dir / "shorts_UPLOAD_CLEAN",
    ]:
        if candidate.is_dir():
            return candidate
    for candidate in sorted(input_dir.rglob("shorts_raw_9x16_editorial")):
        if candidate.is_dir():
            return candidate
    return None


def normalize_shorts(input_dir: Path, upload_dir: Path) -> list[dict[str, Any]]:
    shorts_dir = find_shorts_dir(input_dir, upload_dir)
    if not shorts_dir:
        return []

    output_dir = upload_dir / "shorts"
    output_dir.mkdir(parents=True, exist_ok=True)

    videos = sorted(path for path in shorts_dir.iterdir() if path.is_file() and path.suffix in VIDEO_EXTS)
    shorts: list[dict[str, Any]] = []
    for index, source in enumerate(videos, start=1):
        short_id = f"short_{index:02d}"
        destination = output_dir / f"{short_id}.mp4"
        copy_file(source, destination)
        duration = ffprobe_duration(destination)
        title = re.sub(r"^\d+[_ -]*", "", source.stem).replace("_", " ").strip() or f"Short {index:02d}"
        item: dict[str, Any] = {
            "id": short_id,
            "title": title,
            "path": f"shorts/{destination.name}",
            "platforms": ["tiktok", "instagram", "youtube_shorts"],
            "metadata": {
                "source_filename": source.name,
            },
        }
        if duration is not None:
            item["duration_seconds"] = duration
        shorts.append(item)
    return shorts


def build_manifest(
    *,
    upload_dir: Path,
    copied_files: dict[str, str],
    shorts: list[dict[str, Any]],
    project_name: str,
    publication_slug: str,
    delivery_id: str,
    source_video_title: str,
    source_video_path: str | None,
) -> dict[str, Any]:
    files = {
        role: relative_path
        for role, relative_path in copied_files.items()
        if role in CANONICAL_FILES and (upload_dir / relative_path).exists()
    }
    manifest: dict[str, Any] = {
        "schema_version": SCHEMA_VERSION,
        "delivery_id": delivery_id,
        "project": {
            "name": project_name,
            "publication_slug": publication_slug,
            "source_video_title": source_video_title,
            "external_ids": {},
        },
        "files": files,
        "shorts": shorts,
        "metadata": {
            "prepared_by": "nate-broll-generator",
        },
    }
    if source_video_path:
        manifest["project"]["source_video_path"] = source_video_path
    return manifest


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Prepare CMP-compatible b-roll deliverables.")
    parser.add_argument("--input-dir", type=Path, default=Path.cwd(), help="Existing delivery package to normalize.")
    parser.add_argument(
        "--upload-dir",
        type=Path,
        default=Path.cwd() / "deliverables" / "upload",
        help="CMP upload folder to create. Defaults to ./deliverables/upload.",
    )
    parser.add_argument("--project-name", required=True, help="Human readable CMP project/video title.")
    parser.add_argument("--video-title", help="Source video title. Defaults to --project-name.")
    parser.add_argument("--source-video-path", help="Optional source video path/reference.")
    parser.add_argument("--delivery-id", help="Stable delivery ID. Defaults to a slug of the project name.")
    parser.add_argument("--publication-slug", default=DEFAULT_PUBLICATION_SLUG)
    parser.add_argument("--allow-missing", action="store_true", help="Write manifest even if required files are missing.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    input_dir = args.input_dir.resolve()
    upload_dir = args.upload_dir.resolve()
    project_name = args.project_name.strip()
    video_title = (args.video_title or project_name).strip()
    delivery_id = args.delivery_id.strip() if args.delivery_id else slugify(project_name)

    if not input_dir.is_dir():
        print(f"Input directory does not exist: {input_dir}", file=sys.stderr)
        return 1

    upload_dir.mkdir(parents=True, exist_ok=True)

    missing: list[str] = []
    copied_files: dict[str, str] = {}
    for role, config in CANONICAL_FILES.items():
        output_name = config["output"]
        source = find_candidate(input_dir, config["patterns"], output_name, upload_dir)
        if not source:
            if config["required"]:
                missing.append(f"{role}: expected {output_name}")
            continue
        destination = upload_dir / output_name
        copy_file(source, destination)
        copied_files[role] = output_name

    shorts = normalize_shorts(input_dir, upload_dir)
    if not shorts:
        missing.append("shorts: expected at least one shorts/*.mp4 file")

    if missing and not args.allow_missing:
        print("Cannot prepare CMP delivery package; required files are missing:", file=sys.stderr)
        for item in missing:
            print(f"  - {item}", file=sys.stderr)
        print("\nUse --allow-missing only for an intentional partial test package.", file=sys.stderr)
        return 1

    manifest = build_manifest(
        upload_dir=upload_dir,
        copied_files=copied_files,
        shorts=shorts,
        project_name=project_name,
        publication_slug=args.publication_slug,
        delivery_id=delivery_id,
        source_video_title=video_title,
        source_video_path=args.source_video_path,
    )
    (upload_dir / "delivery_manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    print("CMP-compatible b-roll delivery package prepared.")
    print(f"Upload folder: {upload_dir}")
    print(f"Manifest: {upload_dir / 'delivery_manifest.json'}")
    print("")
    print("CMP direct-upload dry-run command template:")
    print(
        'node "$BROLL_HOME/scripts/cmp_upload_delivery.mjs" '
        '--deliverables-dir "$PWD/deliverables/upload" '
        '--project-name "$VIDEO_TITLE" --publication-slug core_substack --dry-run'
    )
    print("")
    print("CMP direct-upload dry-run command for this package:")
    print(
        'node "$BROLL_HOME/scripts/cmp_upload_delivery.mjs" '
        f'--deliverables-dir "{upload_dir}" '
        f'--project-name "{project_name}" --publication-slug {args.publication_slug} --dry-run'
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
