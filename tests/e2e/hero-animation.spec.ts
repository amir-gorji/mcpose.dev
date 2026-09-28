import { test, expect } from '@playwright/test';

test('hero animates on desktop and mobile, pauses, and resumes', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  const artwork = page.getByRole('img', { name: 'A request transforms through mcpose layers, then returns as a refined response' });
  await artwork.scrollIntoViewIfNeeded();
  await expect(artwork).toBeVisible();
  const token = artwork.locator('[data-part="token"]');
  const initial = await token.getAttribute('transform');
  await expect.poll(() => token.getAttribute('transform')).not.toBe(initial);
  await page.getByRole('button', { name: 'Pause illustration' }).click();
  const stopped = await token.getAttribute('transform');
  await page.clock.install();
  await page.clock.runFor(1000);
  await expect(token).toHaveAttribute('transform', stopped!);
  await page.getByRole('button', { name: 'Play illustration' }).click();
  await page.clock.runFor(500);
  await expect(token).not.toHaveAttribute('transform', stopped!);
  await page.getByRole('button', { name: 'Pause illustration' }).click();
  await page.screenshot({ path: testInfo.outputPath('hero-light.png'), fullPage: false });
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.screenshot({ path: testInfo.outputPath('hero-dark.png'), fullPage: false });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('hero respects reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const artwork = page.getByRole('img', { name: 'A request transforms through mcpose layers, then returns as a refined response' });
  await artwork.scrollIntoViewIfNeeded();
  const token = artwork.locator('[data-part="token"]');
  const initial = await token.getAttribute('transform');
  await page.clock.install();
  await page.clock.runFor(10000);
  await expect(token).toHaveAttribute('transform', initial!);
  await expect(page.getByRole('button', { name: 'Pause illustration' })).toBeHidden();
});

test('pause does not rebuild SVG geometry', async ({ page }) => {
  await page.addInitScript(() => {
    const original = SVGGeometryElement.prototype.getPointAtLength;
    let calls = 0;
    SVGGeometryElement.prototype.getPointAtLength = function (distance) {
      calls++;
      return original.call(this, distance);
    };
    Object.defineProperty(window, 'geometryCalls', { get: () => calls });
  });
  await page.goto('/');
  const button = page.getByRole('button', { name: 'Pause illustration' });
  await button.scrollIntoViewIfNeeded();
  const measured = await button.evaluate(element => {
    const count = () => (window as unknown as { geometryCalls: number }).geometryCalls;
    const before = count();
    const start = performance.now();
    (element as HTMLButtonElement).click();
    return new Promise<{ calls: number; milliseconds: number }>(resolve => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve({ calls: count() - before, milliseconds: performance.now() - start })));
    });
  });
  expect(measured.calls, 'pause must not rescan the route').toBeLessThanOrEqual(2);
});

test('message is approved, adapted, simplified, and masked through a full loop', async ({ page }) => {
  await page.goto('/');
  const artwork = page.getByRole('img', { name: 'A request transforms through mcpose layers, then returns as a refined response' });
  await artwork.scrollIntoViewIfNeeded();
  await page.clock.install();
  const observed = new Set<string>();
  for (let i = 0; i < 30; i++) {
    await page.clock.runFor(500);
    const state = await artwork.evaluate(svg => {
      const attribute = (part: string, name: string) => svg.querySelector(`[data-part="${part}"]`)!.getAttribute(name);
      return {
        approved: attribute('approval', 'opacity') === '1',
        adapted: attribute('row1', 'width') === '14',
        simplified: attribute('row3', 'opacity') === '0',
        masked: attribute('mask', 'opacity') === '1',
      };
    });
    for (const [name, active] of Object.entries(state)) if (active) observed.add(name);
  }
  expect([...observed].sort()).toEqual(['adapted', 'approved', 'masked', 'simplified']);
  await expect(artwork.locator('[data-part="token"]')).toHaveAttribute('transform', /scale\(0\.9\)/);
});
