# SEO hardening and discoverability

## Changes
- Audit saved before website edits: seo/audit.md.
- Unique titles and 120-155 character descriptions on all five pages.
- Canonicals, Open Graph tags and existing local social image on every page.
- Homepage WebSite JSON-LD; About Person/Organization graph and worksFor relationship.
- Raw homepage /about/ link, with a local-file fallback preserving direct-open support.
- Sitemap lists all five directory canonical URLs without index.html.
- Image dimensions and below-fold lazy loading; compressed website banner and animated README preview.
- Phase 2 not requested; promotion/SKIPPED.md records this.

## Verification checklist
- [x] Before-change audit: seo/audit.md records redirect/status/header values, metadata, image inventory and live link checks.
- [x] Unique metadata, canonical URLs, OG, viewport, one H1, no noindex, image dimensions and budget: `python tests/verify-seo.py`.
- [x] Identity, JSON parse, robots, sitemap, raw About link, no public email: `python tests/verify-discoverability.py`.
- [x] Existing design contract: `python tests/verify-chassis-blade.py`.
- [x] Interactive landing and file URL compatibility: `node tests/verify-landing.cjs D:/miawrouter/node_modules/playwright`.
- [x] Whitespace errors: `git diff --check` (empty output).
- [x] Promotion skipped, no ads/tracking added.
- [ ] Alias redirects and deployment verification: see Not fixed.

```text
PASS: five canonical pages, unique metadata, OG, dimensions, image budget, schema JSON, sitemap, About link, no Chinese; promotion skipped
PASS: raw HTML founder, About link, canonicals, robots, sitemap, identity graph, metadata, README, no public email
PASS: MiawLabs bright 3D design contract satisfied
PASS: WebGL, no navbar, responsive, products, modes, reduced motion; WebGL fallback preserves controls; file:// works and 3D frames animate.
```

Live curl verification output is in seo/live-verification.md. It describes the deployed baseline, not these unmerged changes. Commands were run with curl.exe and Python filtering on Windows rather than Unix grep.

## Not fixed
- About aliases and www all serve 200 without redirects. Directory URLs are observed working endpoints and selected as preferred canonical URLs. Static source alone cannot enforce host redirects; the requested alias-redirect acceptance item remains open. No unsupported redirect file was invented.
- Live metadata does not reflect the branch until deployment. Re-run live verification after merge.
- Google Rich Results Test and Search Console require owner follow-up. JSON syntax is locally validated, not a claim of rich-result eligibility.
- No lastmod values invented; sitemap omits optional lastmod.
- npm account-maintainer metadata and release publication remain outside this website branch.
- README remains project documentation instead of being replaced with an agent task specification.
