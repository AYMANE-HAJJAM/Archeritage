import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
await mkdir('docs/references/homepage-review', { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ reducedMotion: 'reduce' });
const errors = [];
page.on('pageerror', (error) => errors.push({ url: page.url(), message: error.message, stack: error.stack }));
for (const locale of ['', 'en', 'ar']) {
  for (const width of [1920, 1440, 1180, 1024, 768, 430, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${process.env.HOMEPAGE_REVIEW_URL || 'http://localhost:4176'}/${locale}`, { waitUntil: 'load', timeout: 60000 });
    await page.evaluate(() => Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 5000))]));
    await page.evaluate(async () => {
      for (const img of document.images) { img.loading = 'eager'; }
      await Promise.race([Promise.all(Array.from(document.images, (img) => img.decode().catch(() => {}))), new Promise((resolve) => setTimeout(resolve, 10000))]);
    });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    const unloadedImages = await page.locator('img').evaluateAll((images) => images.filter((img) => !img.complete || !img.naturalWidth).map((img) => img.currentSrc));
    console.log(JSON.stringify({ locale: locale || 'fr', width, overflow, unloadedImages }));
    if (overflow || unloadedImages.length) errors.push({ locale: locale || 'fr', width, overflow, unloadedImages });
    if (width === 1920 || width === 1440 || width === 390) await page.screenshot({ path: `docs/references/homepage-review/${locale || 'fr'}-${width}.png`, fullPage: true });
    if ((locale === '' && [1920, 1440, 768, 390].includes(width)) || (locale === 'ar' && width === 390)) {
      for (const selector of ['.home-hero', '.home-solutions-section', '.home-method-section']) {
        await page.locator(selector).screenshot({ path: `docs/references/homepage-review/${locale || 'fr'}-${width}-${selector.slice(1)}.png`, ...(selector !== '.home-hero' ? { style: '.site-header, .skip-link, .assistant-widget { visibility: hidden !important; }' } : {}) });
      }
    }
  }
}
console.log(JSON.stringify({ errors }));
await browser.close();
if (errors.length) process.exitCode = 1;
