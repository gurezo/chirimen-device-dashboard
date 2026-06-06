import { describe, expect, it } from 'vitest';
import { resolveDashboardDeviceId } from './resolve-dashboard-device-id';

describe('resolveDashboardDeviceId', () => {
  const dashboardDeviceIds = [
    'i2c-adt7410',
    'i2c-bme280',
    'i2c-foo',
    'gpio-foo',
  ];

  it('resolves unique suffix match', () => {
    const result = resolveDashboardDeviceId(
      'adt7410',
      dashboardDeviceIds,
      {}
    );
    expect(result.status).toBe('resolved');
    expect(result.dashboardDeviceId).toBe('i2c-adt7410');
  });

  it('uses override when provided', () => {
    const result = resolveDashboardDeviceId('foo', dashboardDeviceIds, {
      foo: 'i2c-foo',
    });
    expect(result.status).toBe('override');
    expect(result.dashboardDeviceId).toBe('i2c-foo');
  });

  it('reports ambiguous matches', () => {
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
    expect(result.dashboardDeviceId).toBeNull();
  });
});
