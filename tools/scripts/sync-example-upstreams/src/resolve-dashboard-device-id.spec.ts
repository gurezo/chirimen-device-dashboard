import { describe, expect, it } from 'vitest';
import {
  findDashboardDeviceIdMatches,
  matchProductAlias,
  resolveDashboardDeviceId,
} from './resolve-dashboard-device-id';

describe('resolveDashboardDeviceId', () => {
  const dashboardDeviceIds = [
    'i2c-adt7410',
    'i2c-bme280',
    'i2c-foo',
    'gpio-foo',
    'i2c-ht16k33-8x8led',
    'i2c-ht16k33-8x8led-1',
    'i2c-ht16k33-16x8led',
    'i2c-neopixel-led',
    'i2c-neopixel-led-8x8',
    'i2c-neopixel-led-12x12',
  ];

  it('resolves unique suffix match', () => {
    const result = resolveDashboardDeviceId(
      'adt7410',
      dashboardDeviceIds,
      {}
    );
    expect(result.status).toBe('resolved');
    expect(result.dashboardDeviceIds).toEqual(['i2c-adt7410']);
  });

  it('uses override when provided', () => {
    const result = resolveDashboardDeviceId('foo', dashboardDeviceIds, {
      foo: 'i2c-foo',
    });
    expect(result.status).toBe('override');
    expect(result.dashboardDeviceIds).toEqual(['i2c-foo']);
  });

  it('supports override arrays', () => {
    const result = resolveDashboardDeviceId('foo', dashboardDeviceIds, {
      foo: ['i2c-foo', 'gpio-foo'],
    });
    expect(result.status).toBe('override');
    expect(result.dashboardDeviceIds).toEqual(['i2c-foo', 'gpio-foo']);
  });

  it('reports ambiguous matches across interface tags', () => {
    const result = resolveDashboardDeviceId('foo', dashboardDeviceIds, {});
    expect(result.status).toBe('ambiguous');
    expect(result.ambiguousDashboardDeviceIds).toEqual([
      'i2c-foo',
      'gpio-foo',
    ]);
  });

  it('reports unresolved when no match', () => {
    const result = resolveDashboardDeviceId(
      'unknown-device',
      dashboardDeviceIds,
      {}
    );
    expect(result.status).toBe('unresolved');
    expect(result.dashboardDeviceIds).toEqual([]);
  });

  it('fans out infix matches for ht16k33 variants', () => {
    const result = resolveDashboardDeviceId('ht16k33', dashboardDeviceIds, {});
    expect(result.status).toBe('fan-out');
    expect(result.dashboardDeviceIds).toEqual([
      'i2c-ht16k33-8x8led',
      'i2c-ht16k33-8x8led-1',
      'i2c-ht16k33-16x8led',
    ]);
  });

  it('fans out neopixel-i2c alias matches', () => {
    const result = resolveDashboardDeviceId(
      'neopixel-i2c',
      dashboardDeviceIds,
      {}
    );
    expect(result.status).toBe('fan-out');
    expect(result.dashboardDeviceIds).toEqual([
      'i2c-neopixel-led',
      'i2c-neopixel-led-8x8',
      'i2c-neopixel-led-12x12',
    ]);
  });
});

describe('findDashboardDeviceIdMatches', () => {
  const dashboardDeviceIds = [
    'i2c-ads1015',
    'i2c-ads1115',
    'i2c-ht16k33-8x8led',
  ];

  it('prefers suffix matches over infix matches', () => {
    expect(findDashboardDeviceIdMatches('ads1015', dashboardDeviceIds)).toEqual([
      'i2c-ads1015',
    ]);
  });
});

describe('matchProductAlias', () => {
  it('matches neopixel led product family', () => {
    expect(
      matchProductAlias('neopixel-i2c', [
        'i2c-neopixel-led',
        'i2c-neopixel-led-8x8',
        'i2c-bme280',
      ])
    ).toEqual(['i2c-neopixel-led', 'i2c-neopixel-led-8x8']);
  });
});
