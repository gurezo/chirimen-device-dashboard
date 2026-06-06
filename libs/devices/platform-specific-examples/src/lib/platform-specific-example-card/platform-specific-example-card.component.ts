import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  SecurityContext,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import type {
  ExampleInfo,
  ExampleStatus,
} from '@chirimen-device-dashboard/shared-types';

export type PlatformSpecificExample = ExampleInfo & {
  platform: string;
  upstreamRepository: string;
  upstreamPath: string;
  upstreamPathUrl: string;
  status: ExampleStatus;
};

@Component({
  selector: 'choh-platform-specific-example-card',
  standalone: true,
  imports: [],
  templateUrl: './platform-specific-example-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlatformSpecificExampleCardComponent {
  readonly example = input.required<PlatformSpecificExample>();
  private readonly sanitizer = inject(DomSanitizer);

  getRepositoryDisplayName(): string {
    const repository = this.example().upstreamRepository;
    const slashIndex = repository.lastIndexOf('/');
    return slashIndex >= 0 ? repository.slice(slashIndex + 1) : repository;
  }

  getSanitizedUrl(url: string): string | null {
    return this.sanitizer.sanitize(SecurityContext.URL, url);
  }
}
