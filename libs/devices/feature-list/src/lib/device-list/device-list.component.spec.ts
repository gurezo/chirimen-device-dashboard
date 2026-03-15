import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { DeviceListStore } from '@chirimen-device-dashboard/libs-state';
import { DeviceListComponent } from './device-list.component';

const mockStore = {
  filteredDevices$: of([]),
  loading$: of(false),
  error$: of(undefined),
};

describe('DeviceListComponent', () => {
  let component: DeviceListComponent;
  let fixture: ComponentFixture<DeviceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceListComponent],
      providers: [{ provide: DeviceListStore, useValue: mockStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(DeviceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
