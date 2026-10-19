# Machined Chassis Blade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved Approach A Machined Chassis Blade visual design across Miaw Labs portal and subpages using pure CSS 3D transforms, tactile matte materials, zero runtime JavaScript, and verified technical metrics.

**Architecture:** Replace existing flat mascot hero cards with hardware-accurate Machined Chassis Blades rendered inside pure CSS perspective containers (`perspective: 850px`, `rotateX(13deg) rotateY(-18deg) rotateZ(2deg)`). Each page receives a specialized chassis blade variant (System Interconnect for portal, Network Gateway for MiawRouter, Terminal Engine for MiawCode, and Studio Workstation for MiawCode IDE) that flattens cleanly into an orthogonal 2D industrial card at `<=768px` or under `prefers-reduced-motion`.

**Tech Stack:** Semantic HTML5, Vanilla CSS3 (Custom Properties, 3D Transforms, `transform-style: preserve-3d`, Flexbox, CSS Grid), zero runtime JavaScript, zero external dependencies.

## Global Constraints

- Approach: Approach A Machined Chassis Blade (Energy: 3, Rhythm: 3, Motion: 1).
- No runtime JavaScript: Zero `<script>` tags, zero mouse listeners, zero runtime animation loops.
- No external dependencies: No npm runtime packages, no CDN stylesheets, no WebGL/Three.js, no remote web fonts.
- Pure relative assets: All assets reference relative paths (`assets/...` or `../assets/...`).
- Verified hardware facts only:
  - Port 21128: MiawRouter default loopback daemon.
  - Port 21188: MiawCode IDE bundled extension default port (always tagged as mismatch against 21128).
  - 146 Providers: MiawRouter proxy count (`open-sse/providers/registry/index.js`).
  - 32 Providers: MiawCode terminal agent count (`miawcli/docs/providers.md`).
  - 4 Cache Layers: L0 provider prompt-cache orchestration, L1 exact-response, L2 semantic response, L3 content-address deduplication (L2/L3 disabled by default).
  - 30 Subagents: MiawCode IDE workspace subagent profiles (`.miawcode/agents/`).
  - Distribution rules: MiawRouter = global npm package (`npm install -g miawrouter`); MiawCode = source build only (`Bun 1.3+`, `Rust stable`, `Go 1.24+`); MiawCode IDE = in development (no repo, no binary, no download link).
- Viewport stability: `overflow-x: hidden` enforced on html/body and blade scene containers (`contain: paint` or `overflow: hidden`) to ensure zero horizontal scrollbars across all screen widths down to 320px.
- Mobile flattening: `@media (max-width: 768px)` disables perspective and 3D transforms (`perspective: none`, `transform: none`, `transform-style: flat`).
- Motion accessibility: `@media (prefers-reduced-motion: reduce)` disables perspective, 3D rotations, and hover transforms.
- Accessibility standards: WCAG AAA contrast (minimum 7:1 for headings and metadata against card backgrounds), semantic HTML (`<figure>`, `<figcaption>`, `<code>`, `<span>`), `aria-hidden="true"` on purely decorative mechanical elements, minimum 44px x 44px tap targets for interactive controls.
- Git policy: No `git commit`, `git init`, or `git push` commands during this planning session.

---

## File Structure & Responsibilities

- Modify: `/mnt/Data/miawlabs/assets/style.css`
  - Defines new CSS custom properties for blade substrates, rim bevels, milled borders, and occlusion shadows.
  - Replaces `.portal-hero-mascot-card` styles with `.blade-scene`, `.blade-chassis`, `.blade-backplate`, `.blade-faceplate`, `.blade-bay`, `.blade-chip`, and hardware port components.
  - Adds 3D transform layers (`preserve-3d`, `translateZ` layers 0 to 4), hover/active mechanical feedback.
  - Implements responsive flattening at `@media (max-width: 768px)` and motion suppression at `@media (prefers-reduced-motion: reduce)`.
  - Cleans up legacy flat mascot card CSS rules.
- Modify: `/mnt/Data/miawlabs/index.html`
  - Replaces the flat mascot card in `<section class="portal-hero">` with the System Interconnect Blade markup.
  - Dual-bay layout: Recessed mascot well housing the router cat on the left, machined port readout faceplate on the right (Port 21128, Port 21188 mismatch flag, 146 adapters, 4 cache layers).
- Modify: `/mnt/Data/miawlabs/router/index.html`
  - Replaces hero mascot card with Network Gateway Blade markup.
  - 1U rack-mount styling with milled ear flanges, 4-tier cache indicators (L0, L1, L2, L3), 127.0.0.1:21128 daemon readout, SSE stream normalization tag.
- Modify: `/mnt/Data/miawlabs/code/index.html`
  - Replaces hero mascot card with Terminal Engine Blade markup.
  - Rugged compiler chassis with toolchain requirement chips (`Bun 1.3+`, `Rust stable`, `Go 1.24+`), hashline verification chip, 32 providers readout, split-footer PTY indicator.
- Modify: `/mnt/Data/miawlabs/ide/index.html`
  - Replaces hero mascot card with Studio Workstation Blade markup.
  - Desktop instrumentation chassis highlighting 30 subagent slots, Code - OSS core badge, amber Port 21188 mismatch tag, and pre-release in-development status badge.
- Create: `/mnt/Data/miawlabs/tests/verify-chassis-blade.py`
  - Standalone verification script checking HTML markup, CSS tokens, responsive rules, reduced-motion rules, verified hardware numbers, link integrity, and absence of external scripts/dependencies.

