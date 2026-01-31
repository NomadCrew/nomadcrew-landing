// tests/seo.spec.ts
import { test, expect } from '@playwright/test';

test.describe('SEO - JSON-LD Structured Data', () => {
  test.beforeEach(async ({ page }) => {
    // Hide Astro dev toolbar to avoid test interference
    await page.addInitScript(() => {
      localStorage.setItem('astro-dev-toolbar-hidden', 'true');
    });
  });

  test('homepage includes Organization schema', async ({ page }) => {
    await page.goto('/');

    // Find JSON-LD script tags
    const scripts = await page.locator('script[type="application/ld+json"]').all();
    expect(scripts.length).toBeGreaterThanOrEqual(1);

    // Parse and validate Organization schema
    let foundOrganization = false;
    for (const script of scripts) {
      const content = await script.textContent();
      if (content) {
        const schema = JSON.parse(content);
        if (schema['@type'] === 'Organization') {
          foundOrganization = true;
          expect(schema['@context']).toBe('https://schema.org');
          expect(schema.name).toBe('NomadCrew');
          expect(schema.url).toContain('nomadcrew');
        }
      }
    }
    expect(foundOrganization).toBe(true);
  });

  test('homepage includes WebSite schema', async ({ page }) => {
    await page.goto('/');

    const scripts = await page.locator('script[type="application/ld+json"]').all();

    let foundWebSite = false;
    for (const script of scripts) {
      const content = await script.textContent();
      if (content) {
        const schema = JSON.parse(content);
        if (schema['@type'] === 'WebSite') {
          foundWebSite = true;
          expect(schema['@context']).toBe('https://schema.org');
          expect(schema.name).toBe('NomadCrew');
        }
      }
    }
    expect(foundWebSite).toBe(true);
  });

  test('non-homepage pages do not include schemas', async ({ page }) => {
    await page.goto('/privacy');

    const scripts = await page.locator('script[type="application/ld+json"]').all();
    // Privacy page should have 0 JSON-LD scripts (isHomepage not set)
    expect(scripts.length).toBe(0);
  });

  test('OG meta tags have correct dimensions', async ({ page }) => {
    await page.goto('/');

    const ogWidth = await page.locator('meta[property="og:image:width"]').getAttribute('content');
    const ogHeight = await page.locator('meta[property="og:image:height"]').getAttribute('content');

    expect(ogWidth).toBe('1200');
    expect(ogHeight).toBe('630');
  });
});
