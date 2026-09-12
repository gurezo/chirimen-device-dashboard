import { describe, expect, it } from 'vitest';
import { isPlatformSpecificExample } from '@chirimen-device-dashboard/shared-types';
import {
  adaptCertifiedDevice,
  adaptCertifiedDevicesJson,
} from './certified-device.adapter';
import {
  isSupportedCertifiedDevicesVersion,
  SUPPORTED_CERTIFIED_DEVICES_VERSION,
  type CertifiedDevice,
  type CertifiedDevicesJson,
} from './certified-devices.types';

const ads1015Device: CertifiedDevice = {
  id: 'ADS1015',
  directory: 'devices/ADS1015',
  meta: {
    id: 'ADS1015',
    model: 'ADS1015',
    tag: 'I2C',
    category: 'ADC(アナログ電圧測定)',
    description:
      'アナログ電圧を 12bit 精度のデジタル信号に変換する部品で、アナログセンサ等を利用する際に必要です',
    image:
      'https://raw.githubusercontent.com/chirimen-oh/chirimen.org/master/partsImgs/ADS1015.jpg',
    productUrl: 'https://www.switch-science.com/catalog/1136/',
    examples: [
      {
        platform: 'legacy-gc-i2c',
        status: 'archive',
        upstreamRepository: 'chirimen-oh/chirimen',
        upstreamPath: 'gc/i2c/i2c-ADS1015',
        upstreamPathUrl:
          'https://github.com/chirimen-oh/chirimen/tree/master/gc/i2c/i2c-ADS1015',
        circuitUrl:
          'https://github.com/chirimen-oh/chirimen/blob/master/gc/i2c/i2c-ADS1015/schematic.png',
        driver: 'none',
        verified: false,
        platformLabel: 'Legacy CHIRIMEN GC (I2C)',
      },
      {
        platform: 'pizero-esm',
        status: 'primary',
        upstreamRepository: 'chirimen-oh/chirimen.org',
        upstreamPath: 'pizero/src/esm-examples/ads1015',
        upstreamPathUrl:
          'https://github.com/chirimen-oh/chirimen.org/tree/master/pizero/src/esm-examples/ads1015',
        circuitUrl:
          'https://github.com/chirimen-oh/chirimen.org/blob/master/pizero/src/esm-examples/ads1015/schematic.png',
        driver:
          'https://github.com/chirimen-oh/chirimen-drivers/tree/master/packages/ads1015',
        verified: false,
        platformLabel: 'Pi Zero / Raspberry Pi (ESM)',
      },
    ],
    circuit: 'https://github.com/adafruit/ADS1X15-Breakout-Board-PCBs',
    datasheet: 'https://cdn-shop.adafruit.com/datasheets/ads1015.pdf',
    reference: null,
    packages: ['@chirimen/ads1015'],
    platform: 'pizero-esm',
    status: 'primary',
    verified: false,
  },
};

const sampleJson: CertifiedDevicesJson = {
  version: SUPPORTED_CERTIFIED_DEVICES_VERSION,
  generatedAt: '2026-09-11T17:00:22.792Z',
  platforms: { platforms: {} },
  aliases: {
    directoryRules: {
      single: ' /',
      composite: ' _ /',
      remoteSingle: 'remote_ /',
      remoteComposite: 'remote_ _ /',
    },
    compositeDevices: {},
    remoteDevices: {},
    exampleNameAliases: {},
  },
  devices: [ads1015Device],
};

describe('isSupportedCertifiedDevicesVersion', () => {
  it('accepts version 1', () => {
    expect(isSupportedCertifiedDevicesVersion(1)).toBe(true);
  });

  it('rejects unknown versions', () => {
    expect(isSupportedCertifiedDevicesVersion(2)).toBe(false);
    expect(isSupportedCertifiedDevicesVersion(undefined)).toBe(false);
  });
});

