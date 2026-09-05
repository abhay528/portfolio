# Premium portfolio update — 5 September 2026

## Implemented
- Rebuilt homepage around selected work, then experience, about, compact skills and contact.
- Preserved Available for work and engineering/SaaS/customer-facing positioning.
- Removed reveal dependency, canvas/starfield and rotating portrait; all content is visible by default.
- Native mobile disclosure works without JavaScript; optional Escape/focus return and link-close behavior.
- Rewrote vulnscan case study and added Page Pulse walkthrough with inspectable source and limitations.
- Removed unsupported headline metrics and unqualified production/security guarantees.
- Aligned printable resume with Save as PDF, guarded email copy enhancement, page-specific canonical/social metadata.
- Lightweight standalone SVG architecture image; no JS-based text-image loading or external font dependency.

## Validation completed
Local Chromium: 4 complete pages × 5 viewport widths (320,390,768,1024,1440), no horizontal overflow, single H1, no broken loaded image, no hidden main sections, no uncaught JS errors. Native no-JS navigation, keyboard open/Escape/focus return, selection-close and reduced-motion behavior passed. Desktop and mobile screenshots inspected.

## Not claimed complete
Full WCAG audit/axe, Firefox/Safari or real-device checks, Lighthouse/Web Vitals, user tests, live domain certificate checks and Page Pulse hosting remediation. GitHub Pages URL was readable before release; custom-domain fetch timed out and hosted demo returned 503 from the fetch environment, not conclusive evidence of a universal outage.

Workflow-file creation was rejected while normal file writes worked. No CI workflow was installed. Social metadata uses a valid profile-image fallback; optional branded PNG requires upload and metadata switch. Existing project code and license attributions are unchanged. The original public PDF was read and found outdated; resume.html now replaces it as the public resume destination. The old binary is preserved, not overwritten.

## Publication method
Pull-request creation was rejected while ordinary file commits were allowed. The main branch is unprotected. New dependencies use premium.css/premium.js so they can be staged without changing the old homepage. index.html and vulnscan.html are switched together only after dependency hashes match the tested bundle. No protections or permissions are modified.