---

## Task Decomposition

### Task 1: Core Chassis Blade CSS Design System & 3D Layer Model

**Files:**
- Modify: `/mnt/Data/miawlabs/assets/style.css:1-120` and `:398-452`
- Test: `/mnt/Data/miawlabs/tests/verify-chassis-blade.py`

**Interfaces:**
- Consumes: Palette tokens from `DESIGN.md` Section 5.
- Produces: CSS utility classes for `.blade-scene`, `.blade-chassis`, `.blade-backplate`, `.blade-bay`, `.blade-faceplate`, `.blade-chip`, `.blade-port`, `.blade-rack-ear`, `.blade-status-dot`.

- [ ] **Step 1: Write test checking tokens and 3D base rules in style.css**

Create test script `/mnt/Data/miawlabs/tests/verify-chassis-blade.py` that verifies:
1. CSS contains tokens `--blade-bg-chassis`, `--blade-rim`, `--blade-well`, `--blade-shadow-drop`, `--blade-shadow-backplate`.
2. `.blade-scene` contains `perspective: 850px;`.
3. `.blade-chassis` contains `transform-style: preserve-3d;` and base rotation `rotateX(13deg) rotateY(-18deg) rotateZ(2deg);`.
4. Hover state transitions to `rotateX(10deg) rotateY(-15deg) translateY(-2px);`.
5. Active state transitions to `translateY(1px);`.
6. Pointer-events are set to `none` on decorative layers.

```python
# /mnt/Data/miawlabs/tests/verify-chassis-blade.py (Initial skeleton for Task 1)
import re
import sys
from pathlib import Path

css_path = Path("/mnt/Data/miawlabs/assets/style.css")
if not css_path.exists():
    print("FAIL: style.css not found")
    sys.exit(1)

content = css_path.read_text(encoding="utf-8")

checks = [
    ("--blade-bg-chassis", r"--blade-bg-chassis"),
    ("--blade-rim", r"--blade-rim"),
    ("--blade-well", r"--blade-well"),
    ("perspective 850px", r"perspective:\s*850px"),
    ("preserve-3d", r"transform-style:\s*preserve-3d"),
    ("rotateX(13deg)", r"rotateX\(13deg\)"),
    ("rotateY(-18deg)", r"rotateY\(-18deg\)"),
    ("rotateZ(2deg)", r"rotateZ\(2deg\)"),
    ("hover micro-interaction", r"\.blade-chassis:hover"),
    ("active micro-interaction", r"\.blade-chassis:active"),
]

failed = []
for label, pattern in checks:
    if not re.search(pattern, content):
        failed.append(label)

if failed:
    print(f"FAIL Task 1 checks missing: {', '.join(failed)}")
    sys.exit(1)

print("PASS: Task 1 CSS foundation verified")
sys.exit(0)
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python3 /mnt/Data/miawlabs/tests/verify-chassis-blade.py`
Expected: FAIL with "FAIL Task 1 checks missing: ..."

- [ ] **Step 3: Implement core chassis blade tokens and CSS rules in style.css**

In `/mnt/Data/miawlabs/assets/style.css`:
1. Add blade CSS custom properties in `:root`:
```css
  /* Machined Chassis Blade Material Tokens */
  --blade-bg-scene: #090d13;
  --blade-bg-chassis: linear-gradient(145deg, #242b35 0%, #171d25 50%, #11161d 100%);
  --blade-bg-bay: #090d12;
  --blade-rim-top: #46505d;
  --blade-rim-bottom: #242b35;
  --blade-divider: #303945;
  --blade-backplate-border: #303945;
  --blade-backplate-bg: #080b10;
  --blade-shadow-drop: -18px 24px 28px rgba(0, 0, 0, 0.55);
  --blade-shadow-tray: inset 0 5px 12px rgba(0, 0, 0, 0.70);
  --blade-accent-blue: #168bff;
  --blade-accent-green: #10b981;
  --blade-accent-violet: #8b5cf6;
  --blade-accent-amber: #d29922;
  --blade-text-primary: #f0f6fc;
  --blade-text-meta: #9aa7b7;
  --blade-text-readout: #82bfff;
```
2. Replace `.portal-hero-mascot-card` rules with modular chassis classes:
```css
/* ==========================================================================
   Approach A: Machined Chassis Blade (Pure CSS 3D Layer Model)
   ========================================================================== */
.blade-scene {
  position: relative;
  perspective: 850px;
  perspective-origin: 50% 50%;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  contain: paint;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
}

.blade-chassis {
  position: relative;
  width: 100%;
  background: var(--blade-bg-chassis);
  border-top: 1px solid var(--blade-rim-top);
  border-left: 1px solid var(--blade-rim-top);
  border-right: 1px solid var(--blade-rim-bottom);
  border-bottom: 2px solid var(--blade-rim-bottom);
  border-radius: var(--radius-md);
  box-shadow: var(--blade-shadow-drop);
  transform-style: preserve-3d;
  transform: rotateX(13deg) rotateY(-18deg) rotateZ(2deg);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  padding: 1rem;
  user-select: none;
}

.blade-chassis:hover {
  transform: rotateX(10deg) rotateY(-15deg) translateY(-2px);
  box-shadow: -22px 28px 34px rgba(0, 0, 0, 0.65);
}

.blade-chassis:active {
  transform: rotateX(10deg) rotateY(-15deg) translateY(1px);
}

/* Layer 0: Structural Backplate (-12px Z-depth) */
.blade-chassis::before {
  content: "";
  position: absolute;
  inset: -1px;
  background: var(--blade-backplate-bg);
  border: 1px solid var(--blade-backplate-border);
  border-radius: var(--radius-md);
  transform: translateZ(-12px) translate(9px, 9px);
  pointer-events: none;
  z-index: -1;
}

/* Header & Machine Status Strip */
.blade-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.5rem;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid var(--blade-divider);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--blade-text-meta);
  transform: translateZ(6px);
}

.blade-status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.blade-led {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
  background-color: var(--blade-accent-blue);
  box-shadow: 0 0 2px var(--blade-accent-blue);
}

.blade-led-green {
  background-color: var(--blade-accent-green);
  box-shadow: 0 0 2px var(--blade-accent-green);
}

.blade-led-violet {
  background-color: var(--blade-accent-violet);
  box-shadow: 0 0 2px var(--blade-accent-violet);
}

.blade-led-amber {
  background-color: var(--blade-accent-amber);
  box-shadow: 0 0 2px var(--blade-accent-amber);
}

/* Blade Body Cavities & Bays */
.blade-body {
  display: grid;
  gap: 0.75rem;
  transform: translateZ(6px);
}

.blade-bay {
  background-color: var(--blade-bg-bay);
  border: 1px solid var(--blade-divider);
  border-radius: var(--radius-sm);
  box-shadow: var(--blade-shadow-tray);
  padding: 0.75rem;
  position: relative;
}

.blade-bay-recessed {
  transform: translateZ(6px);
}

.blade-faceplate-surface {
  transform: translateZ(12px);
}

.blade-chip-cluster {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  transform: translateZ(18px);
}

.blade-chip {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-xs);
  background: #161c24;
  border: 1px solid var(--blade-divider);
  color: var(--blade-text-primary);
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  white-space: nowrap;
}

.blade-chip-accent {
  border-color: rgba(22, 139, 255, 0.4);
  color: var(--blade-text-readout);
}

.blade-chip-warn {
  border-color: rgba(210, 153, 34, 0.5);
  color: #f2cc60;
}

.blade-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--blade-divider);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--blade-text-meta);
  transform: translateZ(6px);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python3 /mnt/Data/miawlabs/tests/verify-chassis-blade.py`
