import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'choh-device-list-header',
  standalone: true,
  imports: [],
  templateUrl: './device-list-header.html',
  styleUrl: './device-list-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceListHeaderComponent {}
