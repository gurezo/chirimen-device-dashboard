import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import {
  DEVICE_REPOSITORY,
  type DeviceRepository,
} from '@chirimen-device-dashboard/libs-data-access';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { DeviceDetailComponent } from './device-detail.component';

const mockRepository: DeviceRepository = {
  list: () => of([]),
  get: () => of(null),
};

describe('DeviceDetailComponent', () => {
  let component: DeviceDetailComponent;
  let fixture: ComponentFixture<DeviceDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceDetailComponent],
      providers: [
        provideRouter([]),
        { provide: DEVICE_REPOSITORY, useValue: mockRepository },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeviceDetailComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('deviceId', 'test-device-1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
