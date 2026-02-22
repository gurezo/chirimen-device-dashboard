import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DeviceCardListComponent } from '@chirimen-device-dashboard/libs-card-list';
import { DeviceListComponent } from '@chirimen-device-dashboard/libs-feature-list';
import {
  DeviceListStore,
  provideDeviceListStore,
} from '@chirimen-device-dashboard/libs-state';

type ViewMode = 'table' | 'card';

@Component({
  selector: 'choh-device-list-page',
  standalone: true,
  providers: [provideDeviceListStore()],
  imports: [
    FormsModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    DeviceListComponent,
    DeviceCardListComponent,
  ],
  templateUrl: './device-list-page.component.html',
  host: {
    class: 'flex flex-col flex-1 min-h-0 overflow-hidden',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceListPageComponent implements OnInit {
  private readonly store = inject(DeviceListStore);

  readonly viewMode = signal<ViewMode>('table');
  readonly query = signal('');

  ngOnInit(): void {
    this.store.loadDevices(undefined as never);
  }

  setViewMode(mode: ViewMode | null): void {
    if (mode) this.viewMode.set(mode);
  }

  onQueryChange(value: string): void {
    this.query.set(value);
    this.store.setQuery(value);
  }
}