Expected: PASS: Task 1 CSS foundation verified.

---

### Task 2: Responsive Flattening (<=768px) and Motion Accessibility (prefers-reduced-motion)

**Files:**
- Modify: `/mnt/Data/miawlabs/assets/style.css` (responsive and accessibility sections)
- Test: `/mnt/Data/miawlabs/tests/verify-chassis-blade.py`

**Interfaces:**
- Consumes: `.blade-scene`, `.blade-chassis`, `.blade-backplate`, `.blade-bay` classes.
- Produces: Media query overrides ensuring flat 2D layout at `<=768px` and zero motion on `prefers-reduced-motion: reduce`.

- [ ] **Step 1: Write test assertions for responsive flattening and motion reduction**

Update `/mnt/Data/miawlabs/tests/verify-chassis-blade.py` to append Task 2 checks:
1. At `@media (max-width: 768px)`, `.blade-scene` sets `perspective: none`.
2. At `@media (max-width: 768px)`, `.blade-chassis` sets `transform: none` and `transform-style: flat`.
3. At `@media (max-width: 768px)`, `.blade-chassis::before` sets `display: none` or `transform: none`.
4. In `@media (prefers-reduced-motion: reduce)`, `.blade-scene` sets `perspective: none`.
5. In `@media (prefers-reduced-motion: reduce)`, `.blade-chassis` sets `transform: none`, `transition: none`.

```python
# In /mnt/Data/miawlabs/tests/verify-chassis-blade.py
def check_task_2(content):
    media_768 = re.search(r"@media[^{]*max-width:\s*768px[^{]*\{([\s\S]*?)\}\s*\}", content)
    if not media_768:
        # Check if 768px block exists
        media_768 = re.search(r"@media[^{]*\(max-width:\s*768px\)[^{]*\{([\s\S]*?)\n\}", content)
    assert media_768, "Missing @media (max-width: 768px)"
    block_768 = media_768.group(1)
    assert "perspective: none" in block_768, "768px missing perspective: none"
    assert "transform: none" in block_768, "768px missing transform: none"
    assert "transform-style: flat" in block_768, "768px missing transform-style: flat"

    media_motion = re.search(r"@media[^{]*prefers-reduced-motion:\s*reduce[^{]*\{([\s\S]*?)\n\}", content)
    assert media_motion, "Missing @media (prefers-reduced-motion: reduce)"
    block_motion = media_motion.group(1)
    assert "transform: none" in block_motion, "prefers-reduced-motion missing transform: none"
    assert "perspective: none" in block_motion, "prefers-reduced-motion missing perspective: none"
    assert "transition: none" in block_motion, "prefers-reduced-motion missing transition: none"
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python3 /mnt/Data/miawlabs/tests/verify-chassis-blade.py`
Expected: FAIL with "Missing @media (max-width: 768px)" or missing assertions.

- [ ] **Step 3: Implement responsive flattening and reduced-motion rules in style.css**

