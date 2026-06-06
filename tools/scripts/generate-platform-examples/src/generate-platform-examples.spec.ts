import { describe, expect, it } from 'vitest';
import type { ExampleInfo } from '@chirimen-device-dashboard/shared-types';
import {
  buildPlatformExamplesJson,
  generatePlatformExamples,
} from './generate-platform-examples';
import type { ExampleCandidateEntry, PlatformExampleDeviceEntry } from './types';

function makeExample(
  platform: string,
  overrides: Partial<ExampleInfo> = {}
): ExampleInfo {
  return {
    hardware: 'Pi Zero',
    code: `https://github.com/example/tree/master/${platform}`,
    deviceId: 'adt7410',
    platform,
    localPath: `examples/devices/adt7410/platforms/${platform}`,
    upstreamRepository: 'chirimen-oh/chirimen.org',
    upstreamRepositoryUrl: 'https://github.com/chirimen-oh/chirimen.org',
    upstreamPath: `pizero/src/esm-examples/adt7410`,
    upstreamPathUrl: `https://github.com/chirimen-oh/chirimen.org/tree/master/pizero/src/esm-examples/adt7410`,
    status: 'primary',
    circuitUrl:
      'https://github.com/chirimen-oh/chirimen.org/blob/master/pizero/src/esm-examples/adt7410/circuit.png',
    verified: false,
    ...overrides,
  };
}

describe('buildPlatformExamplesJson', () => {
  it('groups and sorts by dashboard device id and platform', () => {
    const grouped = new Map([
      [
        'i2c-adt7410',
        {
          exampleDeviceId: 'adt7410',
          examples: [
            makeExample('pizero-esm'),
            makeExample('node', { hardware: 'Raspberry Pi', status: 'legacy' }),
          ],
          warnings: [],
        },
      ],
    ]);

    const result = buildPlatformExamplesJson(grouped);
    expect(result).toHaveLength(1);
    expect(result[0].dashboardDeviceId).toBe('i2c-adt7410');
    expect(result[0].examples.map((e) => e.platform)).toEqual([
      'node',
      'pizero-esm',
    ]);
  });
});

describe('generatePlatformExamples', () => {
  const canonical: PlatformExampleDeviceEntry[] = [
    {
      dashboardDeviceId: 'i2c-adt7410',
      exampleDeviceId: 'adt7410',
      examples: [
        makeExample('pizero-esm', {
          hardware: 'Pi Zero',
          code: 'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_adt7410',
        }),
        makeExample('microbit-driver', {
          hardware: 'micro:bit',
          code: 'https://chirimen.org/chirimen-micro-bit/examples/#I2C1_ADT7410',
          status: 'legacy',
        }),
        makeExample('legacy-gc-i2c', {
          hardware: 'chirimen',
          code: 'https://r.chirimen.org/examples/#I2C-ADT7410',
          status: 'archive',
          upstreamRepository: 'chirimen-oh/chirimen',
          upstreamRepositoryUrl: 'https://github.com/chirimen-oh/chirimen',
          upstreamPath: 'gc/i2c/i2c-ADT7410',
          upstreamPathUrl:
            'https://github.com/chirimen-oh/chirimen/tree/master/gc/i2c/i2c-ADT7410',
        }),
      ],
    },
  ];

  it('merges legacy code and hardware from canonical entries', () => {
    const candidates: ExampleCandidateEntry[] = [
      {
        sourceId: 'src-a',
        upstreamDirName: 'adt7410',
        exampleDeviceId: 'adt7410',
        dashboardDeviceId: 'i2c-adt7410',
        dashboardMappingStatus: 'resolved',
        example: makeExample('pizero-esm', {
          code: 'https://github.com/chirimen-oh/chirimen.org/tree/master/pizero/src/esm-examples/adt7410',
        }),
        warnings: [],
      },
      {
        sourceId: 'src-b',
        upstreamDirName: 'adt7410',
        exampleDeviceId: 'adt7410',
        dashboardDeviceId: 'i2c-adt7410',
        dashboardMappingStatus: 'resolved',
        example: makeExample('microbit-driver', {
          hardware: 'micro:bit',
          status: 'legacy',
          upstreamRepository: 'chirimen-oh/chirimen-drivers',
          upstreamRepositoryUrl: 'https://github.com/chirimen-oh/chirimen-drivers',
          upstreamPath: 'microbit-examples/adt7410',
          upstreamPathUrl:
            'https://github.com/chirimen-oh/chirimen-drivers/tree/master/microbit-examples/adt7410',
        }),
        warnings: [],
      },
      {
        sourceId: 'src-c',
        upstreamDirName: 'i2c-ADT7410',
        exampleDeviceId: 'adt7410',
        dashboardDeviceId: 'i2c-adt7410',
        dashboardMappingStatus: 'override',
        example: makeExample('legacy-gc-i2c', {
          hardware: 'chirimen',
          status: 'archive',
          upstreamRepository: 'chirimen-oh/chirimen',
          upstreamRepositoryUrl: 'https://github.com/chirimen-oh/chirimen',
          upstreamPath: 'gc/i2c/i2c-ADT7410',
          upstreamPathUrl:
            'https://github.com/chirimen-oh/chirimen/tree/master/gc/i2c/i2c-ADT7410',
        }),
        warnings: [],
      },
    ];

    const result = generatePlatformExamples(candidates, canonical);
    const adt7410 = result.find((e) => e.dashboardDeviceId === 'i2c-adt7410');

    expect(
      adt7410?.examples.find((e) => e.platform === 'pizero-esm')?.code
    ).toBe('https://tutorial.chirimen.org/pizero/esm-examples/#I2C_adt7410');

    expect(
      adt7410?.examples.find((e) => e.platform === 'microbit-driver')?.code
    ).toBe('https://chirimen.org/chirimen-micro-bit/examples/#I2C1_ADT7410');

    expect(
      adt7410?.examples.find((e) => e.platform === 'legacy-gc-i2c')?.code
    ).toBe('https://r.chirimen.org/examples/#I2C-ADT7410');
    expect(
      adt7410?.examples.find((e) => e.platform === 'legacy-gc-i2c')?.hardware
    ).toBe('chirimen');
  });
});
