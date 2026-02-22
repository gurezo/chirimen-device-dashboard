import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { DeviceListStore } from '@chirimen-device-dashboard/libs-state';
import { TruncatePipe } from '../truncate.pipe';

@Component({
  selector: 'choh-device-card-list',
  standalone: true,
  imports: [
    AsyncPipe,
    MatCardModule,
    MatProgressSpinnerModule,
    RouterModule,
    TruncatePipe,
  ],
  templateUrl: './device-card-list.component.html',
  host: {
    class: 'flex flex-col flex-1 min-h-0 overflow-hidden',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceCardListComponent {
  private readonly store = inject(DeviceListStore);

  readonly filteredDevices$ = this.store.filteredDevices$;
  readonly loading$ = this.store.loading$;
  readonly error$ = this.store.error$;
}
