import { test, expect } from '@playwright/test';

test.describe('Device ID / URL 互換', () => {
  test('canonical id shows the device detail page', async ({ page }) => {
    await page.goto('/devices/ADS1015');

    await expect(page).toHaveURL(/\/devices\/ADS1015$/);
    await expect(page.getByRole('heading', { name: 'ADS1015', exact: true })).toBeVisible();
  });

  test('legacy dashboard id redirects to the canonical url', async ({
    page,
  }) => {
    await page.goto('/devices/i2c-ads1015');

    await expect(page).toHaveURL(/\/devices\/ADS1015$/);
    await expect(page.getByRole('heading', { name: 'ADS1015', exact: true })).toBeVisible();
  });

  test('case-insensitive id redirects to the canonical url', async ({
    page,
  }) => {
    await page.goto('/devices/ads1015');

    await expect(page).toHaveURL(/\/devices\/ADS1015$/);
    await expect(page.getByRole('heading', { name: 'ADS1015', exact: true })).toBeVisible();
  });

  test('unknown id shows not found', async ({ page }) => {
    await page.goto('/devices/not-a-real-device');

    await expect(page).toHaveURL(/\/devices\/not-a-real-device$/);
    await expect(
      page.getByRole('heading', { name: 'デバイスが見つかりません' }),
    ).toBeVisible();
    await expect(
      page.getByText('「not-a-real-device」は登録されていません。'),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: '一覧に戻る' })).toBeVisible();
  });

  test('list navigation uses the canonical id and survives reload', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByLabel('検索').fill('ADS1015');

    const row = page.locator('choh-device-list-item').filter({
      hasText: 'ADS1015',
    });
    await expect(row).toBeVisible();
    await row.click();

    await expect(page).toHaveURL(/\/devices\/ADS1015$/);
    await expect(page.getByRole('heading', { name: 'ADS1015', exact: true })).toBeVisible();

    await page.reload();

    await expect(page).toHaveURL(/\/devices\/ADS1015$/);
    await expect(page.getByRole('heading', { name: 'ADS1015', exact: true })).toBeVisible();
  });
});
