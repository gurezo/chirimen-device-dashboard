import { firstValueFrom } from 'rxjs';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { JsonDeviceRepository } from './json-device.repository';
import { DEFAULT_CERTIFIED_DEVICES_JSON_URL } from './certified-devices.config';
import {
  SUPPORTED_CERTIFIED_DEVICES_VERSION,
  type CertifiedDevice,
  type CertifiedDevicesJson,
} from './certified-devices.types';

const deviceOne: CertifiedDevice = {
  id: 'device-1',
  directory: 'devices/device-1',
  meta: {
    id: 'device-1',
    model: 'Test Device 1',
    tag: 'I2C',
    category: 'sensor',
    description: 'A test device',
    image: 'https://example.com/image.png',
    productUrl: 'https://example.com',
    examples: [],
    circuit: null,
    datasheet: null,
    reference: null,
  },
};

const deviceTwo: CertifiedDevice = {
  id: 'device-2',
  directory: 'devices/device-2',
  meta: {
    id: 'device-2',
    model: 'Test Device 2',
    tag: 'GPIO',
    category: 'actuator',
    description: 'Another test device',
    image: 'https://example.com/image2.png',
    productUrl: 'https://example.com/2',
    examples: [],
    circuit: null,
    datasheet: null,
    reference: null,
  },
};

const sampleJson: CertifiedDevicesJson = {
  version: SUPPORTED_CERTIFIED_DEVICES_VERSION,
  generatedAt: '2026-09-11T17:00:22.792Z',
  platforms: { platforms: {} },
  aliases: {
    directoryRules: {
      single: ' /',
      composite: ' _ /',
      remoteSingle: 'remote_ /',
      remoteComposite: 'remote_ _ /',
    },
    compositeDevices: {},
    remoteDevices: {},
    exampleNameAliases: {},
  },
  devices: [deviceOne, deviceTwo],
};

function okResponse(body: unknown) {
  return {
    ok: true,
    status: 200,
    json: () => Promise.resolve(body),
  };
}

describe('JsonDeviceRepository', () => {
  let repo: JsonDeviceRepository;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue(okResponse(sampleJson));
    vi.stubGlobal('fetch', fetchMock);

    repo = new JsonDeviceRepository();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('list() fetches certified devices json and adapts devices', async () => {
    const list = await firstValueFrom(repo.list());

    expect(fetchMock).toHaveBeenCalledWith(
      DEFAULT_CERTIFIED_DEVICES_JSON_URL,
      expect.objectContaining({
        cache: 'default',
        signal: expect.any(AbortSignal),
      }),
    );
    expect(list).toHaveLength(2);
    expect(list[0]).toMatchObject({
      id: 'device-1',
      deviceName: 'Test Device 1',
      tag: 'I2C',
      category: 'sensor',
      description: 'A test device',
      image: 'https://example.com/image.png',
      product: { url: 'https://example.com', example: [] },
    });
    expect(list[1]?.id).toBe('device-2');
  });

  it('get(id) returns device when found', async () => {
    const device = await firstValueFrom(repo.get('device-1'));

    expect(fetchMock).toHaveBeenCalledWith(
      DEFAULT_CERTIFIED_DEVICES_JSON_URL,
      expect.objectContaining({ cache: 'default' }),
    );
    expect(device?.id).toBe('device-1');
    expect(device?.deviceName).toBe('Test Device 1');
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
    expect(list).toHaveLength(2);
    expect(device?.id).toBe('device-1');
  });

  it('returns an empty array when devices is empty', async () => {
    fetchMock.mockResolvedValueOnce(
      okResponse({
        ...sampleJson,
        devices: [],
      }),
    );

    const repo2 = new JsonDeviceRepository();
    const list = await firstValueFrom(repo2.list());

    expect(list).toEqual([]);
  });

  it('errors when fetch fails', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Network error'));

    const repo2 = new JsonDeviceRepository();

    await expect(firstValueFrom(repo2.list())).rejects.toThrow('Network error');
  });

  it('errors when the request times out', async () => {
    const timeoutError = new Error('The operation was aborted');
    timeoutError.name = 'TimeoutError';
    fetchMock.mockRejectedValueOnce(timeoutError);

    const repo2 = new JsonDeviceRepository();

    await expect(firstValueFrom(repo2.list())).rejects.toThrow(
      'Failed to load devices: timeout',
    );
  });

  it('errors on HTTP failure', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () => Promise.resolve({}),
    });

    const repo2 = new JsonDeviceRepository();

    await expect(firstValueFrom(repo2.list())).rejects.toThrow(
      'Failed to load devices: HTTP 404',
    );
  });

  it('errors on malformed JSON payloads', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.reject(new SyntaxError('Unexpected token')),
    });

    const invalidJsonRepo = new JsonDeviceRepository();
    await expect(firstValueFrom(invalidJsonRepo.list())).rejects.toThrow(
      'Failed to load devices: malformed JSON',
    );

    fetchMock.mockResolvedValueOnce(okResponse(null));
    const nullRepo = new JsonDeviceRepository();
    await expect(firstValueFrom(nullRepo.list())).rejects.toThrow(
      'Failed to load devices: malformed JSON',
    );

    fetchMock.mockResolvedValueOnce(okResponse({ version: 1 }));
    const missingDevicesRepo = new JsonDeviceRepository();
    await expect(firstValueFrom(missingDevicesRepo.list())).rejects.toThrow(
      'Failed to load devices: malformed JSON',
    );

    fetchMock.mockResolvedValueOnce(
      okResponse({ version: 1, devices: 'nope' }),
    );
    const invalidDevicesRepo = new JsonDeviceRepository();
    await expect(firstValueFrom(invalidDevicesRepo.list())).rejects.toThrow(
      'Failed to load devices: malformed JSON',
    );
  });

  it('errors on unsupported certified devices version', async () => {
    fetchMock.mockResolvedValueOnce(
      okResponse({
        ...sampleJson,
        version: 99,
      }),
    );

    const repo2 = new JsonDeviceRepository();

    await expect(firstValueFrom(repo2.list())).rejects.toThrow(
      'Failed to load devices: unsupported version',
    );
  });
});
