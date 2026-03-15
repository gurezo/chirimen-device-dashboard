import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DeviceListStore } from '@chirimen-device-dashboard/libs-state';
import { DeviceListHeaderComponent } from '../device-list-header/device-list-header';
import { DeviceListItemComponent } from '../device-list-item/device-list-item';

@Component({
  selector: 'choh-device-list',
  standalone: true,
  imports: [
    AsyncPipe,
    MatProgressSpinnerModule,
    DeviceListHeaderComponent,
    DeviceListItemComponent,
  ],
  templateUrl: './device-list.component.html',
  host: {
    class: 'flex flex-col flex-1 min-h-0 overflow-hidden',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceListComponent {
  private readonly store = inject(DeviceListStore);

  readonly filteredDevices$ = this.store.filteredDevices$;
  readonly loading$ = this.store.loading$;
  readonly error$ = this.store.error$;
}
