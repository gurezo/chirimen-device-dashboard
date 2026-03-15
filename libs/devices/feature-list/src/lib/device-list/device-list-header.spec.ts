import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceListHeaderComponent } from './device-list-header';

describe('DeviceListHeaderComponent', () => {
  let component: DeviceListHeaderComponent;
  let fixture: ComponentFixture<DeviceListHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceListHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeviceListHeaderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
