import re
import struct
import sys
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CSS_PATH = ROOT / "assets/style.css"
MIAWCLI_ASSETS = next((p for p in (ROOT.parent / "miawcli/miawcode-assets", Path("/mnt/Data/miawcli/miawcode-assets")) if p.exists()), ROOT.parent / "miawcli/miawcode-assets")
PAGES = {
    "index.html": ROOT / "index.html",
    "router/index.html": ROOT / "router/index.html",
    "code/index.html": ROOT / "code/index.html",
    "ide/index.html": ROOT / "ide/index.html",
}


def relative_luminance(hex_color):
    channels = [int(hex_color[i : i + 2], 16) / 255 for i in (1, 3, 5)]
    channels = [value / 12.92 if value <= 0.04045 else ((value + 0.055) / 1.055) ** 2.4 for value in channels]
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]


def contrast_ratio(foreground, background):
    lighter, darker = sorted(
        (relative_luminance(foreground), relative_luminance(background)), reverse=True
    )
    return (lighter + 0.05) / (darker + 0.05)


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags = []
        self.links = []
        self.stylesheets = []

    def handle_starttag(self, tag, attrs):
        self.tags.append(tag)
        values = dict(attrs)
        if tag in {"a", "img", "link"}:
            target = values.get("href") or values.get("src")
            if target:
                self.links.append(target)
        if tag == "link" and values.get("rel") == "stylesheet":
            self.stylesheets.append(values.get("href"))


def check_page(rel, path, required_fragments, errors):
    if not path.exists():
        errors.append(f"Missing file: {rel}")
        return

    content = path.read_text(encoding="utf-8")
    parser = PageParser()
    parser.feed(content)

    for tag in (("main", "footer", "h1") if rel == "index.html" else ("header", "nav", "main", "footer", "h1")):
        count = parser.tags.count(tag)
        if count != 1:
            errors.append(f"{rel} must contain exactly one <{tag}>; found {count}")

    if rel == "index.html":
        if "nav" in parser.tags:
            errors.append("Landing must not have a navbar")
        for fragment in ('src="assets/landing.bundle.js"', 'id="webgl"', 'data-mode="plan"', 'data-mode="agent"', 'data-mode="review"'):
            if fragment not in content:
                errors.append(f"Landing missing {fragment}")
        for asset in ("assets/landing.js", "assets/landing.bundle.js", "assets/landing.css", "assets/vendor/three.module.js", "assets/vendor/three.core.js", "assets/vendor/anime.esm.min.js"):
            if not (ROOT / asset).exists():
                errors.append(f"Missing landing dependency: {asset}")
    if "skip-link" not in content:
        errors.append(f"{rel} is missing the skip link")
    if "hero-scene" not in content:
        errors.append(f"{rel} is missing the shared 3D hero scene")
    if rel != "index.html" and "<script" in content.lower():
        errors.append(f"{rel} must remain JavaScript-free")
    if "\u2014" in content:
        errors.append(f"{rel} contains a forbidden em dash")
    stylesheet = "assets/landing.css" if rel == "index.html" else "assets/style.css"
    if not any(href and href.endswith(stylesheet) for href in parser.stylesheets):
        errors.append(f"{rel} does not load the shared stylesheet")

    for fragment in required_fragments:
        if fragment not in content:
            errors.append(f"{rel} is missing required content: {fragment}")

    for target in parser.links:
        if target.startswith(("http://", "https://", "mailto:", "#")):
            continue
        resolved = (path.parent / target.split("#", 1)[0]).resolve()
        if not resolved.exists():
            errors.append(f"Broken relative link in {rel}: {target}")


def png_size(path):
    data = path.read_bytes()
    if data[:8] != b"\x89PNG\r\n\x1a\n" or data[12:16] != b"IHDR":
        raise ValueError("not a PNG")
    return struct.unpack(">II", data[16:24])


