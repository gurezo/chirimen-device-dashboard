import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';
import { DEVICE_REPOSITORY } from '@chirimen-device-dashboard/libs-data-access';
import { ProductInfoComponent } from '../product-info/product-info.component';

const DEVICE_IMAGE_PLACEHOLDER = '/no_image.png';

function isPlaceholderImageSrc(img: HTMLImageElement): boolean {
  return (
    img.getAttribute('src') === DEVICE_IMAGE_PLACEHOLDER ||
    img.src.endsWith(DEVICE_IMAGE_PLACEHOLDER)
  );
}

@Component({
  selector: 'choh-device-detail',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterModule,
    ProductInfoComponent,
  ],
  templateUrl: './device-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceDetailComponent {
  readonly deviceId = input.required<string>();

  private readonly repository = inject(DEVICE_REPOSITORY);

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

  readonly result$ = toObservable(this.deviceId).pipe(
    switchMap((id) =>
      this.repository.get(id).pipe(
        map((device) => ({ device, error: null as string | null })),
        catchError((err: Error) =>
          of({
            device: null,
            error: err?.message ?? 'Failed to load device',
          }),
        ),
      ),
    ),
  );
}
