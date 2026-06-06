import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PlatformSpecificExamplesComponent } from '@chirimen-device-dashboard/libs-platform-specific-examples';
import type { ProductInfo } from '@chirimen-device-dashboard/shared-types';

@Component({
  selector: 'choh-product-info',
  standalone: true,
  imports: [PlatformSpecificExamplesComponent],
  templateUrl: './product-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductInfoComponent {
  readonly product = input.required<ProductInfo>();

  protected isUrl(value: string): boolean {
    return value.startsWith('http://') || value.startsWith('https://');
  }
}
