import { TestBed } from '@angular/core/testing';
import {
  convertToParamMap,
  provideRouter,
  RedirectCommand,
  type ActivatedRouteSnapshot,
  type RouterStateSnapshot,
} from '@angular/router';
import {
  DEVICE_REPOSITORY,
  type DeviceRepository,
} from '@chirimen-device-dashboard/libs-data-access';
import type { DeviceInfo } from '@chirimen-device-dashboard/shared-types';
import { firstValueFrom, of, throwError, type Observable } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { redirectLegacyDeviceIdGuard } from './redirect-legacy-device-id.guard';

const ads1015: DeviceInfo = {
  id: 'ADS1015',
  deviceName: 'ADS1015',
  tag: 'I2C',
  category: 'ADC',
  description: '',
  image: '',
  product: { url: '', example: [] },
};

function createRepository(
  getImpl: DeviceRepository['get'],
): DeviceRepository {
  return {
    list: () => of([]),
    get: getImpl,
  };
}

function runGuard(id: string) {
  const route = {
    paramMap: convertToParamMap({ id }),
  } as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;

  return TestBed.runInInjectionContext(() =>
    redirectLegacyDeviceIdGuard(route, state),
  ) as Observable<boolean | RedirectCommand>;
}

describe('redirectLegacyDeviceIdGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: DEVICE_REPOSITORY,
          useValue: createRepository((id) =>
            of(id === 'missing' ? null : ads1015),
          ),
        },
      ],
    });
  });

  it('allows navigation when the requested id is already canonical', async () => {
    const result = await firstValueFrom(runGuard('ADS1015'));
    expect(result).toBe(true);
  });

  it('redirects a legacy id to the canonical url', async () => {
    const result = await firstValueFrom(runGuard('i2c-ads1015'));

    expect(result).toBeInstanceOf(RedirectCommand);
    const redirect = result as RedirectCommand;
    expect(redirect.redirectTo.toString()).toBe('/devices/ADS1015');
  });

  it('redirects a case-insensitive id to the canonical url', async () => {
    const result = await firstValueFrom(runGuard('ads1015'));

    expect(result).toBeInstanceOf(RedirectCommand);
    expect((result as RedirectCommand).redirectTo.toString()).toBe(
      '/devices/ADS1015',
    );
  });

  it('allows unknown ids so the detail page can show not found', async () => {
    const result = await firstValueFrom(runGuard('missing'));
    expect(result).toBe(true);
  });

  it('allows navigation when device loading fails', async () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: DEVICE_REPOSITORY,
          useValue: createRepository(() =>
            throwError(() => new Error('Failed to load devices: timeout')),
          ),
        },
      ],
    });

    const result = await firstValueFrom(runGuard('ADS1015'));
    expect(result).toBe(true);
  });
});