def check_icon_contract(errors):
    svg_paths = [
        ROOT / "assets/miawlabs-icon.svg",
        ROOT / "assets/miawcode-icon.svg",
        ROOT / "assets/miawcode-ide-icon.svg",
        MIAWCLI_ASSETS / "source/miawcode-icon.svg",
    ]
    for path in svg_paths:
        if not path.exists():
            errors.append(f"Missing canonical icon: {path}")
            continue
        content = path.read_text(encoding="utf-8")
        if not re.search(r"<svg\b[^>]*viewBox=[\"']0 0 512 512[\"']", content):
            errors.append(f"{path} must use viewBox 0 0 512 512")
    miawcode_svg = ROOT / "assets/miawcode-icon.svg"
    source_svg = MIAWCLI_ASSETS / "source/miawcode-icon.svg"
    if miawcode_svg.exists() and source_svg.exists() and miawcode_svg.read_text(encoding="utf-8") != source_svg.read_text(encoding="utf-8"):
        errors.append("MiawCode site and CLI SVG sources must match")

    for rel in ("index.html", "code/index.html"):
        content = (ROOT / rel).read_text(encoding="utf-8")
        if "npm install -g miawcode@0.1.3" not in content:
            errors.append(f"{rel} is missing npm install command for miawcode@0.1.3")

    png_root = MIAWCLI_ASSETS
    if not png_root.exists():
        errors.append(f"Missing MiawCode asset directory: {png_root}")
        return
    for path in sorted(png_root.glob("icons/**/*.png")) + sorted(png_root.glob("favicons/*.png")):
        try:
            width, height = png_size(path)
        except (OSError, ValueError) as exc:
            errors.append(f"Invalid PNG {path}: {exc}")
            continue
        if width != height:
            errors.append(f"{path} must be square; found {width}x{height}")
        expected = 64 if path.parent.name == "favicons" else 128 if "128" in path.name else 256 if "256" in path.name else 512
        if (width, height) != (expected, expected):
            errors.append(f"{path} must be {expected}x{expected}; found {width}x{height}")


def main():
    errors = []
    check_icon_contract(errors)
    if not CSS_PATH.exists():
        print("FAIL: assets/style.css not found")
        return 1

    css = CSS_PATH.read_text(encoding="utf-8")
    required_css = {
        "bright canvas": r"--bg-canvas:\s*#f7fbff",
        "router accent": r"--accent-router:\s*#168bff",
        "code accent": r"--accent-code:\s*#f02f93",
        "IDE accent": r"--accent-ide:\s*#5c6de0",
        "3D perspective": r"\.hero-scene\s*\{[^}]*perspective:",
        "44px tap targets": r"min-height:\s*44px",
        "visible focus": r":focus-visible",
        "reduced motion": r"@media\s*\(prefers-reduced-motion:\s*reduce\)",
        "overflow protection": r"overflow-x:\s*hidden",
        "mobile navigation grid": r"\.site-nav\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)",
    }
    for label, pattern in required_css.items():
        if not re.search(pattern, css, re.DOTALL | re.IGNORECASE):
            errors.append(f"Missing CSS requirement: {label}")

    colors = dict(re.findall(r"(--[\w-]+):\s*(#[0-9a-f]{6})", css, re.IGNORECASE))
    for foreground in ("--text-strong", "--text-body", "--text-muted"):
        if foreground in colors and "--bg-canvas" in colors:
            ratio = contrast_ratio(colors[foreground], colors["--bg-canvas"])
            if ratio < 7:
                errors.append(f"{foreground} contrast is {ratio:.2f}:1; expected at least 7:1")

    requirements = {
        "index.html": ["MiawLabs", "MiawRouter", "MiawCode", "MiawCode IDE", "21128", "assets/miawlabs-icon.svg"],
        "router/index.html": ["MiawRouter", "1.2.3", "21128", "Installation", "SSE"],
        "code/index.html": ["MiawCode", "Build", "TUI", "Rust", "Bun", "PTY", "../assets/miawcode-icon.svg"],
        "ide/index.html": ["MiawCode IDE", "Subagent", "Code - OSS", "21188", "In Development", "../assets/miawcode-ide-icon.svg"],
    }
    for rel, path in PAGES.items():
        check_page(rel, path, requirements[rel], errors)

    if errors:
        print(f"FAIL ({len(errors)} issues):")
        for error in errors:
            print(f"  - {error}")
        return 1

    print("PASS: MiawLabs bright 3D design contract satisfied")
    return 0


if __name__ == "__main__":
    sys.exit(main())
