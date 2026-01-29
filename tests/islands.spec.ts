// tests/islands.spec.ts
import { test, expect } from '@playwright/test';

test.describe('React Islands Hydration', () => {
  test.beforeEach(async ({ page }) => {
    // Hide Astro dev toolbar to avoid test interference
    await page.addStyleTag({
      content: 'astro-dev-toolbar { display: none !important; }'
    });
  });

  test('all islands render without hydration errors', async ({ page }) => {
    // Collect console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/test-all-islands/');

    // Wait for hydration to complete (islands load async)
    await page.waitForTimeout(2000);

    // Check for hydration-specific errors
    const hydrationErrors = consoleErrors.filter(
      (err) => err.includes('hydration') || err.includes('Hydration')
    );

    expect(hydrationErrors).toHaveLength(0);
  });

  test('Navbar renders with client:load', async ({ page }) => {
    await page.goto('/test-all-islands/');

    // Navbar should be visible immediately
    const navbar = page.locator('nav');
    await expect(navbar).toBeVisible();

    // Check for NomadCrew logo text
    await expect(navbar.locator('text=NomadCrew')).toBeVisible();

    // Check for Join Waitlist button
    const joinButton = navbar.locator('text=Join Waitlist');
    await expect(joinButton).toBeVisible();
  });

  test('HeroSection renders content', async ({ page }) => {
    await page.goto('/test-all-islands/');

    // Check for main heading
    await expect(page.locator('h1')).toContainText('Group Travel App');

    // Check for CTA button (use role to disambiguate from waitlist paragraph)
    const ctaButton = page.getByRole('link', { name: 'Get Early Access' });
    await expect(ctaButton).toBeVisible();
  });

  test('FeatureCards render all 4 features', async ({ page }) => {
    await page.goto('/test-all-islands/');

    // Scroll to features section to trigger client:visible (use first match - the section, not footer)
    await page.locator('.bg-gray-50').first().scrollIntoViewIfNeeded();

    // Wait for hydration
    await page.waitForTimeout(1000);

    // Check all 4 feature cards are present
    const featureCards = page.locator('.bg-white.p-6.rounded-xl');
    await expect(featureCards).toHaveCount(4);

    // Check specific feature titles (use role to avoid dev toolbar interference)
    await expect(page.getByRole('heading', { name: 'Trip Planning & Management' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Real-time Communication' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Location Services' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Financial Management' })).toBeVisible();
  });

  test('WaitlistForm is interactive', async ({ page }) => {
    await page.goto('/test-all-islands/');

    // Scroll to waitlist section
    await page.locator('#waitlist').scrollIntoViewIfNeeded();

    // Wait for hydration
    await page.waitForTimeout(1000);

    // Find email input
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();

    // Type in the input to verify interactivity
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');

    // Submit button should be visible
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toContainText('Join Now');
  });

  test('Footer renders as static content', async ({ page }) => {
    await page.goto('/test-all-islands/');

    // Footer should be visible
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Check copyright text
    await expect(footer).toContainText('NomadCrew');
    await expect(footer).toContainText('All rights reserved');
  });
});
