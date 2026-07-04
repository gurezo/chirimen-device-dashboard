import { describe, expect, it } from 'vitest';
import type { DeviceInfo } from '@chirimen-device-dashboard/shared-types';
import { isPlatformSpecificExample } from '@chirimen-device-dashboard/shared-types';
import {
  bootstrapLegacyExampleEntry,
  bootstrapLegacyPlatformExamples,
  deriveExampleDeviceId,
  isLegacyOnlyDevice,
} from './bootstrap-legacy-platform-examples';

function createLegacyDevice(
  id: string,
  examples: DeviceInfo['product']['example'],
  circuit?: string
): DeviceInfo {
  return {
    id,
    deviceName: id,
    tag: 'I2C',
    category: 'test',
    description: 'test',
    image: './no_image.png',
    product: {
      url: 'https://example.com/',
      example: examples,
      circuit,
    },
  };
}

describe('bootstrapLegacyPlatformExamples', () => {
  it('derives example device id from dashboard device id', () => {
    expect(deriveExampleDeviceId('i2c-grove-gesture-paj7620u2')).toBe(
      'grove-gesture-paj7620u2'
    );
    expect(deriveExampleDeviceId('gpio-led')).toBe('led');
  });

  it('detects legacy-only devices', () => {
    expect(
      isLegacyOnlyDevice(
        createLegacyDevice('i2c-grove-gesture-paj7620u2', [
          { hardware: 'chirimen', code: 'https://r.chirimen.org/examples/#I2C-Grove-Gesture' },
        ])
      )
    ).toBe(true);

    expect(
      isLegacyOnlyDevice(
        createLegacyDevice('i2c-adt7410', [
          {
            hardware: 'Pi Zero',
            code: 'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_adt7410',
            platform: 'pizero-esm',
            upstreamRepository: 'chirimen-oh/chirimen.org',
            upstreamPath: 'pizero/src/esm-examples/adt7410',
            upstreamRepositoryUrl: 'https://github.com/chirimen-oh/chirimen.org',
            upstreamPathUrl:
              'https://github.com/chirimen-oh/chirimen.org/tree/master/pizero/src/esm-examples/adt7410',
            status: 'primary',
          },
        ])
      )
    ).toBe(false);
  });

  it('bootstraps paj7620u2 with chirimen legacy and pizero-esm primary', () => {
    const entry = bootstrapLegacyExampleEntry(
      {
        hardware: 'chirimen',
        code: 'https://r.chirimen.org/examples/#I2C-Grove-Gesture',
      },
      {
        dashboardDeviceId: 'i2c-grove-gesture-paj7620u2',
        exampleDeviceId: 'paj7620',
        productCircuit: 'https://example.com/circuit.zip',
      }
    );

    expect(entry).toBeDefined();
    if (!entry) {
      throw new Error('Expected a legacy platform example entry');
    }
    expect(entry.platform).toBe('chirimen');
    expect(entry.status).toBe('legacy');
    expect(entry.circuitUrl).toBe('https://example.com/circuit.zip');
    expect(isPlatformSpecificExample(entry)).toBe(true);
  });

  it('bootstraps legacy devices into platform example entries', () => {
    const devices = [
      createLegacyDevice('i2c-grove-gesture-paj7620u2', [
        {
          hardware: 'chirimen',
          code: 'https://r.chirimen.org/examples/#I2C-Grove-Gesture',
        },
        {
          hardware: 'piZero',
          code: 'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_paj7620',
        },
      ]),
    ];

    const result = bootstrapLegacyPlatformExamples(devices, {
      overrideExampleDeviceIds: new Map([
        ['i2c-grove-gesture-paj7620u2', 'paj7620'],
      ]),
    });

    expect(result).toHaveLength(1);
    expect(result[0].exampleDeviceId).toBe('paj7620');
    expect(result[0].examples.map((example) => example.platform)).toEqual([
      'chirimen',
      'pizero-esm',
    ]);
    expect(result[0].examples.every(isPlatformSpecificExample)).toBe(true);
  });
});
