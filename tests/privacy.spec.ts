import { test, expect } from '@playwright/test';

test.describe('Privacy Policy Page', () => {
  test('renders with correct content', async ({ page }) => {
    await page.goto('/privacy');
    await page.waitForLoadState('networkidle');

    // Verify heading (first h1 in main content, not dev toolbar)
    await expect(page.locator('h1').first()).toContainText('Privacy Policy');

    // Verify key sections exist (target headings specifically)
    await expect(page.locator('h2:has-text("Information Collection")')).toBeVisible();
    await expect(page.locator('h2:has-text("Location Data")')).toBeVisible();
    await expect(page.locator('h2:has-text("Third Party Services")')).toBeVisible();
    await expect(page.locator('h2:has-text("Contact Us")')).toBeVisible();
  });

  test('has correct SEO meta tags', async ({ page }) => {
    await page.goto('/privacy');

    // Verify title
    await expect(page).toHaveTitle(/Privacy Policy.*NomadCrew/);

    // Verify meta description
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toContain('Privacy policy for NomadCrew');

    // Verify canonical URL
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toContain('/privacy');
  });

  test('visual regression - full page', async ({ page }) => {
    await page.goto('/privacy');
    await page.waitForLoadState('networkidle');

    // Wait for fonts
    await page.evaluate(() => document.fonts.ready);

    // Disable animations and hide dev toolbar for consistent screenshots
    await page.addStyleTag({
      content: `*, *::before, *::after {
        animation-duration: 0s !important;
        transition-duration: 0s !important;
      }
      astro-dev-toolbar {
        display: none !important;
      }`
    });

    await expect(page).toHaveScreenshot('privacy-page.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
});
