import { ComponentFixture, TestBed } from '@angular/core/testing';
import { isPlatformSpecificExample } from '@chirimen-device-dashboard/shared-types';
import { beforeEach, describe, expect, it } from 'vitest';
import { adt7410PlatformExamples } from '../testing/platform-examples.fixture';
import { PlatformSpecificExampleCardComponent } from './platform-specific-example-card.component';

describe('PlatformSpecificExampleCardComponent', () => {
  let component: PlatformSpecificExampleCardComponent;
  let fixture: ComponentFixture<PlatformSpecificExampleCardComponent>;

  const example = adt7410PlatformExamples[3];
  if (!isPlatformSpecificExample(example)) {
    throw new Error('fixture example must be platform-specific');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatformSpecificExampleCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlatformSpecificExampleCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('example', example);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display platform and status badge in header', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('pizero-esm');
    expect(compiled.textContent).toContain('primary');
    expect(compiled.querySelector('span.rounded-md')).toBeTruthy();
  });

  it('should not show separate status label row', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const labels = Array.from(compiled.querySelectorAll('span.text-xs')).map(
      (el) => el.textContent?.trim(),
    );
    expect(labels).not.toContain('状態');
  });

  it('should render repository, path, and circuit links', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const repoLink = compiled.querySelector(
      'a[href="https://github.com/chirimen-oh/chirimen.org"]',
    );
    const pathLink = compiled.querySelector(
      'a[href="https://github.com/chirimen-oh/chirimen.org/tree/master/pizero/src/esm-examples/adt7410"]',
    );
    const circuitLink = compiled.querySelector(
      'a[href="https://github.com/chirimen-oh/chirimen.org/blob/master/pizero/src/esm-examples/adt7410/PiZero_ADT7410.png"]',
    );

    expect(repoLink).toBeTruthy();
    expect(pathLink).toBeTruthy();
    expect(circuitLink).toBeTruthy();
    expect(repoLink?.textContent?.trim()).toBe('chirimen.org');
    expect(pathLink?.textContent?.trim()).toBe('pizero/src/esm-examples/adt7410');
    expect(circuitLink?.textContent?.trim()).toBe('回路図');
  });

  it('should set link attributes for external navigation', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('a');

    for (const link of Array.from(links)) {
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    }
  });
});
