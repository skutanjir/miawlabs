# Ownership and discoverability audit

## Confirmed identity and privacy

The owner confirmed Sulistyo Fajar Pratama as founder/owner of MiawLabs, GitHub `skutanjir`, npm publisher `miaws`. GitHub's public profile independently supplies the same display name. Two contact addresses were supplied with a request not to expose them. Neither address is included in this report, site source, JSON-LD or repository metadata.

Contact links use GitHub. A static site cannot send mail while concealing its destination: mailto links, encoded strings and frontend form endpoints remain inspectable. A private recipient requires a server-side mail service with server-only configuration, input validation, abuse controls and delivery handling. No fake or nonfunctional form was added.

## Live audit before changes

Fetched using Python urllib (equivalent to curl), following redirects:

```text
https://miawlabs.web.id/             HTTP 200
  No founder text or canonical found in raw HTML.
https://miawlabs.web.id/about        HTTP 404
https://miawlabs.web.id/robots.txt   HTTP 404
https://miawlabs.web.id/sitemap.xml  HTTP 404
```

No X-Robots-Tag was returned for the homepage. Missing About means its indexing directives could not be verified.

Registry API: `https://registry.npmjs.org/miawrouter/latest` had no author, homepage or repository; it lists publisher `miaws`. Its existing account metadata already exposes a publisher email. Editing website files cannot remove registry account data or historical package metadata. Review npm account privacy and registry policy directly; do not assume publishing a release hides it.

## Changes

- Static `about/index.html`: visible founder/owner text, official GitHub/npm links and a GitHub issue contact link.
- Homepage footer links to `/about`, without adding a navbar.
- Homepage, About and product pages have absolute self canonicals.
- `robots.txt` allows the site and points to the sitemap.
- `sitemap.xml` includes the homepage, About and three product pages.
- About includes linked Schema.org Person and Organization JSON-LD. No email properties.
- MiawLabs `package.json` and README contain matching maintainer identity. Website package is private, not the npm CLI.
- `docs/miawrouter-identity.patch` supplies metadata for both root and CLI package manifests in the separate MiawRouter repository. That repository has extensive existing changes; it was not modified. `git apply --check` passes against its current files. Review before applying; update its lockfile and publish via its normal release process. A package's `maintainers` field does not grant npm ownership or override registry-managed maintainers.

## Verification

```text
python tests/verify-discoverability.py
PASS: raw HTML founder, About link, canonicals, robots, sitemap, identity graph, metadata, README, no public email

python tests/verify-chassis-blade.py
PASS: MiawLabs bright 3D design contract satisfied

node tests/verify-landing.cjs D:/miawrouter/node_modules/playwright
PASS: WebGL, no navbar, responsive, products, modes, reduced motion; WebGL fallback preserves controls; file:// works and 3D frames animate.

git -C D:/miawrouter apply --check D:/miawlabs/docs/miawrouter-identity.patch
exit 0; no output
```

## Deployment and remaining acceptance checks

These are source changes, not proof of live deployment. The host must resolve `/about` to `about/index.html` (or redirect to `/about/`); use `curl -L` for a trailing-slash host. Canonical identity remains `/about`. Verify status, rendered HTML, HTTP X-Robots-Tag and server redirects after deployment. Root-relative links assume deployment at the requested custom domain, not a GitHub project subpath.

Run the requested commands after deployment; do not replace the initial 404 results with unobserved success:

```sh
curl -sL https://miawlabs.web.id/about | grep -i founder
curl -sL https://miawlabs.web.id/ | grep -i 'href="/about"'
curl -sL https://miawlabs.web.id/robots.txt
curl -sL https://miawlabs.web.id/sitemap.xml | grep -i about
curl -sL https://miawlabs.web.id/about | grep -i noindex
# Expected: no output, grep exit 1 (also check X-Robots-Tag separately).
grep -E '"(author|maintainers)"' package.json
grep -i '## Maintainer' README.md
```

JSON-LD was parsed and graph references tested locally. Google Rich Results Test has NOT been run; submit the deployed About URL there and use Schema.org Validator for general vocabulary validation. A Person/Organization graph does not itself guarantee a supported rich result. Indexing and ranking are not promised.

No PR created and no deployment or npm publish performed. This report can be used as a PR description after review. GitHub CLI is not installed in this environment.

## Local-file compatibility correction

Homepage uses the crawlable relative link `about/index.html`, not `/about`: a root-relative link opens the drive root under file://. About assets and internal links are also relative. Canonical and sitemap remain https://miawlabs.web.id/about. The original exact href grep must instead check `about/index.html`.
