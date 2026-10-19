import json
import re
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://miawlabs.web.id'
NAME = 'Sulistyo Fajar Pratama'


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.links = []
        self.canonical = []
        self.robots = []
        self.text = []
        self.hidden = 0
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ('script', 'style'):
            self.hidden += 1
        if tag == 'a':
            self.links.append(attrs.get('href'))
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.canonical.append(attrs.get('href'))
        if tag == 'meta' and attrs.get('name', '').lower() in ('robots', 'googlebot'):
            self.robots.append(attrs.get('content', '').lower())

    def handle_endtag(self, tag):
        if tag in ('script', 'style'):
            self.hidden -= 1

    def handle_data(self, data):
        if not self.hidden:
            self.text.append(data)


home = Page((ROOT / 'index.html').read_text(encoding='utf-8'))
source = (ROOT / 'about/index.html').read_text(encoding='utf-8')
about = Page(source)
assert '/about/' in home.links
for href in about.links:
    if href and not href.startswith(('http:', 'https:', '#')):
        assert (ROOT / 'about' / href).resolve().exists(), href
assert NAME in ''.join(about.text) and 'founder and owner' in ''.join(about.text)
assert about.canonical == [BASE + '/about/']
assert home.canonical == [BASE + '/']
assert all('noindex' not in value and 'none' not in value for value in about.robots)
robots = (ROOT / 'robots.txt').read_text()
assert 'Disallow:' not in robots
assert 'Sitemap: ' + BASE + '/sitemap.xml' in robots
sitemap = ET.parse(ROOT / 'sitemap.xml')
urls = [node.text for node in sitemap.findall('.//{*}loc')]
assert BASE + '/about/' in urls
assert len(urls) == len(set(urls)) == 5
schema = json.loads(re.search(r'<script type="application/ld\+json">(.*?)</script>', source, re.S).group(1))
person, org = schema['@graph']
assert person['@type'] == 'Person' and person['name'] == NAME
assert org['founder']['@id'] == person['@id']
assert org['url'] == BASE + '/'
metadata = json.loads((ROOT / 'package.json').read_text())
assert metadata['author'] == metadata['maintainers'][0]
assert metadata['author']['name'] == NAME
readme = (ROOT / 'README.md').read_text(encoding='utf-8')
assert '## Maintainer' in readme and NAME in readme
for path in [ROOT / 'index.html', ROOT / 'about/index.html', ROOT / 'package.json', ROOT / 'README.md']:
    text = path.read_text(encoding='utf-8')
    assert not re.search(r'[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}', text), f'Public email in {path}'
print('PASS: raw HTML founder, About link, canonicals, robots, sitemap, identity graph, metadata, README, no public email')
