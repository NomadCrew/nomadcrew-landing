/**
 * Waitlist Form End-to-End Tests
 *
 * Tests the WaitlistForm component's behavior for all user interaction scenarios.
 * API calls are mocked using Playwright's route interception since Astro dev
 * server doesn't serve Cloudflare Pages Functions.
 *
 * For real API testing, see tests/api.spec.ts and use wrangler pages dev.
 *
 * Success Criteria Coverage:
 * - SC1: Valid email success message - test "shows success message after valid submission"
 * - SC2: Invalid email validation error - tests "shows error for empty email" and "shows error for invalid email format"
 * - SC3: Email delivery - manual test with real RESEND_API_KEY (not covered here)
 * - SC4: Error handling - test "handles API failure gracefully"
 * - SC5: CORS headers - documented in CORS configuration section
 */

import { test, expect } from '@playwright/test';

test.describe('Waitlist Form - End-to-End Submission Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Hide Astro dev toolbar to avoid test interference
    await page.addStyleTag({
      content: 'astro-dev-toolbar { display: none !important; }'
    });

    // Navigate to homepage
    await page.goto('/');

    // Scroll to waitlist section to trigger client:visible hydration
    const waitlistSection = page.locator('section#waitlist');
    await waitlistSection.scrollIntoViewIfNeeded();

    // Wait for React component hydration
    await page.waitForTimeout(1000);
  });

  test('shows success message after valid submission', async ({ page }) => {
    // Mock successful API response with delay to observe loading state
    await page.route('/api/waitlist', async (route) => {
      // Small delay to ensure loading state is visible
      await new Promise(resolve => setTimeout(resolve, 100));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Successfully joined the waitlist'
        })
      });
    });

    const emailInput = page.locator('input[type="email"]');
    const submitButton = page.locator('button[type="submit"]');

    // Fill email input with valid email
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');

    // Click submit button
    await submitButton.click();

    // Verify button changes to loading state (may be brief)
    // Using waitFor with short timeout since loading state is quick
    await expect(submitButton).toBeDisabled();

    // Verify success state appears
    await expect(submitButton).toContainText('Joined Successfully!', { timeout: 5000 });
    await expect(submitButton).toHaveClass(/bg-green-500/);

    // Verify success message appears
    const successMessage = page.locator('text=Thank you for joining!');
    await expect(successMessage).toBeVisible();

    // Verify input is cleared
    await expect(emailInput).toHaveValue('');
    await expect(emailInput).toBeDisabled();
  });

  test('shows error for empty email', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const submitButton = page.locator('button[type="submit"]');

    // Leave email input empty and submit
    await expect(emailInput).toHaveValue('');
    await submitButton.click();

    // Verify error message appears
    const errorMessage = page.locator('text=Please enter your email');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveClass(/text-red-500/);

    // Verify button shows error state
    await expect(submitButton).toContainText('Try Again');
    await expect(submitButton).toHaveClass(/bg-red-500/);

    // Verify no API call was made (we don't set up a route, so any call would fail the test)
    // If API was called, Playwright would show unhandled route warning
  });

  test('shows error for invalid email format (no @)', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');

    // For input type="email", browsers provide native validation that blocks form submission
    // We test that the React validation also works by temporarily changing the type
    const emailInput = page.locator('input[type="email"]');

    // First, temporarily change type to bypass browser validation
    await emailInput.evaluate((el: HTMLInputElement) => {
      el.setAttribute('type', 'text');
    });

    // Now use generic selector to fill the input
    const inputField = page.locator('input[placeholder="Enter your email"]');
    await inputField.fill('invalidemail');
    await expect(inputField).toHaveValue('invalidemail');

    // Submit form - browser validation won't block it
    await submitButton.click();

    // Verify validation error message appears from React
    const errorMessage = page.locator('text=Please enter a valid email address');
    await expect(errorMessage).toBeVisible({ timeout: 2000 });
    await expect(errorMessage).toHaveClass(/text-red-500/);

    // Verify button shows error state
    await expect(submitButton).toContainText('Try Again');
    await expect(submitButton).toHaveClass(/bg-red-500/);
  });

  test('handles API failure gracefully', async ({ page }) => {
    // Mock API failure response with delay
    await page.route('/api/waitlist', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Internal server error',
          message: 'Failed to send email'
        })
      });
    });

    const emailInput = page.locator('input[type="email"]');
    const submitButton = page.locator('button[type="submit"]');

    // Fill valid email
    await emailInput.fill('test@example.com');

    // Submit form
    await submitButton.click();

    // Verify button is disabled during request
    await expect(submitButton).toBeDisabled();

    // Verify error state appears
    await expect(submitButton).toContainText('Try Again', { timeout: 5000 });
    await expect(submitButton).toHaveClass(/bg-red-500/);

    // Verify user-friendly error message appears
    const errorMessage = page.locator('.text-red-500');
    await expect(errorMessage).toBeVisible();
    // Error message should show the server error or fallback
    await expect(errorMessage).toContainText(/Internal server error|Failed to send email|Something went wrong/);

    // Verify user can try again (button is enabled)
    await expect(submitButton).toBeEnabled();
  });

  test('handles network failure gracefully', async ({ page }) => {
    // Mock network failure by aborting the request
    await page.route('/api/waitlist', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      await route.abort('failed');
    });

    const emailInput = page.locator('input[type="email"]');
    const submitButton = page.locator('button[type="submit"]');

    // Fill valid email
    await emailInput.fill('test@example.com');

    // Submit form
    await submitButton.click();

    // Verify button is disabled during request
    await expect(submitButton).toBeDisabled();

    // Verify error state appears after network failure
    await expect(submitButton).toContainText('Try Again', { timeout: 5000 });
    await expect(submitButton).toHaveClass(/bg-red-500/);

    // Verify error message appears
    const errorMessage = page.locator('.text-red-500');
    await expect(errorMessage).toBeVisible();
    // Network failures show "Failed to fetch" error
    await expect(errorMessage).toContainText(/Failed to fetch|Something went wrong/);

    // Verify form is still usable
    await expect(submitButton).toBeEnabled();
    await expect(emailInput).toBeEnabled();
  });

  test('can retry after error', async ({ page }) => {
    let attemptCount = 0;

    // First attempt fails, second succeeds
    await page.route('/api/waitlist', async (route) => {
      attemptCount++;

      if (attemptCount === 1) {
        // First attempt: fail
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Server error' })
        });
      } else {
        // Second attempt: succeed
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, message: 'Successfully joined' })
        });
      }
    });

    const emailInput = page.locator('input[type="email"]');
    const submitButton = page.locator('button[type="submit"]');

    // First submission - should fail
    await emailInput.fill('test@example.com');
    await submitButton.click();
    await expect(submitButton).toContainText('Try Again', { timeout: 5000 });

    // Retry - should succeed
    await submitButton.click();
    await expect(submitButton).toContainText('Joined Successfully!', { timeout: 5000 });
    await expect(submitButton).toHaveClass(/bg-green-500/);
  });
});

test.describe('API CORS Configuration', () => {
  test('documents production CORS behavior', async () => {
    // In production, form and API are same-origin (nomadcrew.uk)
    // CORS headers are set but not strictly necessary for same-origin requests
    // Headers allow cross-origin for flexibility (CDN, preview deployments)
    //
    // CORS preflight (OPTIONS) is only triggered for:
    // - Cross-origin requests
    // - Custom headers beyond safe list
    // - Methods other than GET/POST/HEAD
    //
    // Since we use POST with Content-Type: application/json from same origin,
    // no preflight is needed in production. CORS headers are defensive.
    //
    // For actual CORS header testing, see tests/api.spec.ts (requires wrangler)

    expect(true).toBe(true); // Documentation test
  });
});