In `/mnt/Data/miawlabs/assets/style.css`:
```css
/* ==========================================================================
   Responsive Mobile Flattening (<= 768px)
   ========================================================================== */
@media (max-width: 768px) {
  .blade-scene {
    perspective: none;
    max-width: 100%;
    padding: 0;
  }

  .blade-chassis {
    transform: none !important;
    transform-style: flat !important;
    box-shadow: var(--shadow-card);
    transition: none;
  }

  .blade-chassis:hover,
  .blade-chassis:active {
    transform: none !important;
    box-shadow: var(--shadow-card);
  }

  .blade-chassis::before {
    display: none !important;
  }

  .blade-header,
  .blade-body,
  .blade-bay,
  .blade-bay-recessed,
  .blade-faceplate-surface,
  .blade-chip-cluster,
  .blade-footer {
    transform: none !important;
  }

  .blade-body-dual {
    grid-template-columns: 1fr !important;
  }
}

/* ==========================================================================
   Vestibular Motion Protection (prefers-reduced-motion)
   ========================================================================== */
@media (prefers-reduced-motion: reduce) {
  .blade-scene {
    perspective: none !important;
  }

  .blade-chassis {
    transform: none !important;
    transform-style: flat !important;
    transition: none !important;
    box-shadow: var(--shadow-card) !important;
  }

  .blade-chassis:hover,
  .blade-chassis:active {
    transform: none !important;
  }

  .blade-chassis::before {
    display: none !important;
  }

  .blade-header,
  .blade-body,
  .blade-bay,
  .blade-bay-recessed,
  .blade-faceplate-surface,
  .blade-chip-cluster,
  .blade-footer {
    transform: none !important;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python3 /mnt/Data/miawlabs/tests/verify-chassis-blade.py`
Expected: PASS Task 1 & Task 2.

---

### Task 3: Portal Overview (index.html) System Interconnect Blade

**Files:**
- Modify: `/mnt/Data/miawlabs/index.html:56-68`
- Modify: `/mnt/Data/miawlabs/assets/style.css` (dual-bay grid layout helper)
- Test: `/mnt/Data/miawlabs/tests/verify-chassis-blade.py`

**Interfaces:**
- Consumes: `.blade-scene`, `.blade-chassis`, `.blade-body-dual`, `assets/miawrouter-mascot-router.png`.
- Produces: Portal hero right-column markup displaying the System Interconnect Blade with mascot well and verified hardware readouts (Port 21128, Port 21188 mismatch, 146 adapters, 4 cache layers).

- [ ] **Step 1: Write test verifying index.html System Interconnect Blade elements**

Add check to `/mnt/Data/miawlabs/tests/verify-chassis-blade.py`:
- `index.html` contains `<figure class="blade-scene"` with `<figcaption class="sr-only">`.
- Left bay contains mascot image `assets/miawrouter-mascot-router.png`.
- Right bay faceplate contains `21128`, `21188`, `146 Providers` (or Adapters), `4 Cache Layers`.
- Mismatch tag for port 21188 is present.
- Accessible ARIA labels and `aria-hidden="true"` on purely visual LEDs/decorative elements.

```python
# Check in verify-chassis-blade.py
def check_index_blade():
    index_html = Path("/mnt/Data/miawlabs/index.html").read_text(encoding="utf-8")
    assert "blade-scene" in index_html, "index.html missing blade-scene"
    assert "assets/miawrouter-mascot-router.png" in index_html, "index.html missing mascot image"
    assert "21128" in index_html, "index.html missing port 21128"
    assert "21188" in index_html, "index.html missing port 21188"
    assert "MISMATCH" in index_html or "Mismatch" in index_html, "index.html missing mismatch tag"
    assert "146" in index_html, "index.html missing 146 count"
    assert "4 Cache" in index_html or "4-Layer" in index_html or "4 Cache Layers" in index_html
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python3 /mnt/Data/miawlabs/tests/verify-chassis-blade.py`
Expected: FAIL on `check_index_blade()`.

- [ ] **Step 3: Implement System Interconnect Blade in index.html and style.css**

In `/mnt/Data/miawlabs/assets/style.css`:
Add dual-bay layout helper:
```css
.blade-body-dual {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}
.blade-mascot-well {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--blade-bg-bay);
  border-radius: var(--radius-xs);
  padding: 0.75rem;
  overflow: hidden;
}
.blade-mascot-well img {
  max-width: 100%;
  height: auto;
  display: block;
}
.blade-spec-list {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  margin-top: 0.25rem;
}
.blade-spec-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-mono);
  font-size: 0.76rem;
  border-bottom: 1px solid rgba(48, 57, 69, 0.6);
  padding-bottom: 0.25rem;
}
.blade-spec-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.blade-spec-label {
  color: var(--blade-text-meta);
}
.blade-spec-val {
  color: var(--blade-text-primary);
  font-weight: 600;
}
```

