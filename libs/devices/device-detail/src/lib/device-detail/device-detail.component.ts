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

  readonly result$ = toObservable(this.deviceId).pipe(
    switchMap((id) =>
      this.repository.get(id).pipe(
        map((device) => ({ device, error: null as string | null })),
        catchError((err: Error) =>
          of({
            device: null,
            error: err?.message ?? 'Failed to load device',
          })
        )
      )
    )
  );
}
