import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DeviceListStore,
  provideDeviceListStore,
} from '@chirimen-device-dashboard/libs-state';
import type { DeviceInfo } from '@chirimen-device-dashboard/shared-types';
import { DeleteConfirmDialogComponent } from '../delete-confirm-dialog/delete-confirm-dialog.component';

@Component({
  selector: 'chirimen-device-list',
  standalone: true,
  providers: [provideDeviceListStore()],
  imports: [
    AsyncPipe,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTableModule,
  ],
  templateUrl: './device-list.component.html',
  styleUrl: './device-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceListComponent implements OnInit {
  private readonly store = inject(DeviceListStore);
  private readonly dialog = inject(MatDialog);

  readonly displayedColumns: string[] = [
    'id',
    'deviceName',
    'tag',
    'category',
    'description',
    'actions',
  ];

  readonly filteredDevices$ = this.store.filteredDevices$;
  readonly loading$ = this.store.loading$;
  readonly error$ = this.store.error$;

  /** Two-way binding target for search query (template uses ngModel) */
  readonly query = signal('');

  ngOnInit(): void {
    this.store.loadDevices(undefined as never);
  }

  onQueryChange(value: string): void {
    this.query.set(value);
    this.store.setQuery(value);
  }

  confirmDelete(device: DeviceInfo): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      data: { deviceName: device.deviceName, deviceId: device.id },
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.store.deleteDevice(device.id as never);
      }
    });
  }
}
