import { describe, it, expect } from 'vitest';
import {
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

  it('provideDeviceRepository() should return provider for DEVICE_REPOSITORY', () => {
    const provider = provideDeviceRepository() as {
      provide: typeof DEVICE_REPOSITORY;
      useClass: typeof JsonDeviceRepository;
    };
    expect(provider.provide).toBe(DEVICE_REPOSITORY);
    expect(provider.useClass).toBe(JsonDeviceRepository);
  });
});
