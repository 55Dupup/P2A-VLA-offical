#!/usr/bin/env python3
"""Assemble only the intended public website files into a deployment directory."""
import argparse
from pathlib import Path
import shutil

DOCS = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--output", type=Path, default=DOCS.parent / "_site")
args = parser.parse_args()
target = args.output.resolve()
if target.exists() and any(target.iterdir()):
    raise SystemExit(f"Output must be an empty directory: {target}")
target.mkdir(parents=True, exist_ok=True)
for name in ("index.html", ".nojekyll"):
    shutil.copy2(DOCS / name, target / name)
shutil.copytree(DOCS / "assets", target / "assets", dirs_exist_ok=True)
originals = (
    "success-task1_p2a_c25_abs_eef-20260728_192748.mp4",
    "success-task2_p2a_c25_abs_eef-20260728_211626.mp4",
    "success-task3_p2a_c25_abs_eef-20260728_212806.mp4",
)
(target / "videos").mkdir(exist_ok=True)
for name in originals:
    shutil.copy2(DOCS / "videos" / name, target / "videos" / name)
print(f"Built project website: {target}")
