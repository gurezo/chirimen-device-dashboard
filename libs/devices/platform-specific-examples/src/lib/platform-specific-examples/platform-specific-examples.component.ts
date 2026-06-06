import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  SecurityContext,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  isPlatformSpecificExample,
  type ExampleInfo,
} from '@chirimen-device-dashboard/shared-types';
import {
  compareExampleStatus,
  getExampleStatusClasses,
  getExampleStatusLabel,
} from '../example-status';
import {
  PlatformSpecificExampleCardComponent,
  type PlatformSpecificExample,
} from '../platform-specific-example-card/platform-specific-example-card.component';

@Component({
  selector: 'choh-platform-specific-examples',
  standalone: true,
  imports: [PlatformSpecificExampleCardComponent],
  templateUrl: './platform-specific-examples.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlatformSpecificExamplesComponent {
  readonly examples = input.required<ExampleInfo[]>();

  readonly platformSpecificExamples = computed(() => {
    const filtered = this.examples().filter(isPlatformSpecificExample);
    return [...filtered].sort((a, b) =>
      compareExampleStatus(a.status, b.status),
    );
  });

  private readonly sanitizer = inject(DomSanitizer);

  getRepositoryDisplayName(example: PlatformSpecificExample): string {
    const slashIndex = example.upstreamRepository.lastIndexOf('/');
    return slashIndex >= 0
      ? example.upstreamRepository.slice(slashIndex + 1)
      : example.upstreamRepository;
  }

  getSanitizedUrl(url: string): string | null {
    return this.sanitizer.sanitize(SecurityContext.URL, url);
  }

  getExampleStatusLabel = getExampleStatusLabel;
  getExampleStatusClasses = getExampleStatusClasses;
}
