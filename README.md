# P2A-VLA Project Website

**Progressive Perception-to-Action Alignment for Vision-Language-Action Models**

[Project Website](https://p2a-vla.github.io/) · [Code Repository](https://github.com/P2A-VLA/P2A-VLA)

This repository contains the project website, figures, and selected simulation and real-world demonstration videos. The research code is maintained separately in the code repository.

## Editing and Deployment

- Page content: `docs/index.html`
- Styles: `docs/assets/css/style.css`
- Results and demonstration gallery: `docs/assets/js/site.js`
- Media: `docs/assets/images/`, `docs/assets/videos/`

The website is published at `https://p2a-vla.github.io/`. Changes pushed to `main` are deployed through GitHub Actions while the repository is public and the repository variable `PUBLISH_PROJECT_WEBSITE` is `true`.

To take the website offline, unpublish GitHub Pages before making the repository private, set `PUBLISH_PROJECT_WEBSITE` to `false`, and disable Actions if no private preview builds are needed.

To preview locally, run `python3 -m http.server 8765 --directory docs` and open `http://localhost:8765`.

The deployment builder `python3 docs/tools/build_pages.py --output _site` selects the intended website files. The output directory must be empty.

Real-world Tasks 1–2 play at 1.5× source speed. The stacking preview omits the stationary hold from 18.5–51 seconds and plays the remaining footage at 3× speed, preserving chronological order and the final arm retraction. Original recordings remain available. Simulation videos retain their source playback speed. Quantitative results summarize benchmark evaluations. Rebuild the stacking preview with `python3 docs/tools/trim_stacking.py` (requires FFmpeg).
