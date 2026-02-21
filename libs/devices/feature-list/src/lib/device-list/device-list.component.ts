import { AsyncPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTableModule } from "@angular/material/table";
import { DeleteConfirmDialogComponent } from "@chirimen-device-dashboard/libs-ui";
import { DeviceListStore } from "@chirimen-device-dashboard/libs-state";
import type { DeviceInfo } from "@chirimen-device-dashboard/shared-types";

@Component({
  selector: "chirimen-device-list",
  standalone: true,
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
  ],
  templateUrl: "./device-list.component.html",
  styleUrl: "./device-list.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceListComponent {
  private readonly store = inject(DeviceListStore);
  private readonly dialog = inject(MatDialog);

  readonly displayedColumns: string[] = [
    "image",
    "deviceName",
    "tag",
    "category",
    "description",
    "actions",
  ];

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
