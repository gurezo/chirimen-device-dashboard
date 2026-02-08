import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ExampleArrayComponent } from './example-array.component';

describe('ExampleArrayComponent', () => {
  let component: ExampleArrayComponent;
  let fixture: ComponentFixture<ExampleArrayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleArrayComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(ExampleArrayComponent);
    component = fixture.componentInstance;
    const formArray = new FormArray<FormGroup>([
      new FormGroup({
        hardware: new FormControl('', { nonNullable: true }),
        code: new FormControl('', { nonNullable: true }),
      }),
    ]);
    fixture.componentRef.setInput('formArray', formArray);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
