import { AsyncPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { RouterLink } from "@angular/router";
import { switchMap, of, catchError, startWith } from "rxjs";
import type { DeviceInfo } from "@chirimen-device-dashboard/shared-types";
import { DEVICE_REPOSITORY } from "@chirimen-device-dashboard/libs-data-access";

@Component({
  selector: "chirimen-device-detail",
  standalone: true,
  imports: [AsyncPipe, MatProgressSpinnerModule, RouterLink],
  templateUrl: "./device-detail.component.html",
  styleUrl: "./device-detail.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceDetailComponent {
  private readonly repository = inject(DEVICE_REPOSITORY);

  readonly deviceId = input.required<string>();

  readonly device$ = toObservable(this.deviceId).pipe(
    switchMap((id) =>
      this.repository.get(id).pipe(
        startWith(undefined as DeviceInfo | null | undefined),
        catchError(() => of(null))
      )
    )
  );
}
