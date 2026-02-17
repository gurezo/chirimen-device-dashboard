import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatDialogRef } from '@angular/material/dialog';
import { beforeEach, describe, expect, it } from 'vitest';
import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [
        provideNoopAnimations(),
        {
          provide: MatDialogRef,
          useValue: { close: (): void => { return; } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show image when imageUrl is provided', () => {
    fixture.componentRef.setInput('imageUrl', 'https://example.com/image.png');
    fixture.componentRef.setInput('imageAlt', 'Test image');
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('.confirm-dialog__image');
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('https://example.com/image.png');
    expect(img.getAttribute('alt')).toBe('Test image');
  });

  it('should not show image when imageUrl is null', () => {
    fixture.componentRef.setInput('imageUrl', null);
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('.confirm-dialog__image');
    expect(img).toBeFalsy();
  });
});
