import json
import re
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://miawlabs.web.id/'


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.tags = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))


titles, descriptions, urls = set(), set(), set()
for folder in ['', 'about', 'router', 'code', 'ide']:
    path = ROOT / folder / 'index.html'
    text = path.read_text(encoding='utf-8')
    page = Page(text)
    assert sum(tag == 'h1' for tag, _ in page.tags) == 1, path
    title = re.search(r'<title>(.*?)</title>', text).group(1)
    meta = {attrs.get('name', attrs.get('property')): attrs.get('content') for tag, attrs in page.tags if tag == 'meta'}
    description = meta['description']
    assert title not in titles and description not in descriptions
    assert 120 <= len(description) <= 155, (path, len(description))
    titles.add(title)
    descriptions.add(description)
    url = BASE + (folder + '/' if folder else '')
    canonical = [a['href'] for t, a in page.tags if t == 'link' and a.get('rel') == 'canonical']
    assert canonical == [url], (path, canonical)
    urls.add(url)
    for key in ['og:type', 'og:title', 'og:description', 'og:url', 'og:image', 'viewport']:
        assert meta.get(key), (path, key)
    assert meta['og:url'] == url
    assert (ROOT / meta['og:image'].removeprefix(BASE)).exists()
    assert 'noindex' not in meta.get('robots', '')
    for tag, attrs in page.tags:
        if tag == 'img':
            assert attrs.get('width') and attrs.get('height'), (path, attrs)
            asset = (path.parent / attrs['src']).resolve()
            assert asset.exists()
            assert asset.stat().st_size <= 200_000, asset
    for raw in re.findall(r'<script type="application/ld\+json">(.*?)</script>', text, re.S):
        json.loads(raw)
    assert not re.search(r'[\u4e00-\u9fff]', text)
assert {node.text for node in ET.parse(ROOT / 'sitemap.xml').findall('.//{*}loc')} == urls
assert 'href="/about/"' in (ROOT / 'index.html').read_text(encoding='utf-8')
assert 'application/ld+json' in (ROOT / 'index.html').read_text(encoding='utf-8')
assert (ROOT / 'promotion/SKIPPED.md').read_text().strip() == 'Phase 2 not requested.'
print('PASS: five canonical pages, unique metadata, OG, dimensions, image budget, schema JSON, sitemap, About link, no Chinese; promotion skipped')

redirects = json.loads((ROOT / 'vercel.json').read_text())['redirects']
for source, destination in [('/about/index.html', '/about/'), ('/about', '/about/'), ('/router/index.html', '/router/'), ('/code/index.html', '/code/'), ('/ide/index.html', '/ide/')]:
    assert any(rule['source'] == source and rule['destination'] == destination and rule['permanent'] for rule in redirects)
assert not any(rule['source'] == '/about/' for rule in redirects), 'canonical URL must not redirect to itself'
print('PASS: Vercel permanent alias redirects, no canonical self-loop')
