import { AsyncPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { DeleteConfirmDialogComponent } from "@chirimen-device-dashboard/libs-feature-delete-confirm-dialog";
import {
  DeviceListStore,
  provideDeviceListStore,
} from "@chirimen-device-dashboard/libs-state";
import type { DeviceInfo } from "@chirimen-device-dashboard/shared-types";

@Component({
  selector: "chirimen-device-card-list",
  standalone: true,
  providers: [provideDeviceListStore()],
  imports: [
    AsyncPipe,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: "./device-card-list.component.html",
  styleUrl: "./device-card-list.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceCardListComponent implements OnInit {
  private readonly store = inject(DeviceListStore);
  private readonly dialog = inject(MatDialog);

  readonly filteredDevices$ = this.store.filteredDevices$;
  readonly loading$ = this.store.loading$;
  readonly error$ = this.store.error$;

  readonly query = signal("");

  ngOnInit(): void {
    this.store.loadDevices(undefined as never);
  }

  onQueryChange(value: string): void {
    this.query.set(value);
    this.store.setQuery(value);
  }

  confirmDelete(device: DeviceInfo): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      data: {
        deviceName: device.deviceName,
        deviceId: device.id,
        deviceImage: device.image,
      },
      width: "400px",
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.store.deleteDevice(device.id as never);
      }
    });
  }
}
