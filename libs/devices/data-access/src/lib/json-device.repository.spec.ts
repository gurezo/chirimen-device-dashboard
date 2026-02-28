import { firstValueFrom } from 'rxjs';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { DeviceInfo } from '@chirimen-device-dashboard/shared-types';
import { JsonDeviceRepository } from './json-device.repository';

const mockDevices: DeviceInfo[] = [
  {
    id: 'device-1',
    deviceName: 'Test Device 1',
    tag: 'I2C',
    category: 'sensor',
    description: 'A test device',
    image: 'https://example.com/image.png',
    product: { url: 'https://example.com', example: [] },
  },
  {
    id: 'device-2',
    deviceName: 'Test Device 2',
    tag: 'GPIO',
    category: 'actuator',
    description: 'Another test device',
    image: 'https://example.com/image2.png',
    product: { url: 'https://example.com/2', example: [] },
  },
];

describe('JsonDeviceRepository', () => {
  let repo: JsonDeviceRepository;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockDevices),
    });
    vi.stubGlobal('fetch', fetchMock);

    repo = new JsonDeviceRepository();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('list() returns devices from /devices.json', async () => {
    const list = await firstValueFrom(repo.list());

    expect(fetchMock).toHaveBeenCalledWith('/devices.json');
    expect(list).toEqual(mockDevices);
    expect(list).toHaveLength(2);
  });

  it('get(id) returns device when found', async () => {
    const device = await firstValueFrom(repo.get('device-1'));

    expect(fetchMock).toHaveBeenCalledWith('/devices.json');
    expect(device).toEqual(mockDevices[0]);
    expect(device?.id).toBe('device-1');
  });

  it('get(id) returns null when not found', async () => {
    const device = await firstValueFrom(repo.get('missing'));

    expect(device).toBeNull();
  });

  it('shares fetch between list() and get()', async () => {
    const listPromise = firstValueFrom(repo.list());
    const getPromise = firstValueFrom(repo.get('device-1'));

    const [list, device] = await Promise.all([listPromise, getPromise]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(list).toEqual(mockDevices);
    expect(device).toEqual(mockDevices[0]);
  });

  it('returns empty array when fetch fails', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Network error'));

    const repo2 = new JsonDeviceRepository();
    const list = await firstValueFrom(repo2.list());

    expect(list).toEqual([]);
  });
});
