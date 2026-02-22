import { Route } from '@angular/router';

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
    loadComponent: () =>
      import('./pages/device-detail-page/device-detail-page.component').then(
        (m) => m.DeviceDetailPageComponent,
      ),
  },
];
