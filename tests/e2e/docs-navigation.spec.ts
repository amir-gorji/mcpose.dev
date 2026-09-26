import { test, expect } from '@playwright/test';

test.describe('Docs Navigation & Versioning (D04, D05)', () => {
  test('versioned routes load correctly with self-canonical and version badges', async ({
    page,
    isMobile,
  }) => {
    // Navigate to v3 quickstart
    await page.goto('/docs/v3/getting-started/quick-start/');
    await expect(page).toHaveTitle(/Quick Start.*v3 docs/);

    // Verify canonical link has trailing slash
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute(
      'href',
      'https://mcpose.dev/docs/v3/getting-started/quick-start/',
    );

    if (isMobile) {
      // In mobile, version menu is in the mobile drawer
      const menuBtn = page.locator('button[aria-label="Open docs navigation"]');
      await menuBtn.click();
    }

    // Verify version menu shows v3 Current
    const versionTrigger = isMobile
      ? page.locator('nav[aria-label="Docs navigation"] button[aria-haspopup="menu"]:has-text("v3")')
      : page.locator('aside button[aria-haspopup="menu"]:has-text("v3")');
    await expect(versionTrigger).toBeVisible();
  });

  test('version switching maps counterpart pages between v3 and v2', async ({
    page,
    isMobile,
  }) => {
    // Go to v3 proxy-model
    await page.goto('/docs/v3/concepts/proxy-model/');

    if (isMobile) {
      const menuBtn = page.locator('button[aria-label="Open docs navigation"]');
      await menuBtn.click();
    }

    // Open version menu
    const versionTrigger = isMobile
      ? page.locator('nav[aria-label="Docs navigation"] button[aria-haspopup="menu"]:has-text("v3")')
      : page.locator('aside button[aria-haspopup="menu"]:has-text("v3")');
    await versionTrigger.click();

    // Click v2 Previous option
    const v2Option = page.locator('a[role="menuitem"]:has-text("v2")');
    await v2Option.click();

    // Verify URL navigated to /docs/v2/concepts/proxy-model/
    await expect(page).toHaveURL(/\/docs\/v2\/concepts\/proxy-model\//);
    await expect(page).toHaveTitle(/Proxy model.*v2 docs/);
  });

  test('v3-only topic navigated in v2 renders unavailable explanation page with 3 links', async ({
    page,
  }) => {
    // Navigate to unavailable topic in v2 (e.g. mesh)
    await page.goto('/docs/v2/unavailable/concepts-mesh/');

    await expect(page.locator('h1')).toHaveText('Mesh (multi-server composition)');
    await expect(page.locator('text=This topic starts in v3')).toBeVisible();

    // Verify the 3 destination links:
    // 1. v3 topic link
    const v3Link = page.locator('a:has-text("Read this topic in v3")');
    await expect(v3Link).toHaveAttribute('href', '/docs/v3/concepts/mesh/');

    // 2. Closest v2 topic link
    const v2ClosestLink = page.locator('a:has-text("Related v2 documentation")');
    await expect(v2ClosestLink).toHaveAttribute('href', '/docs/v2/concepts/proxy-model/');

    // 3. v2 home link
    const v2HomeLink = page.locator('a:has-text("Browse v2 home")');
    await expect(v2HomeLink).toHaveAttribute('href', '/docs/v2/');
  });

  test('arbitrary unknown slug returns 404', async ({ page }) => {
    await page.goto('/docs/v3/non-existent-topic-xyz/');
    // In static export or 404 page
    await expect(page.locator('h1, h2')).toContainText(/404|Page not found/i);
  });
});
