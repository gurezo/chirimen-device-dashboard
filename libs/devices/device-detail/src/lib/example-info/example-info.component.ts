import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import type { ExampleInfo } from '@chirimen-device-dashboard/shared-types';

@Component({
  selector: 'chirimen-example-info',
  standalone: true,
  imports: [],
  templateUrl: './example-info.component.html',
  styleUrl: './example-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleInfoComponent {
  readonly example = input.required<ExampleInfo>();
}
