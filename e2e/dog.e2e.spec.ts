import { test, expect } from '@playwright/test';

// E2E tests for page load, button click, and API failure handling
test('should load a dog image when page opens', async ({ page }) => {
  const responsePromise = page.waitForResponse(
    (response) =>
      response.url().includes('/api/dogs/random') && response.status() === 200
  );

  await page.goto('/');
  await responsePromise;

  const image = page.locator('img');
  await expect(image).toHaveAttribute('src', /^https:\/\//);
});

test('should load a new dog image when button is clicked', async ({ page }) => {
  await page.goto('/');

  await page.waitForResponse(
    (response) =>
      response.url().includes('/api/dogs/random') && response.status() === 200
  );

  const responsePromise = page.waitForResponse(
    (response) =>
      response.url().includes('/api/dogs/random') && response.status() === 200
  );

  await page.getByRole('button', { name: /get another dog/i }).click();
  await responsePromise;

  const image = page.locator('img');
  await expect(image).toHaveAttribute('src', /^https:\/\//);
});

test('should show an error message when API call fails', async ({ page }) => {
  await page.route('**/api/dogs/random', async (route) => {
    await route.abort();
  });

  await page.goto('/');

  const errorElement = page.getByText(/error/i);
  await expect(errorElement).toBeVisible();
});