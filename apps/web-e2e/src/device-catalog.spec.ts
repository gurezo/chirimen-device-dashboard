import { test, expect } from '@playwright/test';
import {
  mockCertifiedDevicesJson,
  mockCertifiedDevicesJsonError,
} from './support/mock-certified-devices';

test.describe('デバイス一覧・詳細', () => {
  test.beforeEach(async ({ page }) => {
    await mockCertifiedDevicesJson(page);
  });

  test('lists fixture devices', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.locator('choh-device-list-item').filter({ hasText: 'ADS1015' }),
    ).toBeVisible();
    await expect(
      page.locator('choh-device-list-item').filter({ hasText: 'ADT7410' }),
    ).toBeVisible();
    await expect(
      page.locator('choh-device-list-item').filter({ hasText: '10kΩ' }),
    ).toBeVisible();
  });

  test('filters devices by search keyword', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('検索').fill('ADS1015');

    await expect(
      page.locator('choh-device-list-item').filter({ hasText: 'ADS1015' }),
    ).toBeVisible();
    await expect(
      page.locator('choh-device-list-item').filter({ hasText: 'ADT7410' }),
    ).toHaveCount(0);
    await expect(
      page.locator('choh-device-list-item').filter({ hasText: '10kΩ' }),
    ).toHaveCount(0);
  });

  test('shows empty state when search matches nothing', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('検索').fill('not-in-fixture');

    await expect(page.getByText('デバイスがありません。')).toBeVisible();
    await expect(page.locator('choh-device-list-item')).toHaveCount(0);
  });

  test('shows device detail fields', async ({ page }) => {
    await page.goto('/devices/ADS1015');

    await expect(page.getByRole('heading', { name: 'ADS1015', exact: true })).toBeVisible();
    await expect(page.getByText('I2C', { exact: true })).toBeVisible();
    await expect(page.getByText('ADC(アナログ電圧測定)')).toBeVisible();
    await expect(page.getByText(/12bit/)).toBeVisible();
    await expect(
      page.getByRole('link', { name: '商品ページを見る' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Platform 別 Example' }),
    ).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
  });

  test('hides platform examples when the device has none', async ({
    page,
  }) => {
    await page.goto('/devices/10k');

    await expect(page.getByRole('heading', { name: '10kΩ', exact: true })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Platform 別 Example' }),
    ).toHaveCount(0);
  });
});

test.describe('Certified Devices JSON 取得エラー', () => {
  test.beforeEach(async ({ page }) => {
    await mockCertifiedDevicesJsonError(page);
  });

  test('shows fetch error on the list page', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Failed to load devices: HTTP 500')).toBeVisible();
  });

  test('shows fetch error on the detail page', async ({ page }) => {
    await page.goto('/devices/ADS1015');

    await expect(page.getByText('Failed to load devices: HTTP 500')).toBeVisible();
    await expect(page.getByRole('link', { name: '一覧に戻る' })).toBeVisible();
  });
});
