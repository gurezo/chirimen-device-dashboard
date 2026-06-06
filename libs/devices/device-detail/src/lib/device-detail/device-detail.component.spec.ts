import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import {
  DEVICE_REPOSITORY,
  type DeviceRepository,
} from '@chirimen-device-dashboard/libs-data-access';
import type { DeviceInfo } from '@chirimen-device-dashboard/shared-types';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  adt7410PlatformExamples,
  legacyOnlyExamples,
} from '../../../../platform-specific-examples/src/lib/testing/platform-examples.fixture';
import { DeviceDetailComponent } from './device-detail.component';

const adt7410Device: DeviceInfo = {
  id: 'i2c-adt7410',
  deviceName: 'ADT7410',
  tag: 'I2C',
  category: '温度センサ',
  description: '温度センサ',
  image: 'https://example.com/adt7410.jpg',
  product: {
    url: 'https://example.com/product',
    example: adt7410PlatformExamples,
  },
};

const legacyOnlyDevice: DeviceInfo = {
  id: 'i2c-ads1015',
  deviceName: 'ADS1015',
  tag: 'I2C',
  category: 'ADC',
  description: 'ADC',
  image: 'https://example.com/ads1015.jpg',
  product: {
    url: 'https://example.com/product',
    example: legacyOnlyExamples,
  },
};

function createMockRepository(
  device: DeviceInfo | null,
): DeviceRepository {
  return {
    list: () => of([]),
    get: (id: string) =>
      of(device && device.id === id ? device : null),
  };
}

describe('DeviceDetailComponent', () => {
  let component: DeviceDetailComponent;
  let fixture: ComponentFixture<DeviceDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceDetailComponent],
      providers: [
        provideRouter([]),
        {
          provide: DEVICE_REPOSITORY,
          useValue: createMockRepository(adt7410Device),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeviceDetailComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('deviceId', 'i2c-adt7410');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display Platform 別 Example section with platform names', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const headings = Array.from(compiled.querySelectorAll('h3')).map((h3) =>
      h3.textContent?.trim(),
    );

    expect(headings).toContain('Platform 別 Example');
    expect(compiled.textContent).toContain('pizero-esm');
    expect(compiled.textContent).toContain('node');
    expect(compiled.textContent).toContain('raspi-node');
    expect(compiled.textContent).toContain('microbit-driver');
    expect(compiled.textContent).toContain('legacy-gc-i2c');
    expect(compiled.querySelector('table')).toBeTruthy();
    expect(
      compiled.querySelector(
        'a[href="https://github.com/chirimen-oh/chirimen.org"]',
      ),
    ).toBeTruthy();
  });

  it('should show empty state when device has only legacy examples', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [DeviceDetailComponent],
      providers: [
        provideRouter([]),
        {
          provide: DEVICE_REPOSITORY,
          useValue: createMockRepository(legacyOnlyDevice),
        },
      ],
    }).compileComponents();

    const legacyFixture = TestBed.createComponent(DeviceDetailComponent);
    legacyFixture.componentRef.setInput('deviceId', 'i2c-ads1015');
    legacyFixture.detectChanges();
    await legacyFixture.whenStable();
    legacyFixture.detectChanges();

    const compiled = legacyFixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Platform 別 Example');
    expect(compiled.textContent).toContain('Platform 別 Example はありません');
    expect(compiled.textContent).not.toContain('I2C-ADS1015');
    expect(compiled.querySelector('table')).toBeFalsy();
  });
});
