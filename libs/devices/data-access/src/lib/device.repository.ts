import type { Observable } from 'rxjs';
import type { DeviceInfo } from '@chirimen-device-dashboard/shared-types';
import { InjectionToken } from '@angular/core';

export interface DeviceRepository {
  list(): Observable<DeviceInfo[]>;
  get(id: string): Observable<DeviceInfo | null>;
  create(device: DeviceInfo): Observable<DeviceInfo>;
  update(id: string, patch: Partial<DeviceInfo>): Observable<DeviceInfo>;
  delete(id: string): Observable<void>;
}

export const DEVICE_REPOSITORY = new InjectionToken<DeviceRepository>(
  'DeviceRepository'
);
