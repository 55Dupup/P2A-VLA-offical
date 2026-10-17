#!/usr/bin/env python3
"""Rebuild the stacking preview, removing only its long stationary hold.

Requires ffmpeg and ffprobe. Times refer to the original recording.
"""
import json
from pathlib import Path
import subprocess

DOCS = Path(__file__).resolve().parents[1]


def main():
    source = DOCS / "videos/success-task3_p2a_c25_abs_eef-20260728_212806.mp4"
    output = DOCS / "assets/videos/real-stacking.mp4"
    filters = (
        "[0:v]split=2[a][b];"
        "[a]trim=start=0:end=18.5,setpts=PTS-STARTPTS[first];"
        "[b]trim=start=51:end=56.7,setpts=PTS-STARTPTS[last];"
        "[first][last]concat=n=2:v=1:a=0,"
        "setpts=(PTS-STARTPTS)/3,scale=640:-2,fps=30[out]"
    )
    subprocess.run([
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(source),
        "-filter_complex", filters, "-map", "[out]", "-an", "-c:v", "libx264",
        "-threads", "2", "-preset", "medium", "-crf", "23", "-pix_fmt", "yuv420p",
        "-movflags", "+faststart", str(output),
    ], check=True)
    subprocess.run([
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-ss", "0.1",
        "-i", str(output), "-frames:v", "1", "-q:v", "3",
        str(DOCS / "assets/images/real-stacking.jpg"),
    ], check=True)
    duration = float(subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", str(output),
    ]))
    path = DOCS / "assets/media-manifest.json"
    manifest = json.loads(path.read_text())
    entry = next(item for item in manifest["videos"] if item["id"] == "real-stacking")
    entry.update(speed=3, duration_seconds=duration,
                 source_segments_seconds=[[0, 18.5], [51, 56.7]],
                 edits="Removed the stationary hold from 18.5 to 51 seconds; retained chronological order and final arm retraction; 3x source playback.")
    path.write_text(json.dumps(manifest, indent=2) + "\n")
    print(f"Stacking preview: {duration:.2f} seconds")


if __name__ == "__main__":
    main()