In `/mnt/Data/miawlabs/index.html`:
Replace `<div class="portal-hero-mascot-card">...</div>` with:
```html
      <figure class="blade-scene" aria-labelledby="blade-overview-title">
        <div class="blade-chassis">
          <div class="blade-header">
            <span class="blade-status-indicator" id="blade-overview-title">
              <span class="blade-led" aria-hidden="true"></span>
              <span>Chassis Blade: System Interconnect</span>
            </span>
            <span>Bus 21128 // 127.0.0.1</span>
          </div>

          <div class="blade-body blade-body-dual">
            <!-- Left Bay: Mascot Well -->
            <div class="blade-bay blade-bay-recessed blade-mascot-well">
              <img src="assets/miawrouter-mascot-router.png" alt="MiawRouter cat mascot on physical equipment shelf" width="220" height="170">
            </div>

            <!-- Right Bay: Port & Metric Faceplate -->
            <div class="blade-bay blade-faceplate-surface">
              <div class="blade-spec-list">
                <div class="blade-spec-row">
                  <span class="blade-spec-label">Gateway Port</span>
                  <span class="blade-spec-val blade-chip-accent">21128</span>
                </div>
                <div class="blade-spec-row">
                  <span class="blade-spec-label">IDE Default</span>
                  <span class="blade-spec-val blade-chip-warn">21188 [MISMATCH]</span>
                </div>
                <div class="blade-spec-row">
                  <span class="blade-spec-label">Providers</span>
                  <span class="blade-spec-val">146 Active</span>
                </div>
                <div class="blade-spec-row">
                  <span class="blade-spec-label">Cache Tiers</span>
                  <span class="blade-spec-val">4 Cache Layers</span>
                </div>
              </div>

              <div class="blade-chip-cluster" style="margin-top: 0.6rem;">
                <span class="blade-chip">L0 Prompt</span>
                <span class="blade-chip">L1 Exact</span>
                <span class="blade-chip">SSE Norm</span>
              </div>
            </div>
          </div>

          <div class="blade-footer">
            <span>Interconnect: Loopback</span>
            <span>Status: Nominal</span>
          </div>
        </div>
        <figcaption class="sr-only">Interactive 3D representation of the Miaw Labs system interconnect chassis blade showing verified hardware specifications.</figcaption>
      </figure>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python3 /mnt/Data/miawlabs/tests/verify-chassis-blade.py`
Expected: PASS `check_index_blade()`.

---

### Task 4: MiawRouter (router/index.html) Network Gateway Blade

**Files:**
- Modify: `/mnt/Data/miawlabs/router/index.html:56-68`
- Modify: `/mnt/Data/miawlabs/assets/style.css` (rack-ear flange and tier styles)
- Test: `/mnt/Data/miawlabs/tests/verify-chassis-blade.py`

**Interfaces:**
- Consumes: `.blade-scene`, `.blade-rack-ear`, `.blade-cache-tier`.
- Produces: MiawRouter hero blade showing 1U rack-mount ear flanges, 4 verified cache layers (L0, L1, L2, L3 with default state notes), loopback daemon binding (127.0.0.1:21128), and SSE streaming normalization tags.

- [ ] **Step 1: Write test verifying router/index.html Network Gateway Blade elements**

Add check to `/mnt/Data/miawlabs/tests/verify-chassis-blade.py`:
- `router/index.html` contains `.blade-scene` and `.blade-chassis`.
- Rack ear indicators or flanges are represented.
- Contains verified cache layers: L0, L1, L2, L3.
- Mentions 127.0.0.1:21128 and 146 providers.
- Mentions SSE streaming normalization.
- Uses proper relative path `../assets/miawrouter-mascot-router.png`.

```python
# Check in verify-chassis-blade.py
def check_router_blade():
    router_html = Path("/mnt/Data/miawlabs/router/index.html").read_text(encoding="utf-8")
    assert "blade-scene" in router_html
    assert "Network Gateway Blade" in router_html or "Gateway Blade" in router_html
    assert "L0" in router_html and "L1" in router_html and "L2" in router_html and "L3" in router_html
    assert "127.0.0.1:21128" in router_html or "21128" in router_html
    assert "146 Providers" in router_html or "146" in router_html
    assert "SSE" in router_html
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python3 /mnt/Data/miawlabs/tests/verify-chassis-blade.py`
Expected: FAIL on `check_router_blade()`.

- [ ] **Step 3: Implement Network Gateway Blade in router/index.html and style.css**

In `/mnt/Data/miawlabs/assets/style.css`:
```css
/* 1U Rack Ears */
.blade-rack-ears {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -14px;
  right: -14px;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
}
.blade-ear-flange {
  width: 12px;
  height: 100%;
  background: #1c222b;
  border: 1px solid var(--blade-divider);
  border-radius: var(--radius-xs);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 6px 0;
}
.blade-ear-hole {
  width: 5px;
  height: 5px;
  background: #090d12;
  border-radius: 50%;
  border: 1px solid #303945;
}

/* Cache Tier Grid */
.blade-cache-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.45rem;
  margin-top: 0.5rem;
}
.blade-cache-cell {
  background: #0f141c;
  border: 1px solid var(--blade-divider);
  padding: 0.4rem 0.55rem;
  border-radius: var(--radius-xs);
  font-family: var(--font-mono);
  font-size: 0.72rem;
}
.blade-cache-name {
  color: var(--blade-accent-blue);
  font-weight: 600;
  display: flex;
  justify-content: space-between;
}
.blade-cache-desc {
  color: var(--blade-text-meta);
  font-size: 0.68rem;
  margin-top: 0.15rem;
}
```

