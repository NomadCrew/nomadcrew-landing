// tests/api.spec.ts
// API endpoint tests for waitlist signup
//
// IMPORTANT: The Astro dev server (port 4321) does NOT serve Cloudflare Pages Functions.
// Functions are only available via wrangler pages dev (port 8788).
//
// To run full API tests with wrangler:
// 1. Update .dev.vars with real RESEND_API_KEY (get from https://resend.com/api-keys)
// 2. Terminal 1: pnpm build && pnpm exec wrangler pages dev ./dist --port 8788
// 3. Terminal 2: PLAYWRIGHT_BASE_URL=http://localhost:8788 pnpm test tests/api.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Waitlist API - Client Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Hide Astro dev toolbar to avoid test interference
    await page.addStyleTag({
      content: 'astro-dev-toolbar { display: none !important; }'
    });
  });

  test('waitlist form renders and is interactive', async ({ page }) => {
    await page.goto('/');

    // Scroll to waitlist section to trigger client:visible hydration
    const waitlistSection = page.locator('section#waitlist');
    await waitlistSection.scrollIntoViewIfNeeded();

    // Wait for hydration
    await page.waitForTimeout(1000);

    // Find email input
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();

    // Verify input is interactive
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');

    // Submit button should be visible
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toContainText('Join Now');
  });

  test('form accepts valid email and button becomes active', async ({ page }) => {
    await page.goto('/');

    // Scroll to waitlist section to trigger client:visible hydration
    const waitlistSection = page.locator('section#waitlist');
    await waitlistSection.scrollIntoViewIfNeeded();

    // Wait for hydration
    await page.waitForTimeout(1000);

    // Find the email input and submit button
    const emailInput = page.locator('input[type="email"]');
    const submitButton = page.locator('button[type="submit"]');

    // Enter valid email
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');

    // Verify button is enabled (not disabled)
    await expect(submitButton).toBeEnabled();

    // Verify button has proper state (shows "Join Now")
    await expect(submitButton).toContainText('Join Now');
  });
});

test.describe.skip('Waitlist API - Server Responses', () => {
  // These tests require wrangler pages dev to be running
  // Run manually with: pnpm build && pnpm exec wrangler pages dev ./dist --port 8788
  // Then in another terminal: PLAYWRIGHT_BASE_URL=http://localhost:8788 pnpm test tests/api.spec.ts
  //
  // Skipped in CI because:
  // 1. Astro dev server doesn't serve functions/ directory
  // 2. Wrangler requires build step and separate process

  test('POST /api/waitlist with valid email returns 200 + success', async ({ request }) => {
    const response = await request.post('http://localhost:8788/api/waitlist', {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        email: 'test@example.com',
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('success', true);
    expect(body).toHaveProperty('message');
  });

  test('POST /api/waitlist with empty body returns 400 + error message', async ({ request }) => {
    const response = await request.post('http://localhost:8788/api/waitlist', {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {},
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body).toHaveProperty('error');
    expect(body.error).toContain('Email is required');
  });

  test('POST /api/waitlist with invalid JSON returns 400', async ({ request }) => {
    const response = await request.post('http://localhost:8788/api/waitlist', {
      headers: {
        'Content-Type': 'application/json',
      },
      data: 'invalid-json-string',
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('OPTIONS /api/waitlist returns 204 with CORS headers', async ({ request }) => {
    const response = await request.fetch('http://localhost:8788/api/waitlist', {
      method: 'OPTIONS',
    });

    expect(response.status()).toBe(204);
    expect(response.headers()['access-control-allow-origin']).toBe('*');
    expect(response.headers()['access-control-allow-methods']).toContain('POST');
  });

  test('GET /api/waitlist returns 405 Method Not Allowed', async ({ request }) => {
    const response = await request.get('http://localhost:8788/api/waitlist');

    expect(response.status()).toBe(405);

    const body = await response.json();
    expect(body).toHaveProperty('error', 'Method not allowed');
    expect(body).toHaveProperty('method', 'GET');
  });
});
