import { ComponentStore } from '@ngrx/component-store';
import { inject } from '@angular/core';
import { switchMap, tap, catchError, of, EMPTY, take } from 'rxjs';
import type { DeviceInfo } from '@chirimen-device-dashboard/shared-types';
import { DEVICE_REPOSITORY } from '@chirimen-device-dashboard/libs-data-access';

export type ViewMode = 'table' | 'card';

export interface DeviceListState {
  devices: DeviceInfo[];
  loading: boolean;
  loaded: boolean;
  error: string | undefined;
  query: string;
  viewMode: ViewMode;
  filterTag: DeviceInfo['tag'] | undefined;
  filterCategory: string | undefined;
}

const initialState: DeviceListState = {
  devices: [],
  loading: false,
  loaded: false,
  error: undefined,
  query: '',
  viewMode: 'table',
  filterTag: undefined,
  filterCategory: undefined,
};

const PLATFORM_SEARCH_ALIASES: Record<string, readonly string[]> = {
  'pizero-esm': [
    'raspberry',
    'raspberry pi',
    'raspberry pi 3',
    'raspberry pi 4',
    'raspberry pi 5',
    'raspberry pi zero',
    'raspberry pi zero 2',
    'pi zero',
    'zero 2',
    'pizero',
  ],
  'microbit-driver': ['microbit', 'micro:bit', 'micro bit'],
  'legacy-gc-i2c': [
    'raspberry',
    'raspberry pi',
    'raspberry pi 3',
    'raspberry pi 4',
    'raspberry pi 5',
  ],
};

function isSearchableValue(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function getHardwareAliases(hardware: string): string[] {
  const value = hardware.toLowerCase();
  const aliases: string[] = [];

  if (value.includes('micro:bit') || value.includes('microbit'))
    aliases.push('microbit', 'micro:bit', 'micro bit');

  if (value.includes('pi zero') || value.includes('pizero'))
    aliases.push('raspberry', 'raspberry pi', 'raspberry pi zero', 'pi zero');

  return aliases;
}

function buildSearchIndex(device: DeviceInfo): string {
  const deviceTerms = [
    device.id,
    device.deviceName,
    device.tag,
    device.category,
    device.description,
  ];

  const exampleTerms = device.product.example.flatMap((example) => [
    example.hardware,
    example.platform,
    example.deviceId,
    example.upstreamPath,
    ...(isSearchableValue(example.platform)
      ? (PLATFORM_SEARCH_ALIASES[example.platform] ?? [])
      : []),
    ...(isSearchableValue(example.hardware)
      ? getHardwareAliases(example.hardware)
      : []),
  ]);

  return [...deviceTerms, ...exampleTerms]
    .filter(isSearchableValue)
    .join(' ')
    .toLowerCase();
}

function matchesQuery(device: DeviceInfo, query: string): boolean {
  if (!query.trim()) return true;
  const keywords = query.trim().toLowerCase().split(/\s+/);
  const searchIndex = buildSearchIndex(device);
  return keywords.every((keyword) => searchIndex.includes(keyword));
}

export class DeviceListStore extends ComponentStore<DeviceListState> {
  private readonly repository = inject(DEVICE_REPOSITORY);

  readonly devices$ = this.select((s) => s.devices);
  readonly loading$ = this.select((s) => s.loading);
  readonly error$ = this.select((s) => s.error);
  readonly query$ = this.select((s) => s.query);
  readonly viewMode$ = this.select((s) => s.viewMode);
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
    },
  );

  readonly setQuery = this.updater((state, query: string) => ({
    ...state,
    query,
  }));

  readonly setViewMode = this.updater((state, viewMode: ViewMode) => ({
    ...state,
    viewMode,
  }));

  readonly setFilterTag = this.updater(
    (state, filterTag: DeviceInfo['tag'] | undefined) => ({
      ...state,
      filterTag,
    }),
  );

  readonly setFilterCategory = this.updater(
    (state, filterCategory: string | undefined) => ({
      ...state,
      filterCategory,
    }),
  );

  readonly loadDevices = this.effect((trigger$) =>
    trigger$.pipe(
      switchMap(() => {
        this.patchState({ loading: true, error: undefined });
        return this.repository.list().pipe(
          tap((devices) =>
            this.patchState({
              devices,
              loading: false,
              loaded: true,
              error: undefined,
            }),
          ),
          catchError((error: Error) => {
            this.patchState({
              loading: false,
              error: error?.message ?? 'Failed to load devices',
            });
            return of([]);
          }),
        );
      }),
    ),
  );

  readonly loadDevicesIfNeeded = this.effect((trigger$) =>
    trigger$.pipe(
      switchMap(() =>
        this.select((s) => s.loaded).pipe(
          take(1),
          switchMap((loaded) => {
            if (loaded) return EMPTY;
            this.patchState({ loading: true, error: undefined });
            return this.repository.list().pipe(
              tap((devices) =>
                this.patchState({
                  devices,
                  loading: false,
                  loaded: true,
                  error: undefined,
                }),
              ),
              catchError((error: Error) => {
                this.patchState({
                  loading: false,
                  error: error?.message ?? 'Failed to load devices',
                });
                return of([]);
              }),
            );
          }),
        ),
      ),
    ),
  );

  constructor() {
    super(initialState);
  }
}
