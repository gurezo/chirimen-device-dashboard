import { describe, expect, it } from 'vitest';
import type { DeviceInfo } from '@chirimen-device-dashboard/shared-types';
import type { CertifiedAliases } from './certified-devices.types';
import {
  buildDeviceIdIndex,
  parseCertifiedAliases,
  resolveDeviceId,
} from './resolve-device-id';

function device(
  id: string,
  tag: DeviceInfo['tag'],
  deviceName = id,
): DeviceInfo {
  return {
    id,
    deviceName,
    tag,
    category: '',
    description: '',
    image: '',
    product: { url: '', example: [] },
  };
}

const emptyAliases: CertifiedAliases = {
  directoryRules: {
    single: '',
    composite: '',
    remoteSingle: '',
    remoteComposite: '',
  },
  compositeDevices: {},
  remoteDevices: {},
  exampleNameAliases: {},
};

const ads1015 = device('ADS1015', 'I2C', 'ADS1015');
const analogDevice = device('device', 'Analog', 'ジェネリック品多種');
const gpioLed = device('device-2', 'GPIO', 'フレキシブルＬＥＤ　緑色');
const composite = device('PCA9685_MX1508', 'I2C', 'PCA9685_MX1508');

const aliases: CertifiedAliases = {
  ...emptyAliases,
  compositeDevices: {
    PCA9685_MX1508: {
      models: ['PCA9685', 'MX1508'],
      description: 'PCA9685 + MX1508',
    },
  },
  exampleNameAliases: {
    ADS1015: {
      directoryId: 'ADS1015',
      exampleDeviceId: 'ads1015',
      legacyExampleNames: ['I2C-ADS1015', 'ads1015', 'ADS1015'],
    },
    PCA9685_MX1508: {
      directoryId: 'PCA9685_MX1508',
      exampleDeviceId: 'pca9685_mx1508',
      legacyExampleNames: [
        'I2C-PCA9685',
        'GPIO-I2C-PWMHBridge-1',
        'pca9685',
        'PCA9685_MX1508',
      ],
    },
  },
};

describe('parseCertifiedAliases', () => {
  it('returns undefined for non-objects', () => {
    expect(parseCertifiedAliases(undefined)).toBeUndefined();
    expect(parseCertifiedAliases(null)).toBeUndefined();
    expect(parseCertifiedAliases([])).toBeUndefined();
  });

  it('extracts example and composite aliases from a loose payload', () => {
    const parsed = parseCertifiedAliases({
      exampleNameAliases: {
        ADS1015: {
          directoryId: 'ADS1015',
          exampleDeviceId: 'ads1015',
          legacyExampleNames: ['I2C-ADS1015'],
        },
      },
      compositeDevices: {
        PCA9685_MX1508: {
          models: ['PCA9685', 'MX1508'],
          description: 'composite',
        },
      },
    });

    expect(parsed?.exampleNameAliases['ADS1015']?.exampleDeviceId).toBe(
      'ads1015',
    );
    expect(parsed?.compositeDevices['PCA9685_MX1508']?.models).toEqual([
      'PCA9685',
      'MX1508',
    ]);
  });
});

describe('resolveDeviceId', () => {
  const index = buildDeviceIdIndex(
    [ads1015, analogDevice, gpioLed, composite],
    aliases,
  );

  it('resolves the canonical id exactly', () => {
    expect(resolveDeviceId(index, 'ADS1015')).toEqual({
      device: ads1015,
      match: 'exact',
    });
  });

  it('resolves a case-insensitive canonical id', () => {
    expect(resolveDeviceId(index, 'ads1015')).toEqual({
      device: ads1015,
      match: 'case',
    });
  });

  it('resolves a tag-prefixed dashboard legacy id', () => {
    expect(resolveDeviceId(index, 'i2c-ads1015')).toEqual({
      device: ads1015,
      match: 'legacy',
    });
  });

  it('resolves a certified example legacy name', () => {
    expect(resolveDeviceId(index, 'I2C-ADS1015')).toEqual({
      device: ads1015,
      match: 'legacy',
    });
  });

  it('resolves a composite example alias to the composite device', () => {
    expect(resolveDeviceId(index, 'i2c-pca9685')).toEqual({
      device: composite,
      match: 'alias',
    });
  });

  it('resolves a composite model that has no standalone device', () => {
    expect(resolveDeviceId(index, 'MX1508')).toEqual({
      device: composite,
      match: 'alias',
    });
  });

  it('resolves analog-device to the Analog canonical device', () => {
    expect(resolveDeviceId(index, 'analog-device')).toEqual({
      device: analogDevice,
      match: 'legacy',
    });
  });

  it('does not map gpio-device onto the Analog device id collision', () => {
    expect(resolveDeviceId(index, 'gpio-device')).toBeNull();
  });

  it('returns null for unknown ids', () => {
    expect(resolveDeviceId(index, 'not-a-real-device')).toBeNull();
    expect(resolveDeviceId(index, '')).toBeNull();
    expect(resolveDeviceId(index, '   ')).toBeNull();
  });

  it('does not register an ambiguous alias claimed by two devices', () => {
    const shared = {
      ...emptyAliases,
      exampleNameAliases: {
        ADS1015: {
          directoryId: 'ADS1015',
          exampleDeviceId: 'shared-id',
          legacyExampleNames: [],
        },
        device: {
          directoryId: 'device',
          exampleDeviceId: 'shared-id',
          legacyExampleNames: [],
        },
      },
    };
    const colliding = buildDeviceIdIndex([ads1015, analogDevice], shared);

    expect(resolveDeviceId(colliding, 'shared-id')).toBeNull();
    expect(resolveDeviceId(colliding, 'ADS1015')?.device).toBe(ads1015);
  });
});
