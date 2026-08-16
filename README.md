# Abhay Jadon — Portfolio

Personal portfolio site. Vanilla HTML/CSS/JS — no build step, no dependencies.

**Live:** https://abhay528.github.io/portfolio

## Run locally

Serve the folder (the featured artwork is fetched as text, so use a local server rather than double-clicking the file):

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Structure

| File | Purpose |
| --- | --- |
| `index.html` | All page content and sections |
| `styles.css` | Dark neon theme, layout, responsive rules |
| `script.js` | Typewriter, scroll reveals, starfield canvas, mobile menu, artwork loader |
| `assets/ids.txt` | Featured artwork #1 (WebP data URI, line-wrapped; whitespace is stripped at load) |
| `assets/auth.txt` | Featured artwork #2 (same format) |

To swap the artwork later, replace the contents of the corresponding `.txt` file with a new data URI.

## Deployment (GitHub Pages)

1. Repo **Settings → Pages**.
2. Source: **Deploy from a branch**.
3. Branch: **main**, folder **/(root)** → Save.
4. Site goes live at `https://abhay528.github.io/portfolio`.

Design direction inspired by a Figma community portfolio template; all code written from scratch.
