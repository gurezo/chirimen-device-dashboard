import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { DeviceCardListComponent } from "@chirimen-device-dashboard/libs-card-list";
import { DeviceListComponent } from "@chirimen-device-dashboard/libs-feature-list";

type ViewMode = "table" | "card";

@Component({
  selector: "app-device-list-page",
  standalone: true,
  imports: [
    MatButtonToggleModule,
    DeviceListComponent,
    DeviceCardListComponent,
  ],
  templateUrl: "./device-list-page.component.html",
  styleUrl: "./device-list-page.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceListPageComponent {
  readonly viewMode = signal<ViewMode>("table");

  setViewMode(mode: ViewMode | null): void {
    if (mode) this.viewMode.set(mode);
  }
}
