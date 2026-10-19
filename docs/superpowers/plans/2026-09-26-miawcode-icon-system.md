# MiawCode Icon System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ship a Soft 3D Tile icon family for MiawLabs, MiawCode, and MiawCode IDE, publish consistent square MiawCode PNG variants, and make the site documentation match `miawcode@0.1.0`.

**Architecture:** Keep SVG as the canonical icon source. Generate raster variants with an installed native converter, then reference the canonical site SVGs and generated PNGs from existing static HTML. Extend the existing Python verifier instead of adding a test framework.

**Tech Stack:** Static HTML5, CSS, SVG, Python 3 standard library, ImageMagick `convert` or `rsvg-convert` already installed.

## Global Constraints

- Keep MiawRouter's `assets/miawrouter-mascot-router.png` unchanged.
- Use Soft 3D Tile geometry: rounded tile, restrained surface gradient, lower depth edge, one soft shadow.
- Keep `npm install -g miawcode@0.1.0` as the primary MiawCode install path.
- Preserve source-build commands as a secondary contributor path.
- Keep pages JavaScript-free, relative-link safe, responsive, keyboard accessible, and dependency-free.
- Use square raster outputs: base 512x512, 128 variants 128x128, 256 variants 256x256, favicons 64x64.

### Task 1: Extend the failing verifier

**Files:**
- Modify: `tests/verify-chassis-blade.py`

**Interfaces:**
- Consumes the existing page map and MiawCode asset tree.
- Produces deterministic failures for missing canonical SVGs, npm copy, and wrong PNG dimensions.

- [ ] **Step 1: Add SVG, npm, and raster assertions**

Add standard-library checks for the three site SVGs plus the MiawCode source SVG, exact `viewBox="0 0 512 512"`, the exact npm command in `index.html` and `code/index.html`, and expected dimensions for every file under `miawcode-assets/icons` and `miawcode-assets/favicons`.

- [ ] **Step 2: Run the verifier and confirm it fails**

Run `rtk python3 tests/verify-chassis-blade.py`.

Expected: FAIL because the canonical SVGs, npm copy, and square PNG outputs are not present yet.

### Task 2: Create canonical icon sources

**Files:**
- Create: `assets/miawlabs-icon.svg`
- Create: `assets/miawcode-icon.svg`
- Create: `assets/miawcode-ide-icon.svg`
- Create: `/mnt/Data/miawcli/miawcode-assets/source/miawcode-icon.svg`

**Interfaces:**
- Each SVG is standalone, uses `viewBox="0 0 512 512"`, and has no external image/font dependency.
- The MiawCode CLI source SVG is byte-equivalent to the MiawLabs MiawCode icon source.

- [ ] **Step 1: Add minimal SVG geometry**

Use one rounded-square tile per icon, a lower depth path, a restrained gradient, and product-specific marks. Keep paths thick enough to remain readable at 64px.

- [ ] **Step 2: Run SVG-only verifier checks**

Run `rtk python3 tests/verify-chassis-blade.py` and confirm the remaining failures are raster outputs and page copy only.

### Task 3: Generate and install MiawCode raster variants

**Files:**
- Modify: `/mnt/Data/miawcli/miawcode-assets/icons/app/*.png`
- Modify: `/mnt/Data/miawcli/miawcode-assets/icons/symbol/*.png`
- Modify: `/mnt/Data/miawcli/miawcode-assets/icons/circle/*.png`
- Modify: `/mnt/Data/miawcli/miawcode-assets/favicons/*.png`

**Interfaces:**
- All generated files are square PNGs with the dimensions encoded by their filenames.
- Light/dark files share the icon geometry while preserving readable tile contrast.

- [ ] **Step 1: Generate the app, symbol, circle, and favicon files**

Render the same full-tile source SVG into every existing app, symbol, circle, and favicon filename. This deliberately removes the current inconsistent crops; the directory names remain for compatibility only.

- [ ] **Step 2: Check dimensions**

Run `rtk identify /mnt/Data/miawcli/miawcode-assets/icons/app/*.png /mnt/Data/miawcli/miawcode-assets/icons/symbol/*.png /mnt/Data/miawcli/miawcode-assets/icons/circle/*.png /mnt/Data/miawcli/miawcode-assets/favicons/*.png` and `rtk python3 tests/verify-chassis-blade.py`.

Expected: all raster assertions pass.

### Task 4: Update static pages and README

**Files:**
- Modify: `index.html`
- Modify: `code/index.html`
- Modify: `ide/index.html`
- Modify: `router/index.html`
- Modify: `README.md`

**Interfaces:**
- Existing relative page links remain valid.
- MiawRouter keeps its existing mascot references.
- MiawLabs overview and MiawCode page contain `npm install -g miawcode@0.1.0`.

- [ ] **Step 1: Replace stale icon references**

Use `miawlabs-icon.svg` for the overview brand/favicons, `miawcode-icon.svg` for MiawCode, and `miawcode-ide-icon.svg` for the IDE. Keep MiawRouter on `favicon.svg` and its existing mascot.

- [ ] **Step 2: Correct MiawCode install copy**

Lead with the npm install command, move source build under a contributor/source section, and remove the stale “no npm package” claims from README and page text.

- [ ] **Step 3: Run the full verifier**

Run `rtk python3 tests/verify-chassis-blade.py`.

Expected: PASS with no broken relative references.

### Task 5: Browser verification

**Files:**
- No source changes unless a real check exposes a regression.

- [ ] **Step 1: Serve the site**

Run `rtk python3 -m http.server 8000` from `/mnt/Data/miawlabs`.

- [ ] **Step 2: Check desktop and mobile pages**

Use Playwright on all four pages at 1440x900 and 390x844. Verify HTTP 200, no horizontal overflow, visible focus ring, icon loading, and no missing-image requests.

- [ ] **Step 3: Inspect generated PNGs**

Open the MiawCode app and favicon variants and confirm the Soft 3D Tile remains legible at small sizes.
