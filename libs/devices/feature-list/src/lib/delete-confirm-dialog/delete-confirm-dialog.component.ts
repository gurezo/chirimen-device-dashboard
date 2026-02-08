import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Inject,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@chirimen-device-dashboard/libs-ui';

export interface DeleteConfirmDialogData {
  deviceName: string;
  deviceId: string;
}

@Component({
  selector: 'chirimen-delete-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, ConfirmDialogComponent],
  templateUrl: './delete-confirm-dialog.component.html',
  styleUrl: './delete-confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteConfirmDialogComponent {
  private readonly dialogRef = inject(
    MatDialogRef<DeleteConfirmDialogComponent>
  );

  readonly message: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: DeleteConfirmDialogData | undefined
  ) {
    this.message =
      data?.deviceName != null
        ? `「${data.deviceName}」を削除してもよろしいですか？`
        : '削除してもよろしいですか？';
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
