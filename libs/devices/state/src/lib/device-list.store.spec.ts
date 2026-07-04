import { TestBed } from '@angular/core/testing';
import {
  DEVICE_REPOSITORY,
  type DeviceRepository,
} from '@chirimen-device-dashboard/libs-data-access';
import type { DeviceInfo } from '@chirimen-device-dashboard/shared-types';
import { firstValueFrom, of } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DeviceListStore } from './device-list.store';

const devices: DeviceInfo[] = [
  {
    id: 'i2c-adt7410',
    deviceName: 'ADT7410',
    tag: 'I2C',
    category: '温度センサ',
    description: '温度センサ',
    image: 'https://example.com/adt7410.jpg',
    product: {
      url: 'https://example.com/adt7410',
      example: [
        {
          hardware: 'Pi Zero',
          code: 'https://example.com/pizero/adt7410',
          platform: 'pizero-esm',
          deviceId: 'adt7410',
        },
      ],
    },
  },
  {
    id: 'i2c-ads1015',
    deviceName: 'ADS1015',
    tag: 'I2C',
    category: 'ADC',
    description: 'アナログ電圧測定',
    image: 'https://example.com/ads1015.jpg',
    product: {
      url: 'https://example.com/ads1015',
      example: [
        {
          hardware: 'chirimen',
          code: 'https://example.com/legacy/ads1015',
          platform: 'legacy-gc-i2c',
          deviceId: 'ads1015',
        },
      ],
    },
  },
  {
    id: 'i2c-ads1115',
    deviceName: 'ADS1115',
    tag: 'I2C',
    category: 'ADC',
    description: 'アナログ電圧測定',
    image: 'https://example.com/ads1115.jpg',
    product: {
      url: 'https://example.com/ads1115',
      example: [
        {
          hardware: 'micro:bit',
          code: 'https://example.com/microbit/ads1115',
          platform: 'microbit-driver',
          deviceId: 'ads1115',
        },
      ],
    },
  },
  {
    id: 'gpio-led',
    deviceName: 'LED',
    tag: 'GPIO',
    category: 'LED',
    description: 'LED',
    image: 'https://example.com/led.jpg',
    product: {
      url: 'https://example.com/led',
      example: [
        {
          hardware: 'Pi Zero',
          code: 'https://example.com/pizero/led',
          platform: 'pizero-esm',
          deviceId: 'led',
        },
      ],
    },
  },
];

const mockRepository: DeviceRepository = {
  list: () => of(devices),
  get: () => of(null),
};

describe('DeviceListStore', () => {
  let store: DeviceListStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DeviceListStore,
        { provide: DEVICE_REPOSITORY, useValue: mockRepository },
      ],
    });

    store = TestBed.inject(DeviceListStore);
    store.patchState({ devices });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  async function filteredIds(query: string): Promise<string[]> {
    store.setQuery(query);
    const filteredDevices = await firstValueFrom(store.filteredDevices$);
    return filteredDevices.map((device) => device.id);
  }

  it('preserves existing single keyword search', async () => {
    await expect(filteredIds('adt')).resolves.toEqual(['i2c-adt7410']);
  });

  it('matches microbit and micro:bit platform keywords', async () => {
    await expect(filteredIds('microbit')).resolves.toEqual(['i2c-ads1115']);
    await expect(filteredIds('micro:bit')).resolves.toEqual(['i2c-ads1115']);
  });

  it('matches raspberry platform keywords', async () => {
    await expect(filteredIds('raspberry')).resolves.toEqual([
      'i2c-adt7410',
      'i2c-ads1015',
      'gpio-led',
    ]);
  });

  it('does not treat legacy GC I2C as Pi Zero compatible', async () => {
    await expect(filteredIds('pi zero')).resolves.toEqual([
      'i2c-adt7410',
      'gpio-led',
    ]);
  });

  it('filters by multiple keywords with AND semantics', async () => {
    await expect(filteredIds('i2c raspberry')).resolves.toEqual([
      'i2c-adt7410',
      'i2c-ads1015',
    ]);
  });

  it('ignores extra whitespace and keyword casing', async () => {
    await expect(filteredIds('  I2C   RASPBERRY  ')).resolves.toEqual([
      'i2c-adt7410',
      'i2c-ads1015',
    ]);
  });
});
