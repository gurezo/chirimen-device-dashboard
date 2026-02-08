import { ComponentStore } from '@ngrx/component-store';
import { inject } from '@angular/core';
import { Observable, switchMap, tap, catchError, of } from 'rxjs';
import type { DeviceInfo } from '@chirimen-device-dashboard/shared-types';
import { DEVICE_REPOSITORY } from '@chirimen-device-dashboard/libs-data-access';

export interface DeviceListState {
  devices: DeviceInfo[];
  loading: boolean;
  error: string | undefined;
  query: string;
  filterTag: DeviceInfo['tag'] | undefined;
  filterCategory: string | undefined;
}

const initialState: DeviceListState = {
  devices: [],
  loading: false,
  error: undefined,
  query: '',
  filterTag: undefined,
  filterCategory: undefined,
};

function matchesQuery(device: DeviceInfo, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  return (
    device.id.toLowerCase().includes(q) ||
    device.deviceName.toLowerCase().includes(q) ||
    device.tag.toLowerCase().includes(q) ||
    device.category.toLowerCase().includes(q) ||
    device.description.toLowerCase().includes(q)
  );
}

export class DeviceListStore extends ComponentStore<DeviceListState> {
  private readonly repository = inject(DEVICE_REPOSITORY);

  readonly devices$ = this.select((s) => s.devices);
  readonly loading$ = this.select((s) => s.loading);
  readonly error$ = this.select((s) => s.error);
  readonly query$ = this.select((s) => s.query);
  readonly filterTag$ = this.select((s) => s.filterTag);
  readonly filterCategory$ = this.select((s) => s.filterCategory);

  readonly filteredDevices$ = this.select(
    this.devices$,
    this.query$,
    this.filterTag$,
    this.filterCategory$,
    (devices, query, filterTag, filterCategory) => {
      return devices.filter((device) => {
        if (!matchesQuery(device, query)) return false;
        if (filterTag != null && device.tag !== filterTag) return false;
        if (
          filterCategory != null &&
          filterCategory !== '' &&
          device.category !== filterCategory
        )
          return false;
        return true;
      });
    }
  );

  readonly setQuery = this.updater((state, query: string) => ({
    ...state,
    query,
  }));

  readonly setFilterTag = this.updater((state, filterTag: DeviceInfo['tag'] | undefined) => ({
    ...state,
    filterTag,
  }));

  readonly setFilterCategory = this.updater((state, filterCategory: string | undefined) => ({
    ...state,
    filterCategory,
  }));

  readonly loadDevices = this.effect((trigger$) =>
    trigger$.pipe(
      switchMap(() => {
        this.patchState({ loading: true, error: undefined });
        return this.repository.list().pipe(
          tap((devices) =>
            this.patchState({ devices, loading: false, error: undefined })
          ),
          catchError((error: Error) => {
            this.patchState({
              loading: false,
              error: error?.message ?? 'Failed to load devices',
            });
            return of([]);
          })
        );
      })
    )
  );

  /** Call with device id to delete. Triggers reload on success. */
  readonly deleteDevice = this.effect((id$: Observable<string>) =>
    id$.pipe(
      switchMap((id) =>
        this.repository.delete(id).pipe(
          tap(() => this.loadDevices()),
          catchError((error: Error) => {
            this.patchState({
              error: error?.message ?? 'Failed to delete device',
            });
            return of(undefined);
          })
        )
      )
    )
  );

  constructor() {
    super(initialState);
  }
}
