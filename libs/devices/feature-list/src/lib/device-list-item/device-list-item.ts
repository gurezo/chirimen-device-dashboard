import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import type { DeviceInfo } from '@chirimen-device-dashboard/shared-types';

const DEVICE_IMAGE_PLACEHOLDER = '/no_image.png';

function isPlaceholderImageSrc(img: HTMLImageElement): boolean {
  return (
    img.getAttribute('src') === DEVICE_IMAGE_PLACEHOLDER ||
    img.src.endsWith(DEVICE_IMAGE_PLACEHOLDER)
  );
}

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

  deviceImageSrc(image: string): string {
    return image.trim() ? image : DEVICE_IMAGE_PLACEHOLDER;
  }

  onDeviceImageError(event: Event): void {
    const img = event.target as HTMLImageElement | null;
    if (!img || isPlaceholderImageSrc(img)) {
      return;
    }
    img.src = DEVICE_IMAGE_PLACEHOLDER;
  }

  navigateToDetail(): void {
    this.router.navigate(['/devices', this.device().id]);
  }
}
