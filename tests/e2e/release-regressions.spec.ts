import { test, expect } from '@playwright/test';

test('mobile explorer keeps the upstream, controls, and code inside the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/');
  for (const selector of ['#explore [role="tabpanel"]', '#explore pre']) {
    const box = await page.locator(selector).boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x + box!.width).toBeLessThanOrEqual(320);
  }
});

test('long documentation titles wrap inside the article', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/docs/v3/packages/store-postgres/');
  const bounds = await page.locator('h1').evaluate((heading) => {
    const range = document.createRange();
    range.selectNodeContents(heading);
    return Array.from(range.getClientRects(), rect => ({ right: rect.right }));
  });
  expect(bounds.length).toBeGreaterThan(0);
  expect(bounds.every(rect => rect.right <= 390)).toBe(true);
});
