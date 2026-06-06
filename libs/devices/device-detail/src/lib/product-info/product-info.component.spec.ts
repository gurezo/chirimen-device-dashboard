import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { ExampleInfo, ProductInfo } from '@chirimen-device-dashboard/shared-types';
import { ProductInfoComponent } from './product-info.component';

const adt7410PlatformExample: ExampleInfo = {
  hardware: 'Pi Zero',
  code: 'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_adt7410',
  deviceId: 'adt7410',
  platform: 'pizero-esm',
  localPath: 'examples/devices/adt7410/platforms/pizero-esm',
  upstreamRepository: 'chirimen-oh/chirimen.org',
  upstreamRepositoryUrl: 'https://github.com/chirimen-oh/chirimen.org',
  upstreamPath: 'pizero/src/esm-examples/adt7410',
  upstreamPathUrl:
    'https://github.com/chirimen-oh/chirimen.org/tree/master/pizero/src/esm-examples/adt7410',
  status: 'primary',
  circuitUrl:
    'https://github.com/chirimen-oh/chirimen.org/blob/master/pizero/src/esm-examples/adt7410/PiZero_ADT7410.png',
  verified: false,
};

const legacyOnlyExamples: ExampleInfo[] = [
  {
    hardware: 'chirimen',
    code: 'https://r.chirimen.org/examples/#I2C-ADS1015',
  },
  {
    hardware: 'piZero',
    code: 'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_ads1015',
  },
];

describe('ProductInfoComponent', () => {
  let component: ProductInfoComponent;
  let fixture: ComponentFixture<ProductInfoComponent>;

  const mockProduct: ProductInfo = {
    url: 'https://example.com/product',
    example: [{ hardware: 'Raspberry Pi', code: 'https://example.com/code' }],
    datasheet: 'https://example.com/datasheet.pdf',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductInfoComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display product link with correct href', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector(
      'a[href="https://example.com/product"]',
    );
    expect(link).toBeTruthy();
    expect(link?.textContent?.trim()).toBe('商品ページを見る');
  });

  it('should display Platform 別 Example heading for platform-specific examples', () => {
    fixture.componentRef.setInput('product', {
      url: 'https://example.com/product',
      example: [adt7410PlatformExample],
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const headings = Array.from(compiled.querySelectorAll('h3')).map((h3) =>
      h3.textContent?.trim(),
    );
    expect(headings).toContain('Platform 別 Example');
    expect(compiled.textContent).toContain('pizero-esm');
    expect(compiled.querySelector('table')).toBeTruthy();
  });

  it('should show empty state when only legacy examples are provided', () => {
    fixture.componentRef.setInput('product', {
      url: 'https://example.com/product',
      example: legacyOnlyExamples,
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Platform 別 Example');
    expect(compiled.textContent).toContain('Platform 別 Example はありません');
    expect(compiled.textContent).not.toContain('サンプル');
    expect(compiled.querySelector('table')).toBeFalsy();
  });

  it('should filter out legacy examples from mixed input', () => {
    fixture.componentRef.setInput('product', {
      url: 'https://example.com/product',
      example: [...legacyOnlyExamples, adt7410PlatformExample],
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('pizero-esm');
    expect(compiled.textContent).not.toContain('I2C-ADS1015');
    expect(compiled.querySelector('table')).toBeTruthy();
  });
});
