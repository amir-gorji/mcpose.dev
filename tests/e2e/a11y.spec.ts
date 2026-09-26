import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Audits (WCAG 2.2 AA)', () => {
  const routes = [
    '/',
    '/docs/v3/',
    '/docs/v3/getting-started/quick-start/',
    '/docs/v2/concepts/proxy-model/',
  ];

  for (const route of routes) {
    test(`route ${route} passes axe audit in light theme`, async ({ page }) => {
      await page.goto(route);
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .disableRules(['color-contrast']) // color-contrast is verified separately in visual tokens
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test(`route ${route} passes axe audit in dark theme`, async ({ page }) => {
      await page.goto(route);
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
      });

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .disableRules(['color-contrast'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }

  test('search dialog passes axe audit when open', async ({ page }) => {
    await page.goto('/docs/v3/');
    const searchTrigger = page.locator('button[aria-haspopup="dialog"]:has-text("Search docs")');
    await searchTrigger.click();

    const dialog = page.locator('dialog[aria-label="Search documentation"]');
    await expect(dialog).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('dialog[aria-label="Search documentation"]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .disableRules(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
