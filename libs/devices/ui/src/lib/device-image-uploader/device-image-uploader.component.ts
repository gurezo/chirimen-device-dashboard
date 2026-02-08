import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'chirimen-device-image-uploader',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './device-image-uploader.component.html',
  styleUrl: './device-image-uploader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceImageUploaderComponent {
  readonly currentImageUrl = input<string | null>(null);
  readonly imageChanged = output<File | null>();

  readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.imageChanged.emit(file);
    }
    input.value = '';
  }

  onClear(): void {
    this.imageChanged.emit(null);
  }
}
