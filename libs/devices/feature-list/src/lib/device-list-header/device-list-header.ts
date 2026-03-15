import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'choh-device-list-header',
  standalone: true,
  imports: [],
  templateUrl: './device-list-header.html',
  host: {
    class:
      'col-span-full grid grid-cols-subgrid items-center min-h-14 whitespace-nowrap border-b border-black/10 sticky top-0 z-10 bg-[var(--mat-sys-surface)] dark:border-white/10',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceListHeaderComponent {}
