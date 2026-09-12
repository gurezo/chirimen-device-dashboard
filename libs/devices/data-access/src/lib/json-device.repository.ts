import { Observable, shareReplay, map, from } from 'rxjs';
import type { DeviceInfo } from '@chirimen-device-dashboard/shared-types';
import { adaptCertifiedDevicesJson } from './certified-device.adapter';
import {
  CERTIFIED_DEVICES_FETCH_TIMEOUT_MS,
  DEFAULT_CERTIFIED_DEVICES_JSON_URL,
} from './certified-devices.config';
import { isSupportedCertifiedDevicesVersion } from './certified-devices.types';
import type { DeviceRepository } from './device.repository';
import {
  buildDeviceIdIndex,
  parseCertifiedAliases,
  resolveDeviceId,
  type DeviceIdIndex,
} from './resolve-device-id';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function loadError(reason: string): Error {
  return new Error(`Failed to load devices: ${reason}`);
}

function isTimeoutError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    error.name === 'TimeoutError'
  );
}

interface DeviceCatalog {
  devices: DeviceInfo[];
  index: DeviceIdIndex;
}

async function loadCatalog(
  url: string,
  timeoutMs: number,
): Promise<DeviceCatalog> {
  let response: Response;
  try {
    response = await fetch(url, {
      cache: 'default',
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    if (isTimeoutError(error)) {
      throw loadError('timeout');
    }
    throw error instanceof Error ? error : loadError('network error');
  }

  if (!response.ok) {
    throw loadError(`HTTP ${response.status}`);
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw loadError('malformed JSON');
  }

  if (!isRecord(payload) || !Array.isArray(payload['devices'])) {
    throw loadError('malformed JSON');
  }

  if (!isSupportedCertifiedDevicesVersion(payload['version'])) {
    throw loadError('unsupported version');
  }

  const devices = adaptCertifiedDevicesJson(payload);
  const aliases = parseCertifiedAliases(payload['aliases']);
  return {
    devices,
    index: buildDeviceIdIndex(devices, aliases),
  };
}

export class JsonDeviceRepository implements DeviceRepository {
  private readonly catalog$: Observable<DeviceCatalog>;

  constructor(
    url = DEFAULT_CERTIFIED_DEVICES_JSON_URL,
    timeoutMs = CERTIFIED_DEVICES_FETCH_TIMEOUT_MS,
  ) {
    this.catalog$ = from(loadCatalog(url, timeoutMs)).pipe(
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  list(): Observable<DeviceInfo[]> {
    return this.catalog$.pipe(map((catalog) => catalog.devices));
  }

  get(id: string): Observable<DeviceInfo | null> {
    return this.catalog$.pipe(
      map((catalog) => resolveDeviceId(catalog.index, id)?.device ?? null),
    );
  }
}
