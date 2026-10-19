# SEO audit before fixes

Observed on 2026-10-19. Live curl output and local source inventory; no ranking claims.

## Redirects

### https://miawlabs.web.id/about
```text
HTTP/1.1 200 OK
curl exit: 0; 
```

### https://miawlabs.web.id/about/
```text
HTTP/1.1 200 OK
curl exit: 0; 
```

### https://miawlabs.web.id/about/index.html
```text
HTTP/1.1 200 OK
curl exit: 0; 
```

### http://miawlabs.web.id/
```text
HTTP/1.0 308 Permanent Redirect
Location: https://miawlabs.web.id/
HTTP/1.0 200 OK
curl exit: 0; 
```

### https://www.miawlabs.web.id/
```text
HTTP/1.1 200 OK
curl exit: 0; 
```

### https://miawlabs.web.id/router/
```text
HTTP/1.1 200 OK
curl exit: 0; 
```

### https://miawlabs.web.id/code/
```text
HTTP/1.1 200 OK
curl exit: 0; 
```

### https://miawlabs.web.id/ide/
```text
HTTP/1.1 200 OK
curl exit: 0; 
```

## Live page metadata

### /
- Title: 'MiawLabs / Intelligence, on your terms.'
- description: ['Your models. Your machine. MiawRouter, MiawCode and MiawCode IDE: a local AI developer toolchain.']; lengths: [97]
- viewport: ['width=device-width, initial-scale=1.0']; lengths: [37]
- robots: []; lengths: []
- og:title: ['MiawLabs / Intelligence, on your terms.']; lengths: [39]
- og:description: ['Route models. Build in your terminal. Bring agents into your editor.']; lengths: [68]
- og:url: ['https://miawlabs.web.id/']; lengths: [24]
- og:image: []; lengths: []
- Canonical: ['https://miawlabs.web.id/']
- H1 count: 1
- JSON-LD scripts: 0

### /about/
- Title: 'About MiawLabs | Founder and Maintainer'
- description: ['MiawLabs founder and owner Sulistyo Fajar Pratama, known on GitHub as skutanjir. Official project and maintainer links.']; lengths: [119]
- viewport: ['width=device-width, initial-scale=1.0']; lengths: [37]
- robots: []; lengths: []
- og:title: []; lengths: []
- og:description: []; lengths: []
- og:url: []; lengths: []
- og:image: []; lengths: []
- Canonical: ['https://miawlabs.web.id/about']
- H1 count: 1
- JSON-LD scripts: 1

## Live /robots.txt
```text
User-agent: *
Allow: /

Sitemap: https://miawlabs.web.id/sitemap.xml

```

## Live /sitemap.xml
```text
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://miawlabs.web.id/</loc></url>
  <url><loc>https://miawlabs.web.id/about</loc></url>
  <url><loc>https://miawlabs.web.id/router/index.html</loc></url>
  <url><loc>https://miawlabs.web.id/code/index.html</loc></url>
  <url><loc>https://miawlabs.web.id/ide/index.html</loc></url>
</urlset>

```

## Local source inventory
- index.html: title='MiawLabs / Intelligence, on your terms.'; h1=1; images missing dimensions=['assets/miawcode-ide-icon.svg', 'assets/miawcode-icon.svg', 'assets/miawrouter-mascot-router.png']; blocking scripts=[{'defer': None, 'src': 'assets/landing.bundle.js'}]
- about\index.html: title='About MiawLabs | Founder and Maintainer'; h1=1; images missing dimensions=[]; blocking scripts=[]
- router\index.html: title='MiawRouter: Local AI Gateway'; h1=1; images missing dimensions=['../assets/miawrouter-mascot-router.png', '../assets/miawrouter-mascot-router.png', '../assets/miawcode-icon.svg', '../assets/miawrouter-mascot-router.png']; blocking scripts=[]
- code\index.html: title='MiawCode: Terminal Coding Agent'; h1=1; images missing dimensions=['../assets/miawcode-icon.svg', '../assets/miawrouter-mascot-router.png', '../assets/miawcode-ide-icon.svg', '../assets/miawcode-icon.svg']; blocking scripts=[]
- ide\index.html: title='MiawCode IDE: Desktop Workspace'; h1=1; images missing dimensions=['../assets/miawcode-ide-icon.svg', '../assets/miawcode-icon.svg', '../assets/miawrouter-mascot-router.png', '../assets/miawcode-ide-icon.svg']; blocking scripts=[]

## Live internal-link checks
- https://miawlabs.web.id/: 200 https://miawlabs.web.id/; exit 0
- https://miawlabs.web.id/about/index.html: 200 https://miawlabs.web.id/about/index.html; exit 0
- https://miawlabs.web.id/code/index.html: 200 https://miawlabs.web.id/code/index.html; exit 0
- https://miawlabs.web.id/ide/index.html: 200 https://miawlabs.web.id/ide/index.html; exit 0
- https://miawlabs.web.id/index.html: 200 https://miawlabs.web.id/index.html; exit 0
- https://miawlabs.web.id/router/index.html: 200 https://miawlabs.web.id/router/index.html; exit 0

## Images over 200 KB before changes
- assets\miawrouter-banner.png: 722235 bytes
- assets\readme-assembly.gif: 929574 bytes

## Identity and schema observations
- About source contains plain HTML founder and owner text for Sulistyo Fajar Pratama and a matching Person/Organization graph.
- Homepage has no JSON-LD before this task. No email addresses are added.
- Existing local About link uses about/index.html for file URL compatibility.
- Canonicals and sitemap currently contain /about without a slash and product index.html URLs. Final canonical decisions are documented after evaluating the redirect evidence above.

## Corrections and canonical decision
- The landing script has a boolean defer attribute; the inventory above incorrectly classified the empty attribute as blocking. There are zero blocking executable head scripts.
- About variants and www return 200, with no Location headers or redirect loops. HTTPS directory URLs are real served endpoints. Use /about/, /router/, /code/, /ide/ as preferred canonicals; duplicate aliases remain served until host-level redirects are configured. No redirect support can be established from this static repository. This does not meet the requested alias-redirect criterion.
- Existing descriptions are unique but homepage (97) and About (119) are below 120 characters; product descriptions also need normalization. All pages have viewport and one H1.
- robots allows all and references the sitemap. Sitemap omits no real HTML page, but uses inconsistent alias URLs. No noindex found on the five source pages. All checked live internal links return 200.
- Every page is directly reachable from the homepage or its product section; About is linked in its footer. No orphan pages.
- Existing PNG banner is the only website image above 200 KB. The README GIF is not referenced by website HTML. Both will be compressed; exact sizes recorded in verification.
- About Person/Organization identity matches visible founder text. Homepage WebSite schema is missing. About social tags are missing. Existing local images are available for og:image.

## Compression results
- Website router banner: 233638-byte PNG replaced in HTML by 106218-byte WebP. Original PNG retained for existing external links.
- README animated GIF: 929574 bytes to 112825 bytes. Remains animated with 12 frames; smaller preview resolution.
