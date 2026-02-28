import { describe, it, expect } from 'vitest';
import {
  parseCsv,
  toSlug,
  toImageUrl,
  rowToDeviceInfo,
  assignUniqueIds,
} from './sync-devices';

describe('parseCsv', () => {
  it('parses simple CSV', () => {
    const result = parseCsv('a,b,c\n1,2,3');
    expect(result).toEqual([
      ['a', 'b', 'c'],
      ['1', '2', '3'],
    ]);
  });

  it('handles quoted fields with commas', () => {
    const result = parseCsv('a,"b,c",d\n1,2,3');
    expect(result).toEqual([
      ['a', 'b,c', 'd'],
      ['1', '2', '3'],
    ]);
  });
});

describe('toSlug', () => {
  it('converts to lowercase slug', () => {
    expect(toSlug('ADS1015')).toBe('ads1015');
  });

  it('replaces non-alphanumeric with hyphens', () => {
    expect(toSlug('HT16K33 8x8')).toBe('ht16k33-8x8');
  });

  it('returns device for empty string', () => {
    expect(toSlug('')).toBe('device');
  });
});

describe('toImageUrl', () => {
  it('returns no_image.png for empty string', () => {
    expect(toImageUrl('')).toBe('./no_image.png');
  });

  it('returns no_image.png for whitespace only', () => {
    expect(toImageUrl('   ')).toBe('./no_image.png');
  });

  it('prepends base URL for relative path', () => {
    expect(toImageUrl('partsImgs/ADS1015.jpg')).toContain('chirimen.org');
    expect(toImageUrl('partsImgs/ADS1015.jpg')).toContain('ADS1015.jpg');
  });

  it('returns as-is for absolute URL', () => {
    const url = 'https://example.com/image.jpg';
    expect(toImageUrl(url)).toBe(url);
  });
});

describe('rowToDeviceInfo', () => {
  it('returns null for unknown interface', () => {
    const row = ['Unknown', 'cat', 'name', '', '', '', '', '', '', '', '', '', '', '', '', ''];
    expect(rowToDeviceInfo(row)).toBeNull();
  });

  it('converts I2C row to DeviceInfo', () => {
    const row = [
      'I2C',
      'ADC(アナログ電圧測定)',
      'ADS1015',
      'https://example.com/',
      '説明',
      'partsImgs/ADS1015.jpg',
      'https://r.chirimen.org/examples/#I2C-ADS1015',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_ads1015',
    ];
    const device = rowToDeviceInfo(row);
    expect(device).not.toBeNull();
    if (device) {
      expect(device.id).toBe('i2c-ads1015');
      expect(device.deviceName).toBe('ADS1015');
      expect(device.tag).toBe('I2C');
      expect(device.category).toBe('ADC(アナログ電圧測定)');
      expect(device.image).toContain('ADS1015.jpg');
      expect(device.product.example).toHaveLength(2);
    }
  });

  it('uses no_image.png when image URL is empty', () => {
    const row = [
      'I2C',
      'cat',
      'TestDevice',
      'https://example.com/',
      'desc',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ];
    const device = rowToDeviceInfo(row);
    expect(device).not.toBeNull();
    if (device) {
      expect(device.image).toBe('./no_image.png');
    }
  });
});

describe('assignUniqueIds', () => {
  it('assigns unique ids for duplicates', () => {
    const devices = [
      { id: 'x', deviceName: 'Device A', tag: 'I2C' as const, category: '', description: '', image: '', product: { url: '', example: [] } },
      { id: 'x', deviceName: 'Device A', tag: 'I2C' as const, category: '', description: '', image: '', product: { url: '', example: [] } },
    ];
    const result = assignUniqueIds(devices);
    expect(result[0].id).toBe('i2c-device-a');
    expect(result[1].id).toBe('i2c-device-a-1');
  });
});
