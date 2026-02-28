import type { Observable } from 'rxjs';
import type { DeviceInfo } from '@chirimen-device-dashboard/shared-types';
import { InjectionToken } from '@angular/core';

export interface DeviceRepository {
  list(): Observable<DeviceInfo[]>;
  get(id: string): Observable<DeviceInfo | null>;
}

export const DEVICE_REPOSITORY = new InjectionToken<DeviceRepository>(
  'DeviceRepository',
);
