// Run: node tests/verify-landing.cjs <path-to-installed-playwright>
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require(process.argv[2] || 'playwright');
const root = path.resolve(__dirname, '..');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png' };
(async () => {
  const server = http.createServer(async (req, res) => {
    try {
      const file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
      assert(file.startsWith(root + path.sep) || file === root);
      const target = file === root ? path.join(root, 'index.html') : file;
      res.setHeader('Content-Type', types[path.extname(target)] || 'application/octet-stream');
      res.end(await fs.readFile(target));
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ headless: true, channel: 'chrome' });
    const url = `http://127.0.0.1:${server.address().port}/`;
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(url);
    await page.waitForSelector('.scene.is-ready');
    assert.equal(await page.locator('nav').count(), 0);
    for (const width of [390, 768, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow at ${width}`);
    }
    for (const product of ['code', 'ide', 'router']) {
      await page.locator(`.product-selector [data-product="${product}"]`).click();
      assert(await page.locator(`[data-detail="${product}"]`).isVisible());
    }
    for (const mode of ['agent', 'review', 'plan']) {
      await page.locator(`[data-mode="${mode}"]`).click();
      assert(await page.locator(`[data-mode-panel="${mode}"]`).isVisible());
    }
    for (const [selector, target] of [['.products', '.detail.is-active .spec-sheet'], ['.modes', '.editor'], ['.connection', '.route-core'], ['.install', '.brand-object img']]) {
      await page.locator(target).evaluate(node => node.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await page.waitForFunction(sel => document.querySelector(sel).classList.contains('in-view'), selector);
      assert(await page.locator(target).evaluate(node => node.getAnimations().some(animation => animation.playState === 'running')), 'missing section motion: ' + selector);
    }
    assert(await page.locator('.demo-line').count() > 15, 'mode demo needs staggered lines');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForFunction(() => document.querySelector('#motion-toggle').getAttribute('aria-pressed') === 'true');
    assert.equal(await page.locator('.brand-object img').evaluate(node => getComputedStyle(node).animationName), 'none');
    assert.deepEqual(errors, []);
    const fallback = await browser.newPage();
    await fallback.addInitScript(() => {
      const getContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function(type, ...args) { return type.startsWith('webgl') ? null : getContext.call(this, type, ...args); };
    });
    await fallback.goto(url);
    await fallback.waitForFunction(() => document.querySelector('#scene-hint').textContent.includes('Preview mode'));
    assert(await fallback.locator('.scene-fallback').isVisible());
    await fallback.locator('.product-selector [data-product="ide"]').click();
    assert(await fallback.locator('[data-detail="ide"]').isVisible());
    const direct = await browser.newPage();
    await direct.goto(require('node:url').pathToFileURL(path.join(root, 'index.html')).href);
    await direct.waitForSelector('.scene.is-ready');
    await direct.locator('.product-selector [data-product="code"]').click();
    assert(await direct.locator('[data-detail="code"]').isVisible());
    const frame = await direct.locator('#webgl').screenshot();
    await direct.waitForTimeout(600);
    assert(!frame.equals(await direct.locator('#webgl').screenshot()), '3D must animate over time');
    await direct.locator('#motion-toggle').click();
    await direct.waitForTimeout(2500);
    assert.equal(await direct.locator('#motion-toggle').getAttribute('aria-pressed'), 'true');
    const still = await direct.locator('#webgl').getAttribute('data-motion-time');
    await direct.waitForTimeout(300);
    assert.equal(await direct.locator('#webgl').getAttribute('data-motion-time'), still, 'pause must freeze the animation clock');
    console.log('PASS: WebGL, no navbar, responsive, products, modes, reduced motion; WebGL fallback preserves controls; file:// works and 3D frames animate.');
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
