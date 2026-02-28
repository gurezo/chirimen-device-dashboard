import { Observable, of, shareReplay, map, catchError, from } from 'rxjs';
import type { DeviceInfo } from '@chirimen-device-dashboard/shared-types';
import type { DeviceRepository } from './device.repository';

const DEVICES_JSON_PATH = '/devices.json';

function loadDevices(): Promise<DeviceInfo[]> {
  return fetch(DEVICES_JSON_PATH).then((res) =>
    res.ok ? (res.json() as Promise<DeviceInfo[]>) : Promise.resolve([]),
  );
}

export class JsonDeviceRepository implements DeviceRepository {
  private readonly devices$ = from(loadDevices()).pipe(
    shareReplay({ bufferSize: 1, refCount: true }),
    catchError(() => of([] as DeviceInfo[])),
  );

  list(): Observable<DeviceInfo[]> {
    return this.devices$;
  }

  get(id: string): Observable<DeviceInfo | null> {
    return this.devices$.pipe(
      map((devices) => devices.find((d) => d.id === id) ?? null),
    );
  }
}
