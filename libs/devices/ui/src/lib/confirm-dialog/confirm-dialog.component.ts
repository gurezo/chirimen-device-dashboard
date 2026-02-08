import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'chirimen-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  readonly title = input<string>('確認');
  readonly message = input<string>('実行してもよろしいですか？');
  readonly confirmLabel = input<string>('OK');
  readonly cancelLabel = input<string>('キャンセル');

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  private readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>, {
    optional: true,
  }) as MatDialogRef<ConfirmDialogComponent> | null;

  onConfirm(): void {
    this.confirmed.emit();
    this.dialogRef?.close(true);
  }

  onCancel(): void {
    this.cancelled.emit();
    this.dialogRef?.close(false);
  }
}
