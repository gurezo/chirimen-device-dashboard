import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import type { DeviceInfo } from '@chirimen-device-dashboard/shared-types';

@Component({
  selector: 'choh-device-list-item',
  standalone: true,
  imports: [],
  templateUrl: './device-list-item.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceListItemComponent {
  readonly device = input.required<DeviceInfo>();
  private readonly router = inject(Router);

  navigateToDetail(): void {
    this.router.navigate(['/devices', this.device().id]);
  }
}
