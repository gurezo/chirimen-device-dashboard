import { describe, expect, it } from 'vitest';
import type { PlatformExampleDeviceEntry } from './types';
import {
  detectDuplicatedDeviceProductExamples,
  detectDuplicatedPlatformExamples,
} from './detect-duplicated-platform-examples';

const duplicateEntry: PlatformExampleDeviceEntry = {
  dashboardDeviceId: 'i2c-adt7410',
  exampleDeviceId: 'adt7410',
  examples: [
    {
      hardware: 'Pi Zero',
      code: 'https://example.com/1',
      platform: 'pizero-esm',
      upstreamRepository: 'chirimen-oh/chirimen.org',
      upstreamRepositoryUrl: 'https://github.com/chirimen-oh/chirimen.org',
      upstreamPath: 'pizero/src/esm-examples/adt7410',
      upstreamPathUrl:
        'https://github.com/chirimen-oh/chirimen.org/tree/master/pizero/src/esm-examples/adt7410',
      status: 'primary',
      circuitUrl: 'https://example.com/1.png',
    },
    {
      hardware: 'Pi Zero',
      code: 'https://example.com/2',
      platform: 'pizero-esm',
      upstreamRepository: 'chirimen-oh/chirimen.org',
      upstreamRepositoryUrl: 'https://github.com/chirimen-oh/chirimen.org',
      upstreamPath: 'pizero/src/esm-examples/adt7410-copy',
      upstreamPathUrl:
        'https://github.com/chirimen-oh/chirimen.org/tree/master/pizero/src/esm-examples/adt7410-copy',
      status: 'legacy',
      circuitUrl: 'https://example.com/2.png',
    },
  ],
};

describe('detectDuplicatedPlatformExamples', () => {
  it('detects duplicate platforms in source data', () => {
    const issues = detectDuplicatedPlatformExamples([duplicateEntry]);
    expect(issues).toHaveLength(1);
    expect(issues[0].platform).toBe('pizero-esm');
  });
});

describe('detectDuplicatedDeviceProductExamples', () => {
  it('detects duplicate platforms in devices.json', () => {
    const issues = detectDuplicatedDeviceProductExamples([
      {
        id: duplicateEntry.dashboardDeviceId,
        product: { example: duplicateEntry.examples },
      },
    ]);

    expect(issues).toHaveLength(1);
    expect(issues[0].source).toBe('devices.json');
  });
});
