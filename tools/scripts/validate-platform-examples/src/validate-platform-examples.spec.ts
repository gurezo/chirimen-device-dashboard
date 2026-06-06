import { describe, expect, it } from 'vitest';
import {
  assertValidPlatformExamples,
  validateAdt7410Platforms,
  validatePlatformExamples,
} from './validate-platform-examples';
import type { PlatformExampleDeviceEntry } from './types';

const knownDeviceIds = new Set(['i2c-adt7410']);

const validAdt7410Entry: PlatformExampleDeviceEntry = {
  dashboardDeviceId: 'i2c-adt7410',
  exampleDeviceId: 'adt7410',
  examples: [
    {
      hardware: 'Pi Zero',
      code: 'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_adt7410',
      deviceId: 'adt7410',
      platform: 'pizero-esm',
      localPath: 'examples/devices/adt7410/platforms/pizero-esm',
      upstreamRepository: 'chirimen-oh/chirimen.org',
      upstreamRepositoryUrl: 'https://github.com/chirimen-oh/chirimen.org',
      upstreamPath: 'pizero/src/esm-examples/adt7410',
      upstreamPathUrl:
        'https://github.com/chirimen-oh/chirimen.org/tree/master/pizero/src/esm-examples/adt7410',
      status: 'primary',
      circuitUrl:
        'https://github.com/chirimen-oh/chirimen.org/blob/master/pizero/src/esm-examples/adt7410/PiZero_ADT7410.png',
      verified: false,
    },
    {
      hardware: 'Raspberry Pi',
      code: 'https://github.com/chirimen-oh/chirimen-drivers/tree/master/node-examples/adt7410',
      deviceId: 'adt7410',
      platform: 'node',
      localPath: 'examples/devices/adt7410/platforms/node',
      upstreamRepository: 'chirimen-oh/chirimen-drivers',
      upstreamRepositoryUrl: 'https://github.com/chirimen-oh/chirimen-drivers',
      upstreamPath: 'node-examples/adt7410',
      upstreamPathUrl:
        'https://github.com/chirimen-oh/chirimen-drivers/tree/master/node-examples/adt7410',
      status: 'legacy',
      circuitUrl:
        'https://github.com/chirimen-oh/chirimen-drivers/blob/master/node-examples/adt7410/schematic.png',
      verified: false,
    },
    {
      hardware: 'Raspberry Pi',
      code: 'https://github.com/chirimen-oh/chirimen-drivers/tree/master/raspi-examples/adt7410',
      deviceId: 'adt7410',
      platform: 'raspi-node',
      localPath: 'examples/devices/adt7410/platforms/raspi-node',
      upstreamRepository: 'chirimen-oh/chirimen-drivers',
      upstreamRepositoryUrl: 'https://github.com/chirimen-oh/chirimen-drivers',
      upstreamPath: 'raspi-examples/adt7410',
      upstreamPathUrl:
        'https://github.com/chirimen-oh/chirimen-drivers/tree/master/raspi-examples/adt7410',
      status: 'legacy',
      circuitUrl:
        'https://github.com/chirimen-oh/chirimen-drivers/blob/master/raspi-examples/adt7410/schematic.png',
      verified: false,
    },
    {
      hardware: 'micro:bit',
      code: 'https://chirimen.org/chirimen-micro-bit/examples/#I2C1_ADT7410',
      deviceId: 'adt7410',
      platform: 'microbit-driver',
      localPath: 'examples/devices/adt7410/platforms/microbit-driver',
      upstreamRepository: 'chirimen-oh/chirimen-drivers',
      upstreamRepositoryUrl: 'https://github.com/chirimen-oh/chirimen-drivers',
      upstreamPath: 'microbit-examples/adt7410',
      upstreamPathUrl:
        'https://github.com/chirimen-oh/chirimen-drivers/tree/master/microbit-examples/adt7410',
      status: 'legacy',
      circuitUrl:
        'https://github.com/chirimen-oh/chirimen-drivers/blob/master/microbit-examples/adt7410/imgs/pinbit_adt7410.png',
      verified: false,
    },
    {
      hardware: 'chirimen',
      code: 'https://r.chirimen.org/examples/#I2C-ADT7410',
      deviceId: 'adt7410',
      platform: 'legacy-gc-i2c',
      localPath: 'examples/devices/adt7410/platforms/legacy-gc-i2c',
      upstreamRepository: 'chirimen-oh/chirimen',
      upstreamRepositoryUrl: 'https://github.com/chirimen-oh/chirimen',
      upstreamPath: 'gc/i2c/i2c-ADT7410',
      upstreamPathUrl:
        'https://github.com/chirimen-oh/chirimen/tree/master/gc/i2c/i2c-ADT7410',
      status: 'archive',
      circuitUrl:
        'https://github.com/chirimen-oh/chirimen/blob/master/gc/i2c/i2c-ADT7410/schematic.png',
      verified: false,
    },
  ],
};

describe('validatePlatformExamples', () => {
  it('accepts valid entries', () => {
    expect(validatePlatformExamples([validAdt7410Entry], knownDeviceIds)).toHaveLength(
      0
    );
  });

  it('reports missing hardware', () => {
    const entry = structuredClone(validAdt7410Entry);
    entry.examples[0].hardware = '';
    const errors = validatePlatformExamples([entry], knownDeviceIds);
    expect(errors.some((e) => e.field === 'hardware')).toBe(true);
  });

  it('reports unknown dashboardDeviceId', () => {
    const entry = structuredClone(validAdt7410Entry);
    entry.dashboardDeviceId = 'i2c-unknown';
    const errors = validatePlatformExamples([entry], knownDeviceIds);
    expect(errors.some((e) => e.field === 'dashboardDeviceId')).toBe(true);
  });

  it('reports missing exampleDeviceId', () => {
    const entry = structuredClone(validAdt7410Entry);
    entry.exampleDeviceId = '';
    const errors = validatePlatformExamples([entry], knownDeviceIds);
    expect(errors.some((e) => e.field === 'exampleDeviceId')).toBe(true);
  });

  it('reports invalid status', () => {
    const entry = structuredClone(validAdt7410Entry);
    entry.examples[0].status = 'invalid' as typeof entry.examples[0]['status'];
    const errors = validatePlatformExamples([entry], knownDeviceIds);
    expect(errors.some((e) => e.field === 'status')).toBe(true);
  });
});

describe('validateAdt7410Platforms', () => {
  it('passes when all 5 platforms are present', () => {
    expect(validateAdt7410Platforms([validAdt7410Entry])).toHaveLength(0);
  });

  it('reports missing platforms', () => {
    const entry = structuredClone(validAdt7410Entry);
    entry.examples = entry.examples.filter((e) => e.platform !== 'legacy-gc-i2c');
    const errors = validateAdt7410Platforms([entry]);
    expect(errors.some((e) => e.platform === 'legacy-gc-i2c')).toBe(true);
  });
});

describe('assertValidPlatformExamples', () => {
  it('does not throw for valid ADT7410 entry', () => {
    expect(() =>
      assertValidPlatformExamples([validAdt7410Entry], knownDeviceIds, {
        requireAdt7410: true,
      })
    ).not.toThrow();
  });
});
