import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Inject,
} from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { ConfirmDialogComponent } from "@chirimen-device-dashboard/libs-ui";

export interface DeleteConfirmDialogData {
  deviceName: string;
  deviceId: string;
  deviceImage?: string;
}

@Component({
  selector: "chirimen-delete-confirm-dialog",
  standalone: true,
  imports: [MatDialogModule, ConfirmDialogComponent],
  templateUrl: "./delete-confirm-dialog.component.html",
  styleUrl: "./delete-confirm-dialog.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteConfirmDialogComponent {
  private readonly dialogRef = inject(
    MatDialogRef<DeleteConfirmDialogComponent>,
  );

  readonly message: string;
  readonly deviceImage: string | null;
  readonly deviceName: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: DeleteConfirmDialogData | undefined,
  ) {
    this.deviceName = data?.deviceName ?? "";
    this.message =
      data?.deviceName != null
        ? `「${data.deviceName}」を削除してもよろしいですか？`
        : "削除してもよろしいですか？";
    this.deviceImage =
      data?.deviceImage != null && data.deviceImage !== ""
        ? data.deviceImage
        : null;
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
