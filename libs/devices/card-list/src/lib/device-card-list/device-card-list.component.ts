import { AsyncPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { DeviceListStore } from "@chirimen-device-dashboard/libs-state";
import { TruncatePipe } from "../truncate.pipe";

@Component({
  selector: "chirimen-device-card-list",
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    MatCardModule,
    MatProgressSpinnerModule,
    TruncatePipe,
  ],
  templateUrl: "./device-card-list.component.html",
  styleUrl: "./device-card-list.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceCardListComponent {
  private readonly store = inject(DeviceListStore);

  readonly filteredDevices$ = this.store.filteredDevices$;
  readonly loading$ = this.store.loading$;
  readonly error$ = this.store.error$;
}
