import { test, expect } from '@playwright/test';

test.describe('Request Explorer (D03)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('default preset is Transform with complete static content', async ({ page }) => {
    const explorer = page.locator('#explore');
    await expect(explorer).toBeVisible();

    const transformTab = explorer.locator('#tab-transform');
    await expect(transformTab).toHaveAttribute('aria-selected', 'true');

    await expect(explorer.locator('h3')).toHaveText('Transform a response');
    await expect(explorer.locator('text=The deployment guide is ready.').first()).toBeVisible();
    await expect(explorer.locator('.explorer-module__Dtz3lG__resultItem:has-text("Source: internal docs"), div[class*="resultItem"]:has-text("Source: internal docs")').first()).toBeVisible();

    const runBtn = explorer.locator('button:has-text("Run example")');
    await expect(runBtn).toBeVisible();
  });

  test('manual tab switching and keyboard navigation works', async ({ page }) => {
    const explorer = page.locator('#explore');
    const transformTab = explorer.locator('#tab-transform');
    const filterTab = explorer.locator('#tab-filter');
    const meshTab = explorer.locator('#tab-mesh');
    const auditTab = explorer.locator('#tab-audit');

    // Click filter tab
    await filterTab.click();
    await expect(filterTab).toHaveAttribute('aria-selected', 'true');
    await expect(transformTab).toHaveAttribute('aria-selected', 'false');
    await expect(explorer.locator('h3')).toHaveText('Shape the tool catalog');

    // Try hidden call secondary button in filter preset
    const tryHiddenBtn = explorer.locator('button:has-text("Try hidden call")');
    await expect(tryHiddenBtn).toBeVisible();
    await tryHiddenBtn.click();
    await expect(explorer.locator('text=TOOL_HIDDEN · upstream not called')).toBeVisible();

    // Click mesh tab
    await meshTab.click();
    await expect(meshTab).toHaveAttribute('aria-selected', 'true');
    await expect(explorer.locator('h3')).toHaveText('Connect named upstreams');

    // Click audit tab
    await auditTab.click();
    await expect(auditTab).toHaveAttribute('aria-selected', 'true');
    await expect(explorer.locator('h3')).toHaveText('Keep the evidence');
    await expect(explorer.locator('text=Audit event recorded')).toBeVisible();

    // Keyboard navigation: focus tab, ArrowRight, Enter
    await transformTab.focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    await expect(filterTab).toHaveAttribute('aria-selected', 'true');
  });

  test('run and replay trace finishes and updates status', async ({ page }) => {
    const explorer = page.locator('#explore');
    await explorer.scrollIntoViewIfNeeded();

    const runBtn = explorer.locator('button:has-text("Run example")');
    await runBtn.click();

    // Status announcement or button state changes to Running... or Replay trace
    await expect(explorer.locator('button:has-text("Replay trace")')).toBeVisible({
      timeout: 5000,
    });
  });

  test('mesh section button selects mesh preset and scrolls to explore', async ({ page }) => {
    const meshExploreBtn = page.locator('a:has-text("Explore multi-server composition")');
    await expect(meshExploreBtn).toBeVisible();

    await meshExploreBtn.click();

    const meshTab = page.locator('#tab-mesh');
    await expect(meshTab).toHaveAttribute('aria-selected', 'true');
  });
});
