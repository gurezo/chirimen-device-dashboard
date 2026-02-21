import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductInfoComponent } from './product-info.component';
import type { ProductInfo } from '@chirimen-device-dashboard/shared-types';

describe('ProductInfoComponent', () => {
  let component: ProductInfoComponent;
  let fixture: ComponentFixture<ProductInfoComponent>;

  const mockProduct: ProductInfo = {
    url: 'https://example.com/product',
    example: [
      { hardware: 'Raspberry Pi', code: 'https://example.com/code' },
    ],
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

  it('should display product url', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('https://example.com/product');
  });
});
