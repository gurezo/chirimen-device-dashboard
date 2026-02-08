import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormArray, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import type { DeviceFormValue } from '../form-types';
import { DeviceImageUploaderComponent } from '../device-image-uploader/device-image-uploader.component';
import { ExampleArrayComponent } from '../example-array/example-array.component';
import { FieldErrorComponent } from '../field-error/field-error.component';

@Component({
  selector: 'chirimen-device-form',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    FieldErrorComponent,
    DeviceImageUploaderComponent,
    ExampleArrayComponent,
  ],
  templateUrl: './device-form.component.html',
  styleUrl: './device-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceFormComponent {
  readonly formGroup = input<FormGroup | null>(null);
  /** 画像プレビュー用 URL（親で管理しバインドする） */
  readonly currentImageUrl = input<string | null>(null);
  readonly submitLabel = input<string>('保存');
  readonly cancelLabel = input<string>('キャンセル');

  readonly submit = output<DeviceFormValue>();
  readonly cancel = output<void>();
  readonly imageChanged = output<File | null>();

  exampleFormArray(): FormArray<FormGroup> {
    const g = this.formGroup();
    const product = g?.get('product') as FormGroup | null;
    return (product?.get('example') as FormArray<FormGroup>) ?? new FormArray([]);
  }

  onSubmit(): void {
    const g = this.formGroup();
    if (!g || g.invalid) return;
    const value = g.getRawValue() as DeviceFormValue;
    this.submit.emit(value);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onImageChanged(file: File | null): void {
    this.imageChanged.emit(file);
  }
}
