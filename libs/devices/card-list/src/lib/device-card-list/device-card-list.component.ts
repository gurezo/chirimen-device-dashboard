import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { DeviceListStore } from '@chirimen-device-dashboard/libs-state';
import { TruncatePipe } from '../truncate.pipe';

const DEVICE_IMAGE_PLACEHOLDER = '/no_image.png';

function isPlaceholderImageSrc(img: HTMLImageElement): boolean {
  return (
    img.getAttribute('src') === DEVICE_IMAGE_PLACEHOLDER ||
    img.src.endsWith(DEVICE_IMAGE_PLACEHOLDER)
  );
}

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
}
