import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideNoopAnimations } from "@angular/platform-browser/animations";
import { provideDeviceRepository } from "@chirimen-device-dashboard/libs-data-access";
import { provideDeviceListStore } from "@chirimen-device-dashboard/libs-state";
import { beforeEach, describe, expect, it } from "vitest";
import { DeviceCardListComponent } from "./device-card-list.component";

describe("DeviceCardListComponent", () => {
  let component: DeviceCardListComponent;
  let fixture: ComponentFixture<DeviceCardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceCardListComponent],
      providers: [
        provideNoopAnimations(),
        provideDeviceRepository(),
        provideDeviceListStore(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeviceCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
