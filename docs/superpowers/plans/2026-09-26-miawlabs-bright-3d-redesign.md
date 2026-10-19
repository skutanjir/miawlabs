# MiawLabs Bright 3D Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign all four MiawLabs pages as a bright, responsive product family with one lightweight CSS 3D hero system.

**Architecture:** Keep the existing static HTML structure and one shared stylesheet. Reuse existing brand images, use CSS perspective for the hero scenes, and keep the site functional without JavaScript.

**Tech Stack:** HTML5, CSS3, Python standard-library verification

## Global Constraints

- Modify only the four page files, `assets/style.css`, `tests/verify-chassis-blade.py`, and the synchronized `DESIGN.md` direction document.
- No new dependencies.
- Add no framework, package, remote font, JavaScript runtime, canvas, WebGL, or Three.js.
- Use the approved bright tokens from `docs/superpowers/specs/2026-09-26-miawlabs-bright-3d-redesign.md`.
- Preserve verified technical content and all working relative links.
- Keep keyboard focus, skip links, semantic landmarks, reduced motion, 44 pixel tap targets, and mobile overflow protection.
- The directory is not a Git repository, so tasks end with verification instead of commits.

---

### Task 1: Replace The Old Visual Verification Contract

**Files:**
- Modify: `tests/verify-chassis-blade.py`
- Test: `tests/verify-chassis-blade.py`

**Interfaces:**
- Consumes: the four page files and `assets/style.css`
- Produces: one executable static-site check with exit code 0 on success

- [ ] **Step 1: Rewrite the assertions for the approved design**

Keep the existing relative-link scan and replace old dark chassis requirements with checks for:

```python
required_css = [
    "--bg-canvas: #f7fbff",
    "--accent-router: #168bff",
    "--accent-code: #f02f93",
    "--accent-ide: #5c6de0",
    "perspective:",
    "prefers-reduced-motion: reduce",
    "min-height: 44px",
    "overflow-x: hidden",
]

required_page_fragments = {
    "index.html": ["MiawLabs", "hero-scene", "MiawRouter", "MiawCode", "MiawCode IDE"],
    "router/index.html": ["MiawRouter", "hero-scene", "21128", "Installation"],
    "code/index.html": ["MiawCode", "hero-scene", "Build", "TUI"],
    "ide/index.html": ["MiawCode IDE", "hero-scene", "Subagent", "Code - OSS"],
}
```

Also assert that each page contains a skip link, header, navigation, main, footer, one `h1`, and the shared stylesheet reference.

- [ ] **Step 2: Run the new check against the old pages**

Run: `rtk python3 tests/verify-chassis-blade.py`

Expected: FAIL because the approved bright tokens and shared 3D scene classes do not exist yet.

### Task 2: Build The Shared Bright Design System

**Files:**
- Modify: `assets/style.css`
- Test: `tests/verify-chassis-blade.py`

**Interfaces:**
- Consumes: existing class names that remain useful, existing image assets
- Produces: shared layout, typography, navigation, hero, 3D scene, content, code, table, footer, and responsive classes

- [ ] **Step 1: Replace the old dark token set**

Define these root tokens exactly:

```css
:root {
  --bg-canvas: #f7fbff;
  --bg-surface: #ffffff;
  --text-strong: #10213b;
  --text-body: #40566d;
  --border: #cadae6;
  --accent-router: #168bff;
  --accent-code: #f02f93;
  --accent-code-cyan: #19b8d4;
  --accent-ide: #5c6de0;
  --control-primary: #064a83;
  --text-code: #8c1459;
  --text-ide: #303b7a;
}
```

- [ ] **Step 2: Implement the shared page chassis**

Add styles for:

```text
.site-header .nav-container .brand-link .site-nav .nav-link
.page-main .page-hero .hero-copy .eyebrow .hero-actions
.section-shell .section-heading .editorial-grid .feature-list
.code-panel .fact-table .figure-container .site-footer
```

Use `Trebuchet MS` for display headings, `Aptos` or `Segoe UI` for body copy, and `Cascadia Code` or `SFMono-Regular` for technical text.

- [ ] **Step 3: Implement the reusable 3D hero scene**

Add one reusable `.hero-scene` with `.scene-dock`, `.scene-mascot`, and `.scene-panel` variants. Use CSS `perspective`, `rotateX`, `rotateY`, and shadows. Limit motion to one slow scene drift and disable it inside `prefers-reduced-motion: reduce`.

