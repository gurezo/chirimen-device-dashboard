import { Route } from '@angular/router';
import { redirectLegacyDeviceIdGuard } from './guards/redirect-legacy-device-id.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/device-list-page/device-list-page.component').then(
        (m) => m.DeviceListPageComponent,
      ),
  },
  {
    path: 'devices/:id',
    canActivate: [redirectLegacyDeviceIdGuard],
    loadComponent: () =>
      import('./pages/device-detail-page/device-detail-page.component').then(
        (m) => m.DeviceDetailPageComponent,
      ),
  },
];
