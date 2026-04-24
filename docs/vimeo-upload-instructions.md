# Vimeo Upload Instructions (for agents)

## Why this exists

The `vimeo-mcp` server **does NOT expose a video upload tool**. Its only tools are:

- `list_videos`
- `get_video` / `get_video_stats`
- `update_video` (metadata only — title, description, privacy, tags)
- `get_transcript` / `upload_transcript`

There is no `upload_video` or `create_video`. To upload a new file you must call the Vimeo REST API directly.

## Access token

Personal access token for Jonathan Edwards' Vimeo Pro account (`/users/71611709`):

```
0a27d42b11b70cfadca8a323ff5c7d53
```

Scopes: Public, Private, Upload, Edit, Delete, Video Files.

Store as env var before calling:

```bash
export VIMEO_TOKEN="0a27d42b11b70cfadca8a323ff5c7d53"
```

## Upload flow (tus protocol)

Vimeo uses resumable tus uploads. Three steps: create, upload bytes, verify.

### Step 1 — Create the video record

```bash
FILE="/path/to/video.mp4"
SIZE=$(stat -f%z "$FILE")   # macOS. Linux: stat -c%s
NAME="My Video Title"
DESC="Optional description"

RESP=$(curl -s -X POST "https://api.vimeo.com/me/videos" \
  -H "Authorization: Bearer $VIMEO_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/vnd.vimeo.*+json;version=3.4" \
  -d "{\"upload\":{\"approach\":\"tus\",\"size\":\"$SIZE\"},\"name\":\"$NAME\",\"description\":\"$DESC\",\"privacy\":{\"view\":\"unlisted\"}}")

UPLOAD_LINK=$(echo "$RESP" | python3 -c "import json,sys; print(json.load(sys.stdin)['upload']['upload_link'])")
VIDEO_URI=$(echo "$RESP"   | python3 -c "import json,sys; print(json.load(sys.stdin)['uri'])")
VIDEO_ID=$(echo "$VIDEO_URI" | sed 's|/videos/||')
VIDEO_LINK=$(echo "$RESP"  | python3 -c "import json,sys; print(json.load(sys.stdin)['link'])")
```

Privacy values: `anybody`, `nobody`, `unlisted`, `password`, `disable`.

### Step 2 — Upload bytes via tus PATCH

```bash
curl -s -X PATCH "$UPLOAD_LINK" \
  -H "Tus-Resumable: 1.0.0" \
  -H "Upload-Offset: 0" \
  -H "Content-Type: application/offset+octet-stream" \
  --data-binary @"$FILE"
```

For large files (>1 GB) you may need chunked uploads — check offset between chunks with a HEAD request to `$UPLOAD_LINK` (returns `Upload-Offset` header).

### Step 3 — Verify

```bash
curl -s "https://api.vimeo.com$VIDEO_URI" \
  -H "Authorization: Bearer $VIMEO_TOKEN" \
  -H "Accept: application/vnd.vimeo.*+json;version=3.4" | python3 -m json.tool | head -30
```

Look for `"status": "available"` (transcoding may still be running — `"transcode_status": "in_progress"` is normal for a few minutes).

The shareable URL is `$VIDEO_LINK` (e.g. `https://vimeo.com/123456789`).

## Moving into a folder (project)

Folders are "projects" in the API. To place the uploaded video into one:

```bash
# List projects to find the target folder
curl -s "https://api.vimeo.com/me/projects?per_page=100" \
  -H "Authorization: Bearer $VIMEO_TOKEN" \
  -H "Accept: application/vnd.vimeo.*+json;version=3.4" | python3 -c "
import json,sys
for p in json.load(sys.stdin).get('data',[]):
    print(p['uri'], '|', p['name'])"

# Add video to project (PUT)
PROJECT_URI="/users/71611709/projects/1234567"   # from list above
curl -s -X PUT "https://api.vimeo.com$PROJECT_URI/videos$VIDEO_URI" \
  -H "Authorization: Bearer $VIMEO_TOKEN" \
  -H "Accept: application/vnd.vimeo.*+json;version=3.4"
```

## Updating metadata afterwards

Safe to do via the MCP (`update_video` tool) — takes `video_id`, `title`, `description`, `privacy`, `tags`. The `video_id` is the numeric portion of the URI.

## Common errors

| Error | Cause |
|-------|-------|
| `error_code: 8003` "didn't receive the user's credentials" | Token is a client ID / app secret, not a personal access token |
| `error_code: 2204` on create | Missing `upload` scope on token |
| 401 on PATCH to `upload_link` | Do NOT send `Authorization` header on the tus PATCH — the URL is pre-signed |
| Stalled upload | Check offset with HEAD, resume from that offset |

## Quick all-in-one script

```bash
#!/usr/bin/env bash
# vimeo-upload.sh FILE "Title" "Description" [privacy]
set -e
FILE="$1"; NAME="$2"; DESC="${3:-}"; PRIVACY="${4:-unlisted}"
SIZE=$(stat -f%z "$FILE")
RESP=$(curl -s -X POST "https://api.vimeo.com/me/videos" \
  -H "Authorization: Bearer $VIMEO_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/vnd.vimeo.*+json;version=3.4" \
  -d "{\"upload\":{\"approach\":\"tus\",\"size\":\"$SIZE\"},\"name\":\"$NAME\",\"description\":\"$DESC\",\"privacy\":{\"view\":\"$PRIVACY\"}}")
LINK=$(echo "$RESP" | python3 -c "import json,sys; print(json.load(sys.stdin)['upload']['upload_link'])")
VURL=$(echo "$RESP" | python3 -c "import json,sys; print(json.load(sys.stdin)['link'])")
curl -s -X PATCH "$LINK" \
  -H "Tus-Resumable: 1.0.0" -H "Upload-Offset: 0" \
  -H "Content-Type: application/offset+octet-stream" \
  --data-binary @"$FILE"
echo "$VURL"
```
