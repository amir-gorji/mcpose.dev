import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('renders hero with exact copy, install command, and actions', async ({ page }) => {
    await page.goto('/');

    // Check title and meta
    await expect(page).toHaveTitle('mcpose | The composable MCP proxy');

    // Eyebrow and headline
    await expect(page.locator('text=The composable MCP proxy').first()).toBeVisible();
    await expect(page.locator('h1')).toContainText('Make MCP');
    await expect(page.locator('h1')).toContainText('work your way.');

    // Lead text
    await expect(
      page.locator(
        'text=Transform responses. Shape tool access. Connect servers. Add the behavior you need between your client and its MCP servers.',
      ),
    ).toBeVisible();

    // Install command
    const installCode = page.locator('code:has-text("npm install mcpose @modelcontextprotocol/sdk")');
    await expect(installCode).toBeVisible();

    // Primary action
    const getStartedLink = page.locator('a.btn-primary:has-text("Get started")');
    await expect(getStartedLink).toBeVisible();
    await expect(getStartedLink).toHaveAttribute('href', '/docs/v3/getting-started/quick-start/');

    // Secondary action
    const exploreLink = page.locator('a.btn-secondary:has-text("Explore middleware")');
    await expect(exploreLink).toBeVisible();
    await expect(exploreLink).toHaveAttribute('href', '#explore');
  });

  test('renders all sections in expected order', async ({ page }) => {
    await page.goto('/');

    // Section 4: Explorer
    const explorer = page.locator('#explore');
    await expect(explorer).toBeVisible();
    await expect(explorer.locator('h2')).toHaveText('What would you change?');

    // Section 5: Mesh
    const meshSection = page.locator('section[aria-label="Multi-server mesh"]');
    await expect(meshSection).toBeVisible();
    await expect(meshSection.locator('h2')).toHaveText('Bring your servers together.');

    // Section 6: Capabilities
    const capSection = page.locator('section[aria-label="Capabilities"]');
    await expect(capSection).toBeVisible();
    await expect(capSection.locator('h2')).toHaveText('Useful in a side project. Ready for serious work.');

    // Section 7: Packages
    const pkgSection = page.locator('section[aria-label="Packages"]');
    await expect(pkgSection).toBeVisible();
    await expect(pkgSection.locator('h2')).toHaveText('Only the pieces you need.');

    // Section 8: CTA Card
    const ctaSection = page.locator('section[aria-label="Get started"]');
    await expect(ctaSection).toBeVisible();
    await expect(ctaSection.locator('h2')).toHaveText('The next layer is yours.');
  });

  test('theme toggle switches theme and persists', async ({ page, isMobile }) => {
    await page.goto('/');

    if (isMobile) {
      const menuBtn = page.locator('button[aria-label="Toggle navigation menu"]');
      await menuBtn.click();
    }

    const toggle = isMobile
      ? page.locator('div[role="dialog"] button[aria-label^="Switch to"]')
      : page.locator('button[aria-label^="Switch to"]').first();
    await expect(toggle).toBeVisible();

    // Check initial html data-theme
    const initialTheme = await page.locator('html').getAttribute('data-theme');

    await toggle.click();
    const newTheme = await page.locator('html').getAttribute('data-theme');
    expect(newTheme).not.toEqual(initialTheme);

    // Reload and check persistence
    await page.reload();
    const persistedTheme = await page.locator('html').getAttribute('data-theme');
    expect(persistedTheme).toEqual(newTheme);
  });
});
