import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExampleInfoComponent } from './example-info.component';
import type { ExampleInfo } from '@chirimen-device-dashboard/shared-types';

describe('ExampleInfoComponent', () => {
  let component: ExampleInfoComponent;
  let fixture: ComponentFixture<ExampleInfoComponent>;

  const mockExample: ExampleInfo = {
    hardware: 'Raspberry Pi',
    code: 'https://example.com/code',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExampleInfoComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('example', mockExample);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display hardware and code', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Raspberry Pi');
    expect(compiled.textContent).toContain('https://example.com/code');
  });

  it('should render URL code as link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector('a.example-info__code--link');
    expect(link).toBeTruthy();
    expect(link?.getAttribute('href')).toBe('https://example.com/code');
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('should render non-URL code as text', () => {
    fixture.componentRef.setInput('example', {
      hardware: 'chirimen',
      code: 'const x = 1;',
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector('a');
    expect(link).toBeFalsy();
    expect(compiled.textContent).toContain('const x = 1;');
  });
});