describe('adaptCertifiedDevice', () => {
  it('maps basic fields, product url, and documentation links', () => {
    const device = adaptCertifiedDevice(ads1015Device);

    expect(device.id).toBe('ADS1015');
    expect(device.deviceName).toBe('ADS1015');
    expect(device.tag).toBe('I2C');
    expect(device.category).toBe('ADC(アナログ電圧測定)');
    expect(device.description).toContain('12bit');
    expect(device.image).toContain('ADS1015.jpg');
    expect(device.product.url).toBe(
      'https://www.switch-science.com/catalog/1136/',
    );
    expect(device.product.circuit).toBe(
      'https://github.com/adafruit/ADS1X15-Breakout-Board-PCBs',
    );
    expect(device.product.datasheet).toBe(
      'https://cdn-shop.adafruit.com/datasheets/ads1015.pdf',
    );
    expect(device.product).not.toHaveProperty('reference');
  });

  it('maps examples to ExampleInfo with hardware and platform fields', () => {
    const device = adaptCertifiedDevice(ads1015Device);
    const [legacy, pizero] = device.product.example;

    expect(legacy).toMatchObject({
      hardware: 'chirimen',
      code: 'https://github.com/chirimen-oh/chirimen/tree/master/gc/i2c/i2c-ADS1015',
      deviceId: 'ADS1015',
      platform: 'legacy-gc-i2c',
      upstreamRepository: 'chirimen-oh/chirimen',
      upstreamRepositoryUrl: 'https://github.com/chirimen-oh/chirimen',
      upstreamPath: 'gc/i2c/i2c-ADS1015',
      upstreamPathUrl:
        'https://github.com/chirimen-oh/chirimen/tree/master/gc/i2c/i2c-ADS1015',
      status: 'archive',
      verified: false,
    });
    expect(pizero.hardware).toBe('Pi Zero');
    expect(pizero.platform).toBe('pizero-esm');
    expect(pizero.status).toBe('primary');
  });

  it('produces examples that satisfy isPlatformSpecificExample', () => {
    const device = adaptCertifiedDevice(ads1015Device);

    expect(device.product.example.every(isPlatformSpecificExample)).toBe(true);
  });

  it('does not throw when nullable documentation and media fields are missing', () => {
    const sparse: CertifiedDevice = {
      id: '10k',
      directory: 'devices/10k',
      meta: {
        id: '10k',
        model: '10kΩ',
        tag: 'GPIO',
        category: 'カーボン抵抗',
        description: '抵抗',
        image: null,
        productUrl: null,
        examples: [],
        circuit: null,
        datasheet: null,
        reference: null,
      },
    };

    expect(() => adaptCertifiedDevice(sparse)).not.toThrow();

    const device = adaptCertifiedDevice(sparse);
    expect(device.image).toBe('');
    expect(device.product.url).toBe('');
    expect(device.product.example).toEqual([]);
    expect(device.product).not.toHaveProperty('circuit');
    expect(device.product).not.toHaveProperty('datasheet');
    expect(device.product).not.toHaveProperty('reference');
  });

  it('maps unknown tags to Other and unknown statuses to legacy', () => {
    const device = adaptCertifiedDevice({
      id: 'custom',
      directory: 'devices/custom',
      meta: {
        id: 'custom',
        model: 'Custom',
        tag: 'UnknownBus',
        category: '',
        description: '',
        image: '',
        productUrl: '',
        examples: [
          {
            platform: 'custom-platform',
            status: 'experimental',
            upstreamRepository: 'org/repo',
            upstreamPath: 'examples/custom',
            upstreamPathUrl: 'https://github.com/org/repo/tree/main/examples/custom',
          },
        ],
        circuit: null,
        datasheet: null,
        reference: null,
      },
    });

    expect(device.tag).toBe('Other');
    expect(device.product.example[0]?.hardware).toBe('custom-platform');
    expect(device.product.example[0]?.status).toBe('legacy');
  });

  it('falls back to device id when model is missing', () => {
    const device = adaptCertifiedDevice({
      id: 'fallback-id',
      directory: 'devices/fallback-id',
      meta: {
        id: 'fallback-id',
        model: '',
        tag: 'GPIO',
        category: '',
        description: '',
        image: '',
        productUrl: '',
        examples: [],
        circuit: null,
        datasheet: null,
        reference: null,
      },
    });

    expect(device.deviceName).toBe('fallback-id');
  });
});

describe('adaptCertifiedDevicesJson', () => {
  it('adapts a version 1 devices array', () => {
    const devices = adaptCertifiedDevicesJson(sampleJson);

    expect(devices).toHaveLength(1);
    expect(devices[0]?.id).toBe('ADS1015');
  });

  it('still adapts devices when the version is unknown', () => {
    const devices = adaptCertifiedDevicesJson({
      ...sampleJson,
      version: 99,
    });

    expect(isSupportedCertifiedDevicesVersion(99)).toBe(false);
    expect(devices).toHaveLength(1);
    expect(devices[0]?.id).toBe('ADS1015');
  });

  it('returns an empty array for invalid input', () => {
    expect(adaptCertifiedDevicesJson(null)).toEqual([]);
    expect(adaptCertifiedDevicesJson(undefined)).toEqual([]);
    expect(adaptCertifiedDevicesJson([])).toEqual([]);
    expect(adaptCertifiedDevicesJson({ version: 1 })).toEqual([]);
    expect(adaptCertifiedDevicesJson({ version: 1, devices: 'nope' })).toEqual(
      [],
    );
  });

  it('skips non-object device entries', () => {
    const devices = adaptCertifiedDevicesJson({
      version: 1,
      devices: [null, 'skip', ads1015Device],
    });

    expect(devices).toHaveLength(1);
    expect(devices[0]?.id).toBe('ADS1015');
  });
});
