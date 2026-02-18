import { AsyncPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { DeleteConfirmDialogComponent } from "@chirimen-device-dashboard/libs-feature-delete-confirm-dialog";
import { DeviceListStore } from "@chirimen-device-dashboard/libs-state";
import type { DeviceInfo } from "@chirimen-device-dashboard/shared-types";
import { TruncatePipe } from "../truncate.pipe";

@Component({
  selector: "chirimen-device-card-list",
  standalone: true,
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TruncatePipe,
  ],
  templateUrl: "./device-card-list.component.html",
  styleUrl: "./device-card-list.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceCardListComponent {
  private readonly store = inject(DeviceListStore);
  private readonly dialog = inject(MatDialog);

  readonly filteredDevices$ = this.store.filteredDevices$;
  readonly loading$ = this.store.loading$;
  readonly error$ = this.store.error$;

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
