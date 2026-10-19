"""Regenerate the README's animated, isometric product assembly with Pillow."""
import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
WIDTH, HEIGHT = 1000, 480
PAPER, INK, ACID = '#e8e9e1', '#20271f', '#d5f45a'


def font(size):
    for candidate in ('C:/Windows/Fonts/consola.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'):
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default(size=size)


def project(x, y, z):
    return (int(751 + x * 0.88 - z * 0.55), int(350 + x * 0.18 + z * 0.28 - y))


def render(phase):
    image = Image.new('RGB', (WIDTH, HEIGHT), PAPER)
    draw = ImageDraw.Draw(image)
    draw.line((42, 42, 958, 42), fill='#bec3b7')
    draw.text((43, 59), 'MIAWLABS / LOCAL INTELLIGENCE', font=font(13), fill=INK)
    draw.text((42, 143), 'YOUR MODELS.', font=font(43), fill=INK)
    draw.text((42, 196), 'YOUR MACHINE.', font=font(43), fill=INK)
    draw.text((42, 276), 'Route. Build. Review.', font=font(18), fill='#515a50')
    draw.rounded_rectangle((42, 328, 353, 372), radius=3, fill=INK)
    draw.text((57, 340), 'THREE TOOLS. ONE WORKFLOW.', font=font(14), fill=ACID)
    draw.ellipse((589, 344, 930, 406), fill='#d4d8cb')
    modules = [('ROUTER', 22, '#c7ddad', '#9baa8b'), ('CODE', 106, '#2f412e', '#172416'), ('IDE', 190, '#f4f5ec', '#bbc4ad')]
    for index, (name, y, top, edge) in enumerate(modules):
        lift = math.sin(phase + index * 1.9) * 13
        shift = math.sin(phase * 1.0 + index) * 9
        def point(x, height, z):
            return project(x + shift, height + y + lift, z)
        a, b, c, d = [point(x, 24, z) for x, z in ((-116, -78), (116, -78), (116, 78), (-116, 78))]
        aa, bb, cc, dd = [point(x, 0, z) for x, z in ((-116, -78), (116, -78), (116, 78), (-116, 78))]
        draw.polygon((d, c, cc, dd), fill=edge)
        draw.polygon((b, c, cc, bb), fill=edge)
        draw.polygon((a, b, c, d), fill=top)
        draw.line((a, b, c, d, a), fill='#889777', width=1)
        px, py = point(-60, 25, -8)
        draw.text((px, py), name, font=font(18), fill=ACID if index == 1 else INK)
        start, end = point(-95, 10, 79), point(95, 10, 79)
        draw.line((start, end), fill=ACID, width=3)
        progress = (phase / (2 * math.pi) + index / 3) % 1
        dot = (int(start[0] + (end[0] - start[0]) * progress), int(start[1] + (end[1] - start[1]) * progress))
        draw.ellipse((dot[0]-3, dot[1]-3, dot[0]+3, dot[1]+3), fill=INK)
    draw.line((42, 431, 958, 431), fill='#bec3b7')
    draw.text((43, 446), 'MIAWROUTER  /  MIAWCODE  /  MIAWCODE IDE', font=font(12), fill='#515a50')
    return image


if __name__ == '__main__':
    frames = [render(i / 48 * math.tau) for i in range(48)]
    palette = frames[0].quantize(colors=96)
    frames = [frame.quantize(palette=palette) for frame in frames]
    frames[0].save(ROOT / 'assets/readme-assembly.gif', save_all=True, append_images=frames[1:], duration=85, loop=0, optimize=True, disposal=2)
    assert len(frames) == 48
    print('Rendered assets/readme-assembly.gif (48 frames)')
