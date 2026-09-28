import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('renders hero with exact copy, install command, and actions', async ({ page }) => {
    await page.goto('/');

    // Check title and meta
    await expect(page).toHaveTitle('mcpose | The programmable MCP proxy');

    // Eyebrow and headline
    await expect(page.locator('text=The programmable MCP proxy').first()).toBeVisible();
    await expect(page.locator('h1')).toContainText('Make MCP');
    await expect(page.locator('h1')).toContainText('work your way.');

    // Lead text
    await expect(
      page.locator(
        'text=Build an MCP gateway. Shape tools and results. See what happens on every call. A TypeScript proxy library you run and extend.',
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

    await expect(page.locator('main section > h2, main section > div > h2, main section > div > div > h2')).toHaveText([
      'What will you build?',
      'Your gateway. Your middleware.',
      'Make existing tools fit your app.',
      'Add capabilities as you need them.',
      'The next layer is yours.',
    ]);
    await expect(page.locator('section[aria-label="Capabilities"] h3')).toHaveText([
      'Build a gateway',
      'Adapt your tools',
      'Debug calls',
    ]);
    await expect(page.locator('section[aria-label="Packages"] a:visible')).toHaveText([
      'mcpose',
      '@mcpose/otel',
      '@mcpose/store-redis',
      '@mcpose/store-postgres',
      '@mcpose/policy',
      '@mcpose/consent',
      '@mcpose/audit',
      '@mcpose/testing',
    ]);
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
