import { describe, expect, it } from 'vitest';
import type { DeviceInfo } from '@chirimen-device-dashboard/shared-types';
import {
  comparePlatformExamplesWithSource,
  validateDeviceProductExample,
  validateDeviceProductExamples,
} from './validate-device-product-examples';

const platformSpecificExample = {
  hardware: 'Pi Zero',
  code: 'https://example.com/code',
  platform: 'pizero-esm',
  upstreamRepository: 'chirimen-oh/chirimen.org',
  upstreamRepositoryUrl: 'https://github.com/chirimen-oh/chirimen.org',
  upstreamPath: 'pizero/src/esm-examples/adt7410',
  upstreamPathUrl:
    'https://github.com/chirimen-oh/chirimen.org/tree/master/pizero/src/esm-examples/adt7410',
  status: 'primary' as const,
  circuitUrl: 'https://example.com/circuit.png',
};

function createDevice(examples: DeviceInfo['product']['example']): DeviceInfo {
  return {
    id: 'i2c-adt7410',
    deviceName: 'ADT7410',
    tag: 'I2C',
    category: 'test',
    description: 'test',
    image: './no_image.png',
    product: {
      url: 'https://example.com/',
      example: examples,
    },
  };
}

describe('validateDeviceProductExample', () => {
  it('skips platform-specific checks for legacy-only examples', () => {
    const issues = validateDeviceProductExample('i2c-ads1015', {
      hardware: 'chirimen',
      code: 'https://example.com/legacy',
    });

    expect(issues).toHaveLength(0);
  });

  it('validates platform-specific examples', () => {
    const issues = validateDeviceProductExample('i2c-adt7410', {
      ...platformSpecificExample,
      circuitUrl: '',
    });

    expect(issues.some((issue) => issue.field === 'circuitUrl')).toBe(true);
  });
});

describe('validateDeviceProductExamples', () => {
  it('accepts mixed legacy and platform-specific examples', () => {
    const devices = [
      createDevice([
        { hardware: 'chirimen', code: 'https://example.com/legacy' },
        platformSpecificExample,
      ]),
    ];

    expect(validateDeviceProductExamples(devices)).toHaveLength(0);
  });
});

describe('comparePlatformExamplesWithSource', () => {
  it('warns when devices.json platforms differ from source', () => {
    const devices = [
      createDevice([platformSpecificExample]),
    ];
    const sourceEntries = [
      {
        dashboardDeviceId: 'i2c-adt7410',
        examples: [
          {
            ...platformSpecificExample,
            platform: 'node',
          },
        ],
      },
    ];

    const warnings = comparePlatformExamplesWithSource(devices, sourceEntries);
    expect(warnings).toHaveLength(1);
    expect(warnings[0].message).toContain('platform list mismatch');
  });
});
