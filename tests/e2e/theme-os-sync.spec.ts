import { test, expect } from '@playwright/test';

test.describe('theme responds to live OS preference change', () => {
  test('page theme and toggle stay consistent when OS preference flips with no stored override', async ({ page }) => {
    await page.context().clearCookies();
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('mcpose.theme'));
    await page.reload();

    const toggle = page.getByRole('button', { name: /switch to (dark|light) theme/i, includeHidden: true }).first();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(toggle).toHaveAttribute('aria-label', 'Switch to dark theme');
    const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    await page.emulateMedia({ colorScheme: 'dark' });

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(toggle).toHaveAttribute('aria-label', 'Switch to light theme');
    const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    expect(darkBg).not.toEqual(lightBg);
  });

  test('a stored user override is not clobbered by an OS preference change', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('mcpose.theme', 'dark'));
    await page.reload();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(100);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });
});
