import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  SecurityContext,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
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
  private readonly sanitizer = inject(DomSanitizer);

  isUrl(str: string): boolean {
    return (
      typeof str === 'string' &&
      (str.startsWith('http://') || str.startsWith('https://'))
    );
  }

  getSanitizedUrl(url: string): string | null {
    return this.sanitizer.sanitize(SecurityContext.URL, url);
  }
}
