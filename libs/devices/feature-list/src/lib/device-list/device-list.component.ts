import { AsyncPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTableModule } from "@angular/material/table";
import { RouterModule } from "@angular/router";
import { DeviceListStore } from "@chirimen-device-dashboard/libs-state";

@Component({
  selector: "chirimen-device-list",
  standalone: true,
  imports: [
    AsyncPipe,
    MatProgressSpinnerModule,
    MatTableModule,
    RouterModule,
  ],
  templateUrl: "./device-list.component.html",
  styleUrl: "./device-list.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceListComponent {
  private readonly store = inject(DeviceListStore);

  readonly displayedColumns: string[] = [
    "image",
    "deviceName",
    "tag",
    "category",
    "description",
  ];

  readonly filteredDevices$ = this.store.filteredDevices$;
  readonly loading$ = this.store.loading$;
  readonly error$ = this.store.error$;
}
