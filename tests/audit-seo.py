import json
import subprocess
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse

BASE = 'https://miawlabs.web.id'
ROOT = Path(__file__).resolve().parents[1]


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.tags = []
        self.title = ''
        self.in_title = False
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))
        self.in_title = tag == 'title' or self.in_title

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data


def curl(url, head=False):
    args = ['curl.exe', '-sSL', '--max-time', '15']
    if head:
        args.append('-I')
    result = subprocess.run(args + [url], capture_output=True, text=True, encoding='utf-8', errors='replace')
    return result.stdout, result.stderr.strip(), result.returncode


if __name__ == '__main__':
    lines = ['# SEO audit before fixes', '', 'Observed on 2026-10-19. Live curl output and local source inventory; no ranking claims.', '', '## Redirects']
    for url in [BASE+'/about', BASE+'/about/', BASE+'/about/index.html', 'http://miawlabs.web.id/', 'https://www.miawlabs.web.id/', BASE+'/router/', BASE+'/code/', BASE+'/ide/']:
        out, err, code = curl(url, True)
        headers = [line for line in out.splitlines() if line.lower().startswith(('http/', 'location:', 'x-robots-tag:'))]
        lines += ['', '### '+url, '```text', '\n'.join(headers), f'curl exit: {code}; {err}', '```']
    lines += ['', '## Live page metadata']
    for path in ['/', '/about/']:
        out, err, code = curl(BASE+path)
        page = Page(out)
        lines += ['', '### '+path, '- Title: '+repr(page.title)]
        for name in ['description', 'viewport', 'robots', 'og:title', 'og:description', 'og:url', 'og:image']:
            values = [a.get('content', '') for tag,a in page.tags if tag == 'meta' and name in (a.get('name'),a.get('property'))]
            lines.append(f'- {name}: {values!r}; lengths: {[len(v) for v in values]}')
        lines += ['- Canonical: '+repr([a.get('href') for t,a in page.tags if t=='link' and a.get('rel')=='canonical']), '- H1 count: '+str(sum(t=='h1' for t,a in page.tags)), '- JSON-LD scripts: '+str(sum(t=='script' and a.get('type')=='application/ld+json' for t,a in page.tags))]
    for path in ['/robots.txt','/sitemap.xml']:
        out, err, code = curl(BASE+path)
        lines += ['', '## Live '+path, '```text', out[:6000], '```']
    lines += ['', '## Local source inventory']
    links=set()
    for file in [ROOT/'index.html', *[ROOT/d/'index.html' for d in ['about','router','code','ide']]]:
        page=Page(file.read_text(encoding='utf-8'))
        missing=[a.get('src') for t,a in page.tags if t=='img' and not (a.get('width') and a.get('height'))]
        blocking=[a for t,a in page.tags if t=='script' and a.get('src') and not (a.get('defer') is not None or a.get('async') is not None or a.get('type')=='module')]
        lines += [f'- {file.relative_to(ROOT)}: title={page.title!r}; h1={sum(t=="h1" for t,a in page.tags)}; images missing dimensions={missing!r}; blocking scripts={blocking!r}']
        for t,a in page.tags:
            if t=='a' and a.get('href') and not a['href'].startswith(('http','#','mailto:')):
                links.add(urljoin(BASE+'/'+str(file.relative_to(ROOT)).replace('index.html',''),a['href']))
    lines += ['', '## Live internal-link checks']
    for url in sorted(links):
        result=subprocess.run(['curl.exe','-sL','-o','NUL','-w','%{http_code} %{url_effective}','--max-time','10',url],capture_output=True,text=True)
        lines.append(f'- {url}: {result.stdout}; exit {result.returncode}')
    lines += ['', '## Images over 200 KB before changes']
    for p in (ROOT/'assets').glob('*'):
        if p.suffix.lower() in ['.gif','.png','.jpg','.webp'] and p.stat().st_size>200000:
            lines.append(f'- {p.relative_to(ROOT)}: {p.stat().st_size} bytes')
    lines += ['', '## Identity and schema observations', '- About source contains plain HTML founder and owner text for Sulistyo Fajar Pratama and a matching Person/Organization graph.', '- Homepage has no JSON-LD before this task. No email addresses are added.', '- Existing local About link uses about/index.html for file URL compatibility.', '- Canonicals and sitemap currently contain /about without a slash and product index.html URLs. Final canonical decisions are documented after evaluating the redirect evidence above.']
    (ROOT/'seo').mkdir(exist_ok=True)
    (ROOT/'seo/audit.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')
    print('Saved seo/audit.md')
