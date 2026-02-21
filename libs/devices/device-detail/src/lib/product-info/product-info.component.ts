import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import type { ProductInfo } from '@chirimen-device-dashboard/shared-types';
import { ExampleInfoComponent } from '../example-info/example-info.component';

@Component({
  selector: 'chirimen-product-info',
  standalone: true,
  imports: [MatIconModule, MatListModule, ExampleInfoComponent],
  templateUrl: './product-info.component.html',
  styleUrl: './product-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductInfoComponent {
  readonly product = input.required<ProductInfo>();
}
