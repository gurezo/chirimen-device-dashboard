import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  isPlatformSpecificExample,
  type DeviceInfo,
} from '@chirimen-device-dashboard/shared-types';
import type { PlatformExampleDeviceEntry } from '../../sync-example-upstreams/src/types';
import { applyPlatformExamples } from './apply-platform-examples';

const repoRoot = path.resolve(__dirname, '../../../..');
const platformExamplesPath = path.join(
  repoRoot,
  'data/platform-examples/platform-examples.json'
);

function loadPlatformExamplesFixture(): PlatformExampleDeviceEntry[] {
  return JSON.parse(readFileSync(platformExamplesPath, 'utf8'));
}

function createDevice(
  id: string,
  examples: DeviceInfo['product']['example']
): DeviceInfo {
  return {
    id,
    deviceName: id,
    tag: 'I2C',
    category: 'test',
    description: 'test device',
    image: './no_image.png',
    product: {
      url: 'https://example.com/',
      example: examples,
    },
  };
}

describe('applyPlatformExamples', () => {
  it('replaces i2c-adt7410 product.example with 5 platform entries', () => {
    const platformEntries = loadPlatformExamplesFixture();
    const devices = [
      createDevice('i2c-adt7410', [
        { hardware: 'chirimen', code: 'https://r.chirimen.org/examples/#I2C-ADT7410' },
        { hardware: 'microbit', code: 'https://chirimen.org/chirimen-micro-bit/examples/#I2C1_ADT7410' },
        { hardware: 'piZero', code: 'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_adt7410' },
      ]),
    ];

    const { devices: merged, warnings } = applyPlatformExamples(
      devices,
      platformEntries
    );

    expect(warnings).toHaveLength(0);
    expect(merged[0].product.example).toHaveLength(5);
  });

  it('includes all required ADT7410 platforms as platform-specific examples', () => {
    const platformEntries = loadPlatformExamplesFixture();
    const devices = [createDevice('i2c-adt7410', [])];

    const { devices: merged } = applyPlatformExamples(devices, platformEntries);
    const examples = merged[0].product.example;

    const platforms = examples
      .map((example) => example.platform)
      .filter(Boolean);

    expect(platforms).toEqual([
      'pizero-esm',
      'node',
      'raspi-node',
      'microbit-driver',
      'legacy-gc-i2c',
    ]);
    expect(examples.every(isPlatformSpecificExample)).toBe(true);
  });

  it('preserves legacy hardware and code fields for transition compatibility', () => {
    const platformEntries = loadPlatformExamplesFixture();
    const devices = [createDevice('i2c-adt7410', [])];

    const { devices: merged } = applyPlatformExamples(devices, platformEntries);

    for (const example of merged[0].product.example) {
      expect(example.hardware?.trim()).not.toBe('');
      expect(example.code?.trim()).not.toBe('');
    }
  });

  it('keeps product.example unchanged for devices not listed in platform-examples.json', () => {
    const platformEntries = loadPlatformExamplesFixture();
    const originalExamples = [
      { hardware: 'chirimen', code: 'https://r.chirimen.org/examples/#I2C-ADS1015' },
      {
        hardware: 'piZero',
        code: 'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_ads1015',
      },
    ];
    const devices = [
      createDevice('i2c-ads1015', originalExamples),
      createDevice('i2c-adt7410', [{ hardware: 'chirimen', code: 'https://example.com' }]),
    ];

    const { devices: merged } = applyPlatformExamples(devices, platformEntries);

    expect(merged[0].product.example).toEqual(originalExamples);
    expect(merged[1].product.example).toHaveLength(5);
  });

  it('warns when platform-examples.json references an unknown dashboardDeviceId', () => {
    const platformEntries: PlatformExampleDeviceEntry[] = [
      {
        dashboardDeviceId: 'i2c-unknown-device',
        exampleDeviceId: 'unknown',
        examples: [{ hardware: 'test', code: 'https://example.com' }],
      },
    ];
    const devices = [createDevice('i2c-ads1015', [])];

    const { devices: merged, warnings } = applyPlatformExamples(
      devices,
      platformEntries
    );

    expect(merged[0].product.example).toEqual([]);
    expect(warnings).toEqual([
      'platform-examples.json references unknown dashboardDeviceId: i2c-unknown-device',
    ]);
  });
});
