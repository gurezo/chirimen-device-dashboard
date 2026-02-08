import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FieldErrorComponent } from '../field-error/field-error.component';

@Component({
  selector: 'chirimen-example-array',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FieldErrorComponent,
  ],
  templateUrl: './example-array.component.html',
  styleUrl: './example-array.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleArrayComponent {
  /** FormArray of FormGroup<{ hardware: FormControl<string>, code: FormControl<string> }> */
  readonly formArray = input.required<FormArray<FormGroup>>();

  items(): FormGroup[] {
    const arr = this.formArray();
    const controls = arr.controls;
    return controls as FormGroup[];
  }

  addRow(): void {
    const arr = this.formArray();
    arr.push(
      new FormGroup({
        hardware: new FormControl('', { nonNullable: true }),
        code: new FormControl('', { nonNullable: true }),
      })
    );
  }

  removeRow(index: number): void {
    this.formArray().removeAt(index);
  }
}
