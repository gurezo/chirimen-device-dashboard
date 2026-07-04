import type { ExampleInfo } from '@chirimen-device-dashboard/shared-types';

export const adt7410PlatformExamples: ExampleInfo[] = [
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
];

export const legacyOnlyExamples: ExampleInfo[] = [
  {
    hardware: 'chirimen',
    code: 'https://r.chirimen.org/examples/#I2C-ADS1015',
  },
  {
    hardware: 'piZero',
    code: 'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_ads1015',
  },
];
