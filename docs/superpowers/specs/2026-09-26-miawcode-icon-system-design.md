# MiawCode Icon System

## Goal

Give MiawLabs, MiawCode, and MiawCode IDE a coherent Soft 3D Tile icon family while keeping MiawRouter's existing mascot. Make the public MiawCode instructions match the published npm package `miawcode@0.1.0`.

## Visual direction

- **MiawLabs:** pale blue tile with the cat hub mark and three product signals: blue router node, pink code mark, indigo IDE window.
- **MiawCode:** dark navy tile with pink code brackets and a cyan slash. The high-contrast mark stays legible at favicon size.
- **MiawCode IDE:** pale indigo editor-window tile containing the shared MiawCode mark, distinguishing the desktop product without inventing a separate mascot.
- All tiles use one rounded-square silhouette, restrained surface gradient, a lower edge for depth, and one soft shadow. The 3D treatment is an identity cue, not a decorative background effect.

## Source and generated assets

Canonical SVG files:

- `assets/miawlabs-icon.svg`
- `assets/miawcode-icon.svg`
- `assets/miawcode-ide-icon.svg`
- `/mnt/Data/miawcli/miawcode-assets/source/miawcode-icon.svg`

The MiawCode source SVG is the single source for its app, symbol, circle, and favicon PNG variants. Generated files remain square and match their names:

- Base assets: 512x512
- `icon-128`, `symbol-128`, `circle-128`: 128x128
- `icon-256`, `symbol-256`, `circle-256`: 256x256
- Favicons: 64x64, consistently square

Both light and dark variants are generated from the same geometry with the intended tile/background contrast.

## Site integration

- Add a favicon and an icon reference to each MiawLabs page header.
- Use the MiawCode SVG in the overview and MiawCode product page where the old cropped PNG appears.
- Keep `assets/miawrouter-mascot-router.png` unchanged.
- Preserve relative paths so filesystem, subpath hosting, and static hosting continue to work.

## Copy and package corrections

- Overview and MiawCode page lead with `npm install -g miawcode@0.1.0`.
- README identifies MiawCode as an npm package at version `0.1.0`.
- Existing source-build instructions stay as an optional contributor path, not the primary install path.
- Remove claims that MiawCode has no npm package or release.

## Verification

Update `tests/verify-chassis-blade.py` to check:

1. Each canonical SVG has an SVG root and square viewBox.
2. MiawLabs HTML references resolve to existing icons and favicons.
3. The overview and MiawCode page contain the exact npm install command.
4. Every MiawCode PNG variant is square and has the expected filename dimensions.
5. Existing router mascot and responsive/link checks remain intact.

No frameworks, runtime JavaScript, new dependencies, or icon libraries are added.
