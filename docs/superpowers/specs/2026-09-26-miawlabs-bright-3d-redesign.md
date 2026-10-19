# MiawLabs Bright 3D Redesign

Date: 2026-09-26
Status: Approved visual direction, awaiting spec review

## Goal

Redesign all four static MiawLabs pages so they read as one product family with MiawRouter and MiawCode. Keep the site lightweight, accessible, and usable without JavaScript.

Pages in scope:

- `index.html`
- `router/index.html`
- `code/index.html`
- `ide/index.html`
- `assets/style.css`

## Approved Direction

Use a bright product-studio canvas with one focused 3D hero composition. The mascot sits on a shallow dock while product panels float around it in perspective. MiawRouter uses blue, MiawCode uses pink and cyan, and MiawCode IDE uses indigo.

The 3D treatment explains the product relationship. It does not decorate every section.

## Design Tokens

### Color

- Canvas: `#F7FBFF`
- Surface: `#FFFFFF`
- Primary ink: `#10213B`
- Secondary ink: `#40566D`
- Structural border: `#CADAE6`
- MiawRouter accent: `#168BFF`
- MiawCode accent: `#F02F93`
- MiawCode cyan: `#19B8D4`
- MiawCode IDE accent: `#5C6DE0`
- Accessible primary control: `#064A83`
- Accessible pink text: `#8C1459`
- Accessible indigo text: `#303B7A`

Brand colors may appear in non-text decoration. Text and controls use the darker accessible variants.

### Typography

- Display: `Trebuchet MS`, with platform fallbacks
- Body: `Aptos`, `Segoe UI`, with sans-serif fallbacks
- Technical data: `Cascadia Code`, `SFMono-Regular`, with monospace fallbacks

The display face carries product personality. Monospace is limited to commands, ports, status labels, and technical metadata.

### Geometry

- Cards use 10 to 14 pixel corners.
- Buttons use 7 to 9 pixel corners, not pills.
- Sections alternate between open editorial layouts, compact technical bands, and asymmetric product panels.
- Shadows appear only on the 3D hero and primary raised surfaces.

## Shared Page Chassis

Every page uses the same header, spacing scale, footer, button styles, focus treatment, and responsive rules.

The shared hero has two columns on wide screens:

1. Product-specific copy and actions.
2. A lightweight CSS perspective scene using existing brand assets.

On narrow screens, the copy appears first and the scene becomes a contained flat composition below it. Decorative panels never overlap readable text.

## Page Structure

### Overview

1. Combined MiawLabs hero with mascot hub and three floating product panels.
2. Three non-uniform product summaries for Router, Code, and IDE.
3. Existing system relationship content presented as a simpler architecture band.
4. Existing setup commands grouped by product.

### MiawRouter

1. Blue-led hero with mascot and gateway/provider panels.
2. Installation and endpoint commands.
3. Routing, cache, failover, and local runtime capabilities.
4. Dashboard image and request example.
5. Technical specifications.

### MiawCode

1. Pink and cyan hero using the existing MiawCode symbol with terminal and agent panels.
2. Source build commands.
3. Split-footer TUI explanation.
4. Tool, provider, and security capabilities.
5. Technical specifications.

### MiawCode IDE

1. Indigo hero using the MiawCode symbol with editor and subagent panels.
2. Development status and caveats.
3. Existing subagent registry.
4. Workspace layout.
5. Technical specifications.

## 3D And Motion

Use CSS `perspective`, `rotateX`, `rotateY`, and layered shadows. Do not add WebGL, canvas, Three.js, or a JavaScript animation runtime.

One slow scene animation may move the mascot and panels by a few pixels. `prefers-reduced-motion: reduce` disables it. Hover transforms apply only to links or cards that are actually interactive.

## Copy

Preserve verified technical content. Shorten headings and actions where the current wording is repetitive. Do not add customer claims, performance claims, or unsupported statistics.

Refresh the MiawRouter version label from the local `package.json` because the current MiawLabs copy is stale. Leave other counts unchanged unless the local source provides one unambiguous replacement.

## Accessibility

- Keep the skip link and semantic landmarks.
- Maintain visible keyboard focus on every link and control.
- Use 44 pixel minimum tap targets in navigation and buttons.
- Meet WCAG AAA contrast for body text and interactive labels.
- Keep decorative images empty-alt and meaningful product images descriptive.
- Preserve readable content when CSS transforms or animation are unavailable.

## Responsive Behavior

- Desktop: two-column hero and layered perspective scene.
- Tablet: reduced scene scale and two-column content where space allows.
- Mobile: single-column flow, horizontal navigation scroll if needed, flat product panels, no page overflow.
- Long commands scroll inside their own code blocks instead of widening the page.

## Verification

Update the existing Python verification script to check:

- all four pages load the shared stylesheet;
- relative links and assets resolve;
- required semantic landmarks and skip links remain present;
- minimum tap-target and reduced-motion rules exist;
- the approved bright tokens and 3D scene classes exist;
- no horizontal overflow appears at the supported mobile width.

Run the script and inspect the four pages at desktop and mobile sizes before completion.

## Explicit Non-Goals

- No framework migration.
- No new dependencies.
- No dark theme.
- No JavaScript carousel, canvas, WebGL, or fake interactive controls.
- No new product features or speculative content.
