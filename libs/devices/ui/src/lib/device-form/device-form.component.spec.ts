import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { DeviceFormComponent } from './device-form.component';
import { createDeviceFormGroup } from '../device-form-helpers';

describe('DeviceFormComponent', () => {
  let component: DeviceFormComponent;
  let fixture: ComponentFixture<DeviceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceFormComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(DeviceFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('formGroup', createDeviceFormGroup());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
