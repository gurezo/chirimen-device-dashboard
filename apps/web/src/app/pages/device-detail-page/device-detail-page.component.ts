import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs";
import { AsyncPipe } from "@angular/common";
import { DeviceDetailComponent } from "@chirimen-device-dashboard/libs-feature-detail";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-device-detail-page",
  standalone: true,
  imports: [AsyncPipe, DeviceDetailComponent, MatButtonModule, RouterLink],
  templateUrl: "./device-detail-page.component.html",
  styleUrl: "./device-detail-page.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceDetailPageComponent {
  private readonly route = inject(ActivatedRoute);

  readonly deviceId$ = this.route.paramMap.pipe(
    map((params) => params.get("id") ?? "")
  );
}
