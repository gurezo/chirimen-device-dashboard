import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DeviceInfo } from '@chirimen-device-dashboard/shared-types';
import { beforeEach, describe, expect, it } from 'vitest';
import { DeviceListItemComponent } from './device-list-item';

const mockDevice: DeviceInfo = {
  id: 'test-id',
  deviceName: 'Test Device',
  tag: 'I2C',
  category: 'Sensor',
  description: 'Test description',
  image: 'https://example.com/image.png',
  product: { url: '', example: [] },
} as const;

describe('DeviceListItemComponent', () => {
  let component: DeviceListItemComponent;
  let fixture: ComponentFixture<DeviceListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceListItemComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DeviceListItemComponent);
    fixture.componentRef.setInput('device', mockDevice);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('falls back to the placeholder when the device image is empty', () => {
    fixture.componentRef.setInput('device', { ...mockDevice, image: '' });
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(img.src.endsWith('/no_image.png')).toBe(true);
  });

  it('falls back to the placeholder when the device image fails to load', () => {
    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    img.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    expect(img.src.endsWith('/no_image.png')).toBe(true);
  });
});