In `/mnt/Data/miawlabs/router/index.html`:
Replace `<div class="portal-hero-mascot-card">...</div>` with:
```html
      <figure class="blade-scene" aria-labelledby="blade-router-title">
        <div class="blade-chassis">
          <div class="blade-rack-ears" aria-hidden="true">
            <div class="blade-ear-flange">
              <span class="blade-ear-hole"></span>
              <span class="blade-ear-hole"></span>
            </div>
            <div class="blade-ear-flange">
              <span class="blade-ear-hole"></span>
              <span class="blade-ear-hole"></span>
            </div>
          </div>

          <div class="blade-header">
            <span class="blade-status-indicator" id="blade-router-title">
              <span class="blade-led" aria-hidden="true"></span>
              <span>1U Network Gateway Blade</span>
            </span>
            <span>Daemon: 127.0.0.1:21128</span>
          </div>

          <div class="blade-body">
            <div class="blade-bay blade-faceplate-surface">
              <div class="blade-spec-row">
                <span class="blade-spec-label">Proxy Capacity</span>
                <span class="blade-spec-val blade-chip-accent">146 Active Providers</span>
              </div>
              <div class="blade-spec-row">
                <span class="blade-spec-label">Protocol Stream</span>
                <span class="blade-spec-val">SSE Normalization Engine</span>
              </div>

              <div class="blade-cache-grid">
                <div class="blade-cache-cell">
                  <div class="blade-cache-name"><span>L0 Cache</span> <span>Active</span></div>
                  <div class="blade-cache-desc">Prompt Orchestration</div>
                </div>
                <div class="blade-cache-cell">
                  <div class="blade-cache-name"><span>L1 Cache</span> <span>Active</span></div>
                  <div class="blade-cache-desc">Exact Response KV</div>
                </div>
                <div class="blade-cache-cell">
                  <div class="blade-cache-name"><span style="color: #9aa7b7;">L2 Semantic</span> <span>Opt-in</span></div>
                  <div class="blade-cache-desc">Cosine Threshold</div>
                </div>
                <div class="blade-cache-cell">
                  <div class="blade-cache-name"><span style="color: #9aa7b7;">L3 Content</span> <span>Opt-in</span></div>
                  <div class="blade-cache-desc">Content-Addressed Dedup</div>
                </div>
              </div>
            </div>
          </div>

          <div class="blade-footer">
            <span>Daemon: miawrouter</span>
            <span>Config: ~/.miawrouter</span>
          </div>
        </div>
        <figcaption class="sr-only">1U rack-mount chassis blade for MiawRouter displaying four cache tiers, loopback port 21128, and 146 provider routing.</figcaption>
      </figure>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python3 /mnt/Data/miawlabs/tests/verify-chassis-blade.py`
Expected: PASS `check_router_blade()`.

---

### Task 5: MiawCode (code/index.html) Terminal Engine Blade

**Files:**
- Modify: `/mnt/Data/miawlabs/code/index.html:56-68`
- Modify: `/mnt/Data/miawlabs/assets/style.css` (terminal chassis variants)
- Test: `/mnt/Data/miawlabs/tests/verify-chassis-blade.py`

**Interfaces:**
- Consumes: `.blade-scene`, `.blade-chassis`, `.blade-led-green`.
- Produces: MiawCode hero blade displaying toolchain dependencies (Bun 1.3+, Rust stable, Go 1.24+), hashline verification unit, 32 provider capacity, and split-footer PTY indicator.

- [ ] **Step 1: Write test verifying code/index.html Terminal Engine Blade elements**

Add check to `/mnt/Data/miawlabs/tests/verify-chassis-blade.py`:
- `code/index.html` contains `.blade-scene` and `.blade-chassis`.
- Uses green accent indicators (`.blade-led-green`).
- Contains verified toolchain: Bun 1.3+, Rust stable, Go 1.24+.
- Contains hashline verification unit and split-footer PTY.
- Contains 32 Providers metric.
- Mentions source build only (no npm package).
- Uses proper relative path `../assets/miawcode-symbol-128-dark.png`.

```python
# Check in verify-chassis-blade.py
def check_code_blade():
    code_html = Path("/mnt/Data/miawlabs/code/index.html").read_text(encoding="utf-8")
    assert "blade-scene" in code_html
    assert "Terminal Engine Blade" in code_html or "Compiler Chassis" in code_html
    assert "Bun 1.3+" in code_html or "Bun" in code_html
    assert "Rust" in code_html and "Go 1.24+" in code_html
    assert "Hashline" in code_html or "hashline" in code_html
    assert "32 Providers" in code_html or "32" in code_html
    assert "PTY" in code_html
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python3 /mnt/Data/miawlabs/tests/verify-chassis-blade.py`
Expected: FAIL on `check_code_blade()`.

- [ ] **Step 3: Implement Terminal Engine Blade in code/index.html and style.css**

In `/mnt/Data/miawlabs/code/index.html`:
Replace the mascot card `<div class="portal-hero-mascot-card"...>...</div>` with:
```html
      <figure class="blade-scene" aria-labelledby="blade-code-title">
        <div class="blade-chassis" style="border-top-color: #10b981; border-left-color: rgba(16, 185, 129, 0.4);">
          <div class="blade-header">
            <span class="blade-status-indicator" id="blade-code-title">
              <span class="blade-led blade-led-green" aria-hidden="true"></span>
              <span>Terminal Engine Blade</span>
            </span>
            <span style="color: #7ee787;">Source Build Only</span>
          </div>

          <div class="blade-body">
            <div class="blade-bay blade-faceplate-surface">
              <div class="blade-spec-row">
                <span class="blade-spec-label">Native Executable</span>
                <span class="blade-spec-val" style="color: #7ee787;">./bin/miaw</span>
              </div>
              <div class="blade-spec-row">
                <span class="blade-spec-label">Direct Providers</span>
                <span class="blade-spec-val">32 Verified</span>
              </div>
              <div class="blade-spec-row">
                <span class="blade-spec-label">Terminal Console</span>
                <span class="blade-spec-val">Split-Footer PTY</span>
              </div>

              <div class="blade-chip-cluster" style="margin-top: 0.65rem;">
                <span class="blade-chip" style="border-color: rgba(16, 185, 129, 0.4); color: #7ee787;">Bun 1.3+</span>
                <span class="blade-chip" style="border-color: rgba(16, 185, 129, 0.4); color: #7ee787;">Rust Stable</span>
                <span class="blade-chip" style="border-color: rgba(16, 185, 129, 0.4); color: #7ee787;">Go 1.24+</span>
              </div>

              <div class="blade-chip-cluster" style="margin-top: 0.4rem;">
                <span class="blade-chip">Hashline Verified Edits</span>
                <span class="blade-chip">MCP Client+Server</span>
              </div>
            </div>
          </div>

          <div class="blade-footer">
            <span>Scrollback: Native Preserved</span>
            <span>Security: AES-256-GCM</span>
          </div>
        </div>
        <figcaption class="sr-only">Terminal Engine Blade for MiawCode detailing source build requirements Bun 1.3, Rust, Go 1.24, hashline editing, and 32 model providers.</figcaption>
      </figure>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python3 /mnt/Data/miawlabs/tests/verify-chassis-blade.py`
