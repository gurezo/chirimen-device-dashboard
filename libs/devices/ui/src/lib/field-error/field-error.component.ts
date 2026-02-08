import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'chirimen-field-error',
  templateUrl: './field-error.component.html',
  styleUrl: './field-error.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldErrorComponent {
  readonly control = input<AbstractControl | null>(null);

  getErrorMessage(): string {
    const ctrl = this.control();
    if (!ctrl?.errors) return '';
    const err = ctrl.errors;
    if (err['required']) return '必須項目です';
    if (err['minlength'])
      return `最低${err['minlength'].requiredLength}文字以上入力してください`;
    if (err['maxlength'])
      return `最大${err['maxlength'].requiredLength}文字までです`;
    if (err['email']) return '有効なメールアドレスを入力してください';
    if (err['pattern']) return '形式が正しくありません';
    return '入力内容を確認してください';
  }
}
