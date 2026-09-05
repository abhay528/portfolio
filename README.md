# Abhay Jadon — Portfolio

A static, dependency-free website with an editorial dark-violet design. Runtime: HTML, CSS, and optional JavaScript. Content, images, navigation, and resume links work without JavaScript.

## Pages
- `index.html` — selected work, experience, about, skills, contact.
- `vulnscan.html` — source-grounded security-tool case study.
- `page-pulse.html` — offline-readable web-audit walkthrough.
- `styles.css` — shared design system and responsive layouts.
- `script.js` — optional disclosure-menu support, current year and email copying.
- `assets/scan-pipeline.svg` — explicitly labeled architecture diagram, not a screenshot.
- `assets/Abhay_Jadon_Resume.pdf` — existing resume, preserved unchanged.

## Preview
```sh
python3 -m http.server 8000
```
Open http://localhost:8000. No bundler or runtime dependency is required.

## Browser regression checks
Install the dev-only Playwright dependency, then its browser:
```sh
npm install --no-save playwright@1.55.0
npx playwright install chromium
node tools/browser-test.cjs
```
Alternatively set `CHROMIUM_PATH` to an installed Chromium executable. Results/screenshots are written to `.artifacts/`. The check runs its own local server on port 8765 and closes it afterward. It checks 15 page/viewport combinations plus native no-JS menu behavior, keyboard Escape/focus return, reduced motion, and console errors. It is not a full accessibility certification or a Lighthouse run.

## Deployment
Preserves the existing GitHub Pages branch deployment: `main`, repository root. Canonical URLs currently use https://abhay528.github.io/portfolio/ because that endpoint was readable during release work. Do not change DNS or canonical host until the custom domain and certificate/redirect behavior are verified.

## Social image
Metadata currently uses the public GitHub profile image as a valid fallback, with a square summary card. A new claim-free branded `og.png` is supplied in the downloadable optional-assets folder. Upload it to `assets/og.png`, then update every page's OG/Twitter image URL and use `summary_large_image`. The connector could write website files but rejected workflow creation; binary publication was not claimed complete.

## Content and evidence
See `RELEASE-NOTES.md` and `EVIDENCE.md`. Unsupported metrics were removed rather than manufactured. Linked project author/license metadata has not been overwritten. The old `.txt` captures are not fetched by the website. Remaining capture source files are retained for a future verified re-export; orphaned auth/vuln captures can be removed after reference checks.