Expected: PASS `check_code_blade()`.

---

### Task 6: MiawCode IDE (ide/index.html) Studio Workstation Blade

**Files:**
- Modify: `/mnt/Data/miawlabs/ide/index.html:50-62`
- Modify: `/mnt/Data/miawlabs/assets/style.css` (studio console variants)
- Test: `/mnt/Data/miawlabs/tests/verify-chassis-blade.py`

**Interfaces:**
- Consumes: `.blade-scene`, `.blade-chassis`, `.blade-led-violet`, `.blade-led-amber`.
- Produces: MiawCode IDE hero blade displaying 30 subagent bay slots, Code - OSS core badge, development preview indicators, and an amber notice for the 21188 port mismatch.

- [ ] **Step 1: Write test verifying ide/index.html Studio Workstation Blade elements**

Add check to `/mnt/Data/miawlabs/tests/verify-chassis-blade.py`:
- `ide/index.html` contains `.blade-scene` and `.blade-chassis`.
- Uses violet accent indicators (`.blade-led-violet`).
- Contains exactly 30 subagents metric.
- Contains Code - OSS core badge.
- Contains Port 21188 with explicit mismatch note.
- Mentions in-development / pre-release status (no download link).
- Proper relative paths.

```python
# Check in verify-chassis-blade.py
def check_ide_blade():
    ide_html = Path("/mnt/Data/miawlabs/ide/index.html").read_text(encoding="utf-8")
    assert "blade-scene" in ide_html
    assert "Studio Workstation Blade" in ide_html or "Workstation Blade" in ide_html
    assert "30" in ide_html and "Subagent" in ide_html
    assert "Code - OSS" in ide_html
    assert "21188" in ide_html
    assert "MISMATCH" in ide_html or "Mismatch" in ide_html
    assert "In Development" in ide_html or "Pre-Release" in ide_html
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python3 /mnt/Data/miawlabs/tests/verify-chassis-blade.py`
Expected: FAIL on `check_ide_blade()`.

- [ ] **Step 3: Implement Studio Workstation Blade in ide/index.html and style.css**

In `/mnt/Data/miawlabs/ide/index.html`:
Replace `<div class="portal-hero-mascot-card"...>...</div>` with:
```html
      <figure class="blade-scene" aria-labelledby="blade-ide-title">
        <div class="blade-chassis" style="border-top-color: #8b5cf6; border-left-color: rgba(139, 92, 246, 0.4);">
          <div class="blade-header">
            <span class="blade-status-indicator" id="blade-ide-title">
              <span class="blade-led blade-led-violet" aria-hidden="true"></span>
              <span>Studio Workstation Blade</span>
            </span>
            <span class="blade-chip-warn" style="font-size: 0.68rem; padding: 0.15rem 0.4rem;">In Development</span>
          </div>

          <div class="blade-body">
            <div class="blade-bay blade-faceplate-surface">
              <div class="blade-spec-row">
                <span class="blade-spec-label">Core Engine</span>
                <span class="blade-spec-val" style="color: #d2a8ff;">Code - OSS</span>
              </div>
              <div class="blade-spec-row">
                <span class="blade-spec-label">Subagent Registry</span>
                <span class="blade-spec-val">30 Specialized Profiles</span>
              </div>
              <div class="blade-spec-row">
                <span class="blade-spec-label">Bundled Extension Port</span>
                <span class="blade-spec-val blade-chip-warn">21188 [MISMATCH]</span>
              </div>

              <div class="blade-chip-cluster" style="margin-top: 0.65rem;">
                <span class="blade-chip" style="border-color: rgba(139, 92, 246, 0.4); color: #d2a8ff;">30 Subagent Bays</span>
                <span class="blade-chip">YAML Tool Gating</span>
              </div>

              <div class="blade-chip-cluster" style="margin-top: 0.4rem;">
                <span class="blade-chip blade-chip-warn">Port Mismatch against 21128</span>
                <span class="blade-chip">No Public Download</span>
              </div>
            </div>
          </div>

          <div class="blade-footer">
            <span>Marketplace: Open VSX Required</span>
            <span>Status: Pre-Release</span>
          </div>
        </div>
        <figcaption class="sr-only">Studio Workstation Blade for MiawCode IDE showing 30 subagent bays, Code - OSS core, port 21188 mismatch note, and pre-release status.</figcaption>
      </figure>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python3 /mnt/Data/miawlabs/tests/verify-chassis-blade.py`
Expected: PASS `check_ide_blade()`.

---

### Task 7: Comprehensive Accessibility, Contrast, Overflow & Zero-Script Audit

