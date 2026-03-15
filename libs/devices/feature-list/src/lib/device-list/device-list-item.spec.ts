import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import type { DeviceInfo } from '@chirimen-device-dashboard/shared-types';
import { DeviceListItemComponent } from './device-list-item';

const mockDevice: DeviceInfo = {
  id: 'test-id',
  deviceName: 'Test Device',
  tag: 'I2C',
  category: 'Sensor',
  description: 'Test description',
  image: 'https://example.com/image.png',
  product: { url: '', example: [] },
};

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
});
