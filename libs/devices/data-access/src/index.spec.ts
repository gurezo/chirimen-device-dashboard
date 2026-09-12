import { describe, it, expect } from 'vitest';
import {
  CERTIFIED_DEVICES_FETCH_TIMEOUT_MS,
  CERTIFIED_DEVICES_JSON_URL,
  DEFAULT_CERTIFIED_DEVICES_JSON_URL,
  DEVICE_REPOSITORY,
  JsonDeviceRepository,
  provideDeviceRepository,
} from './index';

describe('libs-data-access', () => {
  it('should export DEVICE_REPOSITORY', () => {
    expect(DEVICE_REPOSITORY).toBeDefined();
  });

  it('should export JsonDeviceRepository', () => {
    expect(JsonDeviceRepository).toBeDefined();
  });

  it('should export certified devices json url config', () => {
    expect(CERTIFIED_DEVICES_JSON_URL).toBeDefined();
    expect(DEFAULT_CERTIFIED_DEVICES_JSON_URL).toBe(
      'https://raw.githubusercontent.com/gurezo/chirimen-certified-devices/main/generated/devices.json',
    );
    expect(CERTIFIED_DEVICES_FETCH_TIMEOUT_MS).toBe(10_000);
  });

  it('provideDeviceRepository() should return provider for DEVICE_REPOSITORY', () => {
    const provider = provideDeviceRepository() as {
      provide: typeof DEVICE_REPOSITORY;
      useClass: typeof JsonDeviceRepository;
    };
    expect(provider.provide).toBe(DEVICE_REPOSITORY);
    expect(provider.useClass).toBe(JsonDeviceRepository);
  });
});