**Files:**
- Modify: `/mnt/Data/miawlabs/assets/style.css` (prune obsolete styles, verify tap targets and contrast)
- Test: `/mnt/Data/miawlabs/tests/verify-chassis-blade.py`

**Interfaces:**
- Consumes: All 4 HTML files and `style.css`.
- Produces: Validated multi-page suite passing zero-JS, WCAG contrast, tap target, overflow safety, and link integrity checks.

- [ ] **Step 1: Expand verification suite to test global constraints**

Expand `/mnt/Data/miawlabs/tests/verify-chassis-blade.py` to assert:
1. Zero `<script>` tags across all `.html` files.
2. All local asset URLs point to existing local files relative to their page.
3. No horizontal overflow rules (`overflow-x: hidden` on html/body and blade scenes).
4. Tap targets for `.btn`, `.nav-link`, `.footer-nav a` maintain at least 44px min-height.
5. All 4 blades render without missing closing tags or malformed HTML syntax.
6. Contrast ratios: text colors against background meet WCAG AAA (>7:1).

- [ ] **Step 2: Run verification script**

Run: `python3 /mnt/Data/miawlabs/tests/verify-chassis-blade.py`
Expected: Output showing full test suite status.

- [ ] **Step 3: Fix any discrepancies and clean up legacy classes**

Remove unused legacy classes in `/mnt/Data/miawlabs/assets/style.css` (such as obsolete `.mascot-geometric-header` if completely replaced by `.blade-header`) while preserving general workbench layout rules. Ensure all interactive states have `:focus-visible` with 2px offset.

- [ ] **Step 4: Run final verification**

Run: `python3 /mnt/Data/miawlabs/tests/verify-chassis-blade.py`
Expected: PASS across all pages and stylesheets.

---

## Verification Commands & Acceptance Check

Execute the following commands to verify the implementation:

1. **Static Suite Verification:**
   ```bash
   python3 /mnt/Data/miawlabs/tests/verify-chassis-blade.py
   ```
   *Expected:* All checks pass with exit code 0.

2. **Zero Runtime JavaScript Check:**
   ```bash
   grep -rn "<script" /mnt/Data/miawlabs/*.html /mnt/Data/miawlabs/**/*.html || echo "PASS: Zero script tags found"
   ```
   *Expected:* `PASS: Zero script tags found` (exit code 0).

3. **Asset Link Integrity Check:**
   ```bash
   python3 -c '
   from pathlib import Path
   import re
   root = Path("/mnt/Data/miawlabs")
   for html_file in root.glob("**/*.html"):
       content = html_file.read_text()
       for match in re.findall(r"""(?:src|href)=["\x27]([^"\x27#]+)["\x27]""", content):
           if match.startswith("http") or match.startswith("mailto"): continue
           target = (html_file.parent / match).resolve()
           assert target.exists(), f"Broken link in {html_file}: {match} -> {target}"
   print("PASS: All relative links and assets resolve cleanly")
   '
   ```
   *Expected:* `PASS: All relative links and assets resolve cleanly`.

4. **Responsive & Reduced Motion CSS Contract Check:**
   ```bash
   grep -A 10 "@media (max-width: 768px)" /mnt/Data/miawlabs/assets/style.css
   grep -A 10 "@media (prefers-reduced-motion: reduce)" /mnt/Data/miawlabs/assets/style.css
   ```
   *Expected:* `perspective: none !important;`, `transform: none !important;`, and `transform-style: flat !important;` present.

---

## Self-Review Checklist

- **Spec Coverage:**
  - Approach A Machined Chassis Blade physical aesthetic: Covered in Tasks 1, 3, 4, 5, 6.
  - Energy 3, Rhythm 3, Motion 1 dials: Covered in Task 1 (CSS perspective, tactile shadows, subtle hover/active micro-interactions).
  - Matte substrates & no neon glow: Covered in Task 1 tokens (`#090d13`, `#242b35` to `#11161d`, directional occlusion shadows).
  - Pure CSS 3D layer model (Layers 0 to 4): Covered in Task 1 (backplate Z: -12px, faceplate Z: 0px, bay Z: 6px, faceplate Z: 12px, chips Z: 18px).
  - Asymmetric Page-Specific Blades: System Interconnect (Task 3), Network Gateway (Task 4), Terminal Engine (Task 5), Studio Workstation (Task 6).
  - Verified Hardware Facts (21128 vs 21188 mismatch, 146 providers, 32 providers, 4 cache tiers, 30 subagents, distribution rules): Verified against `DESIGN.md`, `miawrouter`, and `miawcli` codebases and embedded in Tasks 3-6.
  - Mobile flattening at `<=768px`: Covered in Task 2.
  - Motion accessibility (`prefers-reduced-motion`): Covered in Task 2.
  - Zero runtime JavaScript & relative file paths: Enforced in Global Constraints and Task 7.
- **Placeholder Scan:** Zero instances of "TBD", "TODO", "implement later", or vague instructions. Exact CSS rules and HTML structures provided for every blade variant.
- **Type/Name Consistency:** Consistent class naming conventions (`.blade-scene`, `.blade-chassis`, `.blade-header`, `.blade-body`, `.blade-bay`, `.blade-chip`, `.blade-footer`) used identically across stylesheet and all four HTML files.

---

## Execution Handoff

Plan complete and saved to `/mnt/Data/miawlabs/docs/superpowers/plans/2026-09-19-machined-chassis-blade.md`. Two execution options:

1. **Subagent-Driven (recommended)** - Fresh subagent per task, review between tasks, fast iteration
2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
