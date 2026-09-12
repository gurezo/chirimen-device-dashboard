import { test, expect } from '@playwright/test';
import { mockCertifiedDevicesJson } from './support/mock-certified-devices';

test.describe('Platform 別 Example', () => {
  test.beforeEach(async ({ page }) => {
    await mockCertifiedDevicesJson(page);
  });

  test('desktop shows platform examples table for ADS1015', async ({
    page,
  }) => {
    await page.goto('/devices/ADS1015');

    await expect(
      page.getByRole('heading', { name: 'Platform 別 Example' }),
    ).toBeVisible();

    const table = page.locator('table');
    await expect(table).toBeVisible();
    await expect(table.getByRole('cell', { name: 'pizero-esm' })).toBeVisible();
    await expect(
      table.getByRole('cell', { name: 'legacy-gc-i2c' }),
    ).toBeVisible();
    await expect(
      table.locator('a[href="https://github.com/chirimen-oh/chirimen.org"]'),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: '回路図 ↗' }).first()).toBeVisible();
  });

  test('mobile shows platform example cards', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/devices/ADS1015');

    await expect(
      page.getByRole('heading', { name: 'Platform 別 Example' }),
    ).toBeVisible();

    const card = page.locator('choh-platform-specific-example-card').first();
    await expect(card).toBeVisible();
    await expect(card.getByText('pizero-esm')).toBeVisible();
    await expect(page.locator('.hidden.md\\:block table')).toBeHidden();
  });
});
