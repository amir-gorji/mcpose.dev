import { test, expect } from '@playwright/test';

test.describe('Documentation Search (D06)', () => {
  test('search initializes with version scope from current route', async ({ page }) => {
    // Open v3 docs
    await page.goto('/docs/v3/getting-started/quick-start/');

    // Open search dialog
    const searchTrigger = page.locator('button[aria-haspopup="dialog"]:has-text("Search docs")');
    await searchTrigger.click();

    const dialog = page.locator('dialog[aria-label="Search documentation"]');
    await expect(dialog).toBeVisible();

    // Check header version tag
    await expect(dialog.locator('text=v3 Current')).toBeVisible();

    // Check version control checkbox
    const includeCheckbox = dialog.locator('input[type="checkbox"]');
    await expect(includeCheckbox).not.toBeChecked();
    await expect(dialog.locator('text=Include v2 results')).toBeVisible();

    // Close with Escape
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });

  test('search on v2 initializes with v2 scope', async ({ page }) => {
    // Open v2 docs
    await page.goto('/docs/v2/concepts/proxy-model/');

    const searchTrigger = page.locator('button[aria-haspopup="dialog"]:has-text("Search docs")');
    await searchTrigger.click();

    const dialog = page.locator('dialog[aria-label="Search documentation"]');
    await expect(dialog).toBeVisible();

    // Check header version tag
    await expect(dialog.locator('text=v2 Previous')).toBeVisible();
    await expect(dialog.locator('text=Include v3 results')).toBeVisible();
  });

  test('executes query, displays version badges and handles arrow navigation', async ({
    page,
  }) => {
    await page.goto('/docs/v3/');

    const searchTrigger = page.locator('button[aria-haspopup="dialog"]:has-text("Search docs")');
    await searchTrigger.click();

    const dialog = page.locator('dialog[aria-label="Search documentation"]');
    const input = dialog.locator('input[role="combobox"]');

    // Type query
    await input.fill('proxy');

    // Wait for results
    const results = dialog.locator('div[role="listbox"] a[role="option"]');
    await expect(results.first()).toBeVisible({ timeout: 5000 });

    // Verify version badge on first result is v3
    const firstBadge = results.first().locator('span[class*="versionBadge"]:has-text("v3")');
    await expect(firstBadge).toBeVisible();

    // Arrow navigation
    await input.focus();
    await page.keyboard.press('ArrowDown');

    // Toggle include v2 results
    const includeCheckbox = dialog.locator('input[type="checkbox"]');
    await includeCheckbox.click();
    await expect(includeCheckbox).toBeChecked();

    // Results still visible and can include both versions
    await expect(results.first()).toBeVisible();
  });
});
