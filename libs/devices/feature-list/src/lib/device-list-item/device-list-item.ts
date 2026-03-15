import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import type { DeviceInfo } from '@chirimen-device-dashboard/shared-types';

@Component({
  selector: 'choh-device-list-item',
  standalone: true,
  imports: [],
  templateUrl: './device-list-item.html',
  host: {
    class:
      'col-span-full grid grid-cols-subgrid items-center min-h-14 cursor-pointer border-b border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10',
    role: 'button',
    tabindex: '0',
    '(click)': 'navigateToDetail()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceListItemComponent {
  readonly device = input.required<DeviceInfo>();
  private readonly router = inject(Router);

  navigateToDetail(): void {
    this.router.navigate(['/devices', this.device().id]);
  }
}
