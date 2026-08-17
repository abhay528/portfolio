# Abhay Jadon — Portfolio

Personal portfolio site. Vanilla HTML/CSS/JS — no build step, no dependencies.

**Live:** https://abhay528.github.io/portfolio

## Run locally

Serve the folder (the project imagery is fetched as text, so use a local server rather than double-clicking the file):

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Structure

| File | Purpose |
| --- | --- |
| `index.html` | All page content and sections |
| `styles.css` | Dark neon theme, layout, responsive rules |
| `script.js` | Typewriter, scroll reveals, starfield canvas, mobile menu, media loader |
| `assets/ids.txt` | Featured capture #1 — real AI-IDS dashboard (WebP data URI, line-wrapped; whitespace is stripped at load) |
| `assets/auth.txt` | Featured artwork #2 (same format) |
| `assets/filecomp.txt` | File Compression app UI capture (same format) |
| `assets/phish.txt` | Phishing detector training-run capture (same format) |
| `assets/vuln.txt` | vulnscan HTML report capture (same format) |
| `assets/pass.txt` | passguard CLI capture (same format) |

To swap an image later, replace the contents of the corresponding `.txt` file with a new data URI.

## Deployment (GitHub Pages)

1. Repo **Settings → Pages**.
2. Source: **Deploy from a branch**.
3. Branch: **main**, folder **/(root)** → Save.
4. Site goes live at `https://abhay528.github.io/portfolio`.

Design direction inspired by a Figma community portfolio template; all code written from scratch. Project captures were produced by running the actual tools (vulnscan scan, passguard CLI) or rendering the real UI code (AI-IDS dashboard, AI Compression frontend).
