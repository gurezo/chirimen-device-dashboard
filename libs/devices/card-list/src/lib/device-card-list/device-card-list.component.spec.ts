import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import {
  DEVICE_REPOSITORY,
  type DeviceRepository,
} from '@chirimen-device-dashboard/libs-data-access';
import {
  DeviceListStore,
  provideDeviceListStore,
} from '@chirimen-device-dashboard/libs-state';
import type { DeviceInfo } from '@chirimen-device-dashboard/shared-types';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { DeviceCardListComponent } from './device-card-list.component';

const mockDevice: DeviceInfo = {
  id: 'test-id',
  deviceName: 'Test Device',
  tag: 'I2C',
  category: 'Sensor',
  description: 'Test description',
  image: '',
  product: { url: '', example: [] },
};

const mockRepository: DeviceRepository = {
  list: () => of([]),
  get: () => of(null),
};

describe('DeviceCardListComponent', () => {
  let component: DeviceCardListComponent;
  let fixture: ComponentFixture<DeviceCardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceCardListComponent],
      providers: [
        provideNoopAnimations(),
        provideRouter([]),
        { provide: DEVICE_REPOSITORY, useValue: mockRepository },
        provideDeviceListStore(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeviceCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('falls back to the placeholder when the device image is empty', async () => {
    const store = TestBed.inject(DeviceListStore);
    store.patchState({
      devices: [mockDevice],
      loading: false,
      loaded: true,
    });
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(img.src.endsWith('/no_image.png')).toBe(true);
  });

  it('falls back to the placeholder when the device image fails to load', async () => {
    const store = TestBed.inject(DeviceListStore);
    store.patchState({
      devices: [{ ...mockDevice, image: 'https://example.com/missing.png' }],
      loading: false,
      loaded: true,
    });
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    img.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    expect(img.src.endsWith('/no_image.png')).toBe(true);
  });
});
