import { describe, it, expect } from 'vitest';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import type { DeviceInfo } from '@chirimen-device-dashboard/shared-types';
import { MockDeviceRepository } from './mock-device.repository';

function createDevice(overrides: Partial<DeviceInfo> = {}): DeviceInfo {
  return {
    id: 'device-1',
    deviceName: 'Test Device',
    tag: 'GPIO',
    category: 'sensor',
    description: 'A test device',
    image: 'https://example.com/image.png',
    product: { url: 'https://example.com', example: [] },
    ...overrides,
  };
}

describe('MockDeviceRepository', () => {
  it('list() returns empty array when no devices', async () => {
    const repo = new MockDeviceRepository();
    const list = await firstValueFrom(repo.list());
    expect(list).toEqual([]);
  });

  it('create() and list() return created device', async () => {
    const repo = new MockDeviceRepository();
    const device = createDevice();
    const created = await firstValueFrom(repo.create(device));
    expect(created).toEqual(device);

    const list = await firstValueFrom(repo.list());
    expect(list).toHaveLength(1);
    expect(list[0]).toEqual(device);
  });

  it('get() returns null for missing id', async () => {
    const repo = new MockDeviceRepository();
    const result = await firstValueFrom(repo.get('missing'));
    expect(result).toBeNull();
  });

  it('get() returns device after create', async () => {
    const repo = new MockDeviceRepository();
    const device = createDevice({ id: 'dev-1' });
    await firstValueFrom(repo.create(device));
    const got = await firstValueFrom(repo.get('dev-1'));
    expect(got).toEqual(device);
  });

  it('create() throws when id already exists', async () => {
    const repo = new MockDeviceRepository();
    const device = createDevice({ id: 'dup' });
    await firstValueFrom(repo.create(device));
    await expect(
      lastValueFrom(repo.create(device))
    ).rejects.toThrow(/already exists/);
  });

  it('update() returns updated device', async () => {
    const repo = new MockDeviceRepository();
    const device = createDevice({ id: 'upd', deviceName: 'Original' });
    await firstValueFrom(repo.create(device));
    const updated = await firstValueFrom(
      repo.update('upd', { deviceName: 'Updated Name' })
    );
    expect(updated.deviceName).toBe('Updated Name');
    expect(updated.id).toBe('upd');
  });

  it('update() throws when device not found', async () => {
    const repo = new MockDeviceRepository();
    await expect(
      lastValueFrom(repo.update('missing', { deviceName: 'X' }))
    ).rejects.toThrow(/not found/);
  });

  it('delete() removes device', async () => {
    const repo = new MockDeviceRepository();
    const device = createDevice({ id: 'del' });
    await firstValueFrom(repo.create(device));
    await firstValueFrom(repo.delete('del'));
    const list = await firstValueFrom(repo.list());
    expect(list).toHaveLength(0);
    const got = await firstValueFrom(repo.get('del'));
    expect(got).toBeNull();
  });

  it('delete() throws when device not found', async () => {
    const repo = new MockDeviceRepository();
    await expect(lastValueFrom(repo.delete('missing'))).rejects.toThrow(
      /not found/
    );
  });
});
