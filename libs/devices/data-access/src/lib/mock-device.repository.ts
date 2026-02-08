import { Observable, of, throwError } from 'rxjs';
import type { DeviceInfo } from '@chirimen-device-dashboard/shared-types';
import type { DeviceRepository } from './device.repository';

export class MockDeviceRepository implements DeviceRepository {
  private readonly store = new Map<string, DeviceInfo>();

  list(): Observable<DeviceInfo[]> {
    return of(Array.from(this.store.values()));
  }

  get(id: string): Observable<DeviceInfo | null> {
    const device = this.store.get(id) ?? null;
    return of(device);
  }

  create(device: DeviceInfo): Observable<DeviceInfo> {
    if (this.store.has(device.id)) {
      return throwError(
        () => new Error(`Device with id "${device.id}" already exists`)
      );
    }
    this.store.set(device.id, { ...device });
    return of(this.store.get(device.id)!);
  }

  update(id: string, patch: Partial<DeviceInfo>): Observable<DeviceInfo> {
    const existing = this.store.get(id);
    if (!existing) {
      return throwError(() => new Error(`Device with id "${id}" not found`));
    }
    const updated: DeviceInfo = { ...existing, ...patch };
    this.store.set(id, updated);
    return of(updated);
  }

  delete(id: string): Observable<void> {
    if (!this.store.has(id)) {
      return throwError(() => new Error(`Device with id "${id}" not found`));
    }
    this.store.delete(id);
    return of(undefined);
  }
}
