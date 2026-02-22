import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { DeviceDetailComponent } from '@chirimen-device-dashboard/libs-device-detail';

@Component({
  selector: 'choh-device-detail-page',
  standalone: true,
  imports: [DeviceDetailComponent],
  templateUrl: './device-detail-page.component.html',
  host: {
    class: 'flex flex-col flex-1 min-h-0 overflow-y-auto overflow-x-hidden',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceDetailPageComponent {
  private readonly route = inject(ActivatedRoute);

  readonly deviceId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? '')),
    { initialValue: '' }
  );
}
