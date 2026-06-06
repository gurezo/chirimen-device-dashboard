import { describe, expect, it } from 'vitest';
import { resolveExampleDeviceId } from './resolve-example-device-id';

describe('resolveExampleDeviceId', () => {
  it('accepts valid lowercase device ids', () => {
    expect(resolveExampleDeviceId('adt7410')).toBe('adt7410');
    expect(resolveExampleDeviceId('bme280')).toBe('bme280');
  });

  it('normalizes uppercase names', () => {
    expect(resolveExampleDeviceId('ADT7410')).toBe('adt7410');
  });

  it('normalizes legacy gc i2c directory names to lowercase id', () => {
    expect(resolveExampleDeviceId('i2c-ADT7410')).toBe('i2c-adt7410');
  });

  it('accepts gpio-prefixed directory names as device ids', () => {
    expect(resolveExampleDeviceId('gpio-led')).toBe('gpio-led');
  });

  it('returns null for invalid ids', () => {
    expect(resolveExampleDeviceId('i2c_ADT7410')).toBeNull();
    expect(resolveExampleDeviceId('')).toBeNull();
  });
});
