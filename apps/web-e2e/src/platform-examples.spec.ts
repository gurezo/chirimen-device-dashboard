import { test, expect } from '@playwright/test';

test.describe('Platform 別 Example', () => {
  test('desktop shows platform examples table for i2c-adt7410', async ({
    page,
  }) => {
    await page.goto('/devices/i2c-adt7410');

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
      table.locator(
        'a[href="https://github.com/chirimen-oh/chirimen.org"]',
      ),
    ).toBeVisible();
  });

  test('desktop shows platform examples table for i2c-ads1015', async ({
    page,
  }) => {
    await page.goto('/devices/i2c-ads1015');

    await expect(
      page.getByRole('heading', { name: 'Platform 別 Example' }),
    ).toBeVisible();

    const table = page.locator('table');
    await expect(table).toBeVisible();
    await expect(table.getByRole('cell', { name: 'pizero-esm' })).toBeVisible();
  });

  test('desktop shows platform examples table for i2c-ht16k33-8x8led', async ({
    page,
  }) => {
    await page.goto('/devices/i2c-ht16k33-8x8led');

    await expect(
      page.getByRole('heading', { name: 'Platform 別 Example' }),
    ).toBeVisible();

    const table = page.locator('table');
    await expect(table).toBeVisible();
    await expect(table.getByRole('cell', { name: 'pizero-esm' })).toBeVisible();
  });

  test('desktop shows platform examples table for i2c-neopixel-led-8x8', async ({
    page,
  }) => {
    await page.goto('/devices/i2c-neopixel-led-8x8');

    await expect(
      page.getByRole('heading', { name: 'Platform 別 Example' }),
    ).toBeVisible();

    const table = page.locator('table');
    await expect(table).toBeVisible();
    await expect(table.getByRole('cell', { name: 'pizero-esm' })).toBeVisible();
  });

  test('desktop shows legacy-migrated platform examples for i2c-grove-gesture-paj7620u2', async ({
    page,
  }) => {
    await page.goto('/devices/i2c-grove-gesture-paj7620u2');

    await expect(
      page.getByRole('heading', { name: 'Platform 別 Example' }),
    ).toBeVisible();

    const table = page.locator('table');
    await expect(table).toBeVisible();
    await expect(
      table.getByRole('cell', { name: 'chirimen', exact: true }),
    ).toBeVisible();
    await expect(table.getByRole('cell', { name: 'pizero-esm' })).toBeVisible();
    await expect(table.getByRole('link', { name: '回路図 ↗' }).first()).toBeVisible();
  });

  test('mobile shows platform example cards', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/devices/i2c-adt7410');

    await expect(
      page.getByRole('heading', { name: 'Platform 別 Example' }),
    ).toBeVisible();

    const card = page.locator('choh-platform-specific-example-card').first();
    await expect(card).toBeVisible();
    await expect(card.getByText('pizero-esm')).toBeVisible();
    await expect(page.locator('.hidden.md\\:block table')).toBeHidden();
  });
});