- [ ] **Step 4: Implement responsive and accessibility rules**

At `900px`, reduce scene scale and section columns. At `700px`, stack the hero, flatten panel transforms, allow navigation to scroll horizontally, and keep code blocks internally scrollable. Preserve visible `:focus-visible` outlines and 44 pixel controls.

- [ ] **Step 5: Run the verifier**

Run: `rtk python3 tests/verify-chassis-blade.py`

Expected: FAIL only on page markup requirements because the HTML still uses the old structure.

### Task 3: Rebuild The Overview Page

**Files:**
- Modify: `index.html`
- Test: `tests/verify-chassis-blade.py`

**Interfaces:**
- Consumes: the shared classes from Task 2
- Produces: the combined MiawLabs landing page and canonical navigation/footer markup for product pages

- [ ] **Step 1: Replace the header and hero**

Use the approved two-column hero copy and a combined scene with the mascot on the dock plus three labeled panels:

```html
<div class="hero-scene hero-scene-labs" aria-hidden="true">
  <div class="scene-panel scene-panel-router">MiawRouter</div>
  <div class="scene-panel scene-panel-code">MiawCode</div>
  <div class="scene-panel scene-panel-ide">MiawCode IDE</div>
  <div class="scene-dock"></div>
  <img class="scene-mascot" src="assets/miawrouter-mascot-router.png" alt="">
</div>
```

Use action labels that name their destination, such as `View MiawRouter` and `Build MiawCode`.

- [ ] **Step 2: Recompose the existing content**

Keep the product facts, architecture explanation, images, commands, and links. Present the three products as an asymmetric editorial grid, simplify the architecture diagram section, and group setup commands by product.

- [ ] **Step 3: Run the verifier**

Run: `rtk python3 tests/verify-chassis-blade.py`

Expected: the overview requirements pass; product-page requirements still fail.

### Task 4: Rebuild The Three Product Pages

**Files:**
- Modify: `router/index.html`
- Modify: `code/index.html`
- Modify: `ide/index.html`
- Test: `tests/verify-chassis-blade.py`

**Interfaces:**
- Consumes: canonical header/footer markup from Task 3 and shared styles from Task 2
- Produces: three consistent product pages with distinct accents and product-specific 3D scenes

- [ ] **Step 1: Rebuild the MiawRouter page**

Use `product-router` on `body`, a blue-led hero, the mascot, and gateway/provider panels. Keep installation, endpoint, architecture, dashboard, API example, and specification content. Update the displayed version to `1.1.9`, matching `/mnt/Data/miawrouter/package.json`.

- [ ] **Step 2: Rebuild the MiawCode page**

Use `product-code` on `body`, pink and cyan accents, `../assets/miawcode-symbol-128-dark.png`, and terminal/agent panels. Keep build commands, TUI architecture, tools, security, and specification content.

- [ ] **Step 3: Rebuild the MiawCode IDE page**

Use `product-ide` on `body`, indigo accents, the MiawCode symbol, and editor/subagent panels. Keep development caveats, the 30-profile registry, workspace layout, and specifications.

- [ ] **Step 4: Run the verifier**

Run: `rtk python3 tests/verify-chassis-blade.py`

Expected: PASS with no broken local links or missing design requirements.

### Task 5: Final Visual And Accessibility Verification

**Files:**
- Modify if required: the six files already listed
- Test: `tests/verify-chassis-blade.py`

**Interfaces:**
- Consumes: the completed static site
- Produces: verified desktop and mobile output

- [ ] **Step 1: Run the complete static check**

Run: `rtk python3 tests/verify-chassis-blade.py`

Expected: `PASS` and exit code 0.

- [ ] **Step 2: Serve the site locally**

Run: `rtk python3 -m http.server 8765`

Open `http://127.0.0.1:8765/` and inspect the overview plus all three product pages.

- [ ] **Step 3: Verify desktop and mobile presentation**

Check at approximately 1440 by 900 and 390 by 844. Confirm no horizontal page overflow, readable commands, visible focus rings, non-overlapping hero content, and flattened mobile scene panels.

- [ ] **Step 4: Re-run verification after any visual correction**

Run: `rtk python3 tests/verify-chassis-blade.py`

Expected: `PASS` and exit code 0.
