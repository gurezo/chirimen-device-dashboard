import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideNoopAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";
import { provideDeviceRepository } from "@chirimen-device-dashboard/libs-data-access";
import { beforeEach, describe, expect, it } from "vitest";
import { DeviceDetailComponent } from "./device-detail.component";

describe("DeviceDetailComponent", () => {
  let fixture: ComponentFixture<DeviceDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceDetailComponent],
      providers: [
        provideNoopAnimations(),
        provideRouter([]),
        provideDeviceRepository(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeviceDetailComponent);
    fixture.componentRef.setInput("deviceId", "test-device-1");
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
