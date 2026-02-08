import { describe, it, expect } from 'vitest';
import {
  DEVICE_REPOSITORY,
  MockDeviceRepository,
  provideDeviceRepository,
} from './index';

describe('libs-data-access', () => {
  it('should export DEVICE_REPOSITORY', () => {
    expect(DEVICE_REPOSITORY).toBeDefined();
  });

  it('should export MockDeviceRepository', () => {
    expect(MockDeviceRepository).toBeDefined();
  });

  it('provideDeviceRepository() should return provider for DEVICE_REPOSITORY', () => {
    const provider = provideDeviceRepository();
    expect(provider.provide).toBe(DEVICE_REPOSITORY);
    expect(provider.useClass).toBe(MockDeviceRepository);
  });
});
