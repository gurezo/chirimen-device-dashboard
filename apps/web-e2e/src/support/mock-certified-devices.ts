import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Page } from '@playwright/test';

export const CERTIFIED_DEVICES_JSON_URL =
  'https://raw.githubusercontent.com/gurezo/chirimen-certified-devices/main/generated/devices.json';

const fixturePath = join(
  __dirname,
  '..',
  'fixtures',
  'certified-devices.json',
);

export function loadCertifiedDevicesFixture(): unknown {
  return JSON.parse(readFileSync(fixturePath, 'utf8'));
}

function isCertifiedDevicesJsonUrl(url: URL): boolean {
  return url.href.split('?')[0] === CERTIFIED_DEVICES_JSON_URL;
}

export async function mockCertifiedDevicesJson(
  page: Page,
  body: unknown = loadCertifiedDevicesFixture(),
): Promise<void> {
  await page.route(isCertifiedDevicesJsonUrl, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(body),
    });
  });
}

export async function mockCertifiedDevicesJsonError(
  page: Page,
  status = 500,
): Promise<void> {
  await page.route(isCertifiedDevicesJsonUrl, async (route) => {
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: '{}',
    });
  });
}
