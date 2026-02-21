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
  selector: 'app-device-detail-page',
  standalone: true,
  imports: [DeviceDetailComponent],
  templateUrl: './device-detail-page.component.html',
  styleUrl: './device-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceDetailPageComponent {
  private readonly route = inject(ActivatedRoute);

  readonly deviceId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? '')),
    { initialValue: '' }
  );
}
