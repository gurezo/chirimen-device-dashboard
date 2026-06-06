import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  adt7410PlatformExamples,
  legacyOnlyExamples,
  mixedExamples,
} from '../testing/platform-examples.fixture';
import { PlatformSpecificExamplesComponent } from './platform-specific-examples.component';

describe('PlatformSpecificExamplesComponent', () => {
  let component: PlatformSpecificExamplesComponent;
  let fixture: ComponentFixture<PlatformSpecificExamplesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatformSpecificExamplesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlatformSpecificExamplesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('examples', adt7410PlatformExamples);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display only platform-specific examples from ADT7410 fixture', () => {
    fixture.componentRef.setInput('examples', adt7410PlatformExamples);
    fixture.detectChanges();

    expect(component.platformSpecificExamples()).toHaveLength(5);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('pizero-esm');
    expect(compiled.textContent).toContain('legacy-gc-i2c');
  });

  it('should show empty state when only legacy examples are provided', () => {
    fixture.componentRef.setInput('examples', legacyOnlyExamples);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Platform 別 Example はありません');
    expect(compiled.querySelector('table')).toBeFalsy();
    expect(compiled.querySelector('choh-platform-specific-example-card')).toBeFalsy();
    expect(compiled.querySelector('.rounded-lg.border')).toBeTruthy();
  });

  it('should filter out legacy examples from mixed input', () => {
    fixture.componentRef.setInput('examples', mixedExamples);
    fixture.detectChanges();

    expect(component.platformSpecificExamples()).toHaveLength(1);
    expect(component.platformSpecificExamples()[0].platform).toBe('pizero-esm');

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).not.toContain('I2C-ADS1015');
    expect(compiled.textContent).not.toContain('I2C_ads1015');
  });

  it('should use responsive layout classes for table and cards', () => {
    fixture.componentRef.setInput('examples', adt7410PlatformExamples);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const tableWrapper = compiled.querySelector('.hidden.md\\:block');
    const cardContainer = compiled.querySelector('.md\\:hidden');

    expect(tableWrapper).toBeTruthy();
    expect(cardContainer).toBeTruthy();
    expect(compiled.querySelector('.overflow-x-auto')).toBeFalsy();
  });

  it('should apply nowrap headers and truncate long table cells', () => {
    fixture.componentRef.setInput('examples', [adt7410PlatformExamples[0]]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const table = compiled.querySelector('table');
    expect(table).toBeTruthy();
    expect(table?.classList.contains('table-fixed')).toBe(true);

    const headers = table?.querySelectorAll('thead th');
    expect(headers?.length).toBe(5);

    const repoHeader = table?.querySelector('thead th span[title="Upstream Repository"]');
    const pathHeader = table?.querySelector('thead th span[title="Upstream Path"]');
    expect(repoHeader?.classList.contains('truncate')).toBe(true);
    expect(pathHeader?.classList.contains('truncate')).toBe(true);

    const repoLink = compiled.querySelector(
      'table a[href="https://github.com/chirimen-oh/chirimen.org"]',
    );
    const pathLink = compiled.querySelector(
      'table a[href="https://github.com/chirimen-oh/chirimen.org/tree/master/pizero/src/esm-examples/adt7410"]',
    );

    expect(repoLink?.classList.contains('truncate')).toBe(true);
    expect(pathLink?.classList.contains('truncate')).toBe(true);
    expect(repoLink?.getAttribute('title')).toBe('chirimen.org');
    expect(pathLink?.getAttribute('title')).toBe(
      'pizero/src/esm-examples/adt7410',
    );
  });

  it('should render status badges in table rows', () => {
    fixture.componentRef.setInput('examples', adt7410PlatformExamples);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const table = compiled.querySelector('table');
    expect(table).toBeTruthy();
    expect(table?.textContent).toContain('primary');
    expect(table?.textContent).toContain('legacy');
    expect(table?.textContent).toContain('archive');
    expect(table?.querySelectorAll('tbody span.rounded-md').length).toBe(5);
  });

  it('should render table links for repository, path, and circuit', () => {
    fixture.componentRef.setInput('examples', [adt7410PlatformExamples[0]]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const table = compiled.querySelector('table');
    expect(table).toBeTruthy();

    const repoLink = compiled.querySelector(
      'table a[href="https://github.com/chirimen-oh/chirimen.org"]',
    );
    const pathLink = compiled.querySelector(
      'table a[href="https://github.com/chirimen-oh/chirimen.org/tree/master/pizero/src/esm-examples/adt7410"]',
    );
    const circuitLink = compiled.querySelector(
      'table a[href="https://github.com/chirimen-oh/chirimen.org/blob/master/pizero/src/esm-examples/adt7410/PiZero_ADT7410.png"]',
    );

    expect(repoLink).toBeTruthy();
    expect(pathLink).toBeTruthy();
    expect(circuitLink).toBeTruthy();

    for (const link of [repoLink, pathLink, circuitLink]) {
      expect(link?.getAttribute('target')).toBe('_blank');
      expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
    }
  });

  it('should render mobile cards for platform-specific examples', () => {
    fixture.componentRef.setInput('examples', adt7410PlatformExamples);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('choh-platform-specific-example-card');
    expect(cards.length).toBe(5);
  });
});
