import { Route } from "@angular/router";

export const appRoutes: Route[] = [
  {
    path: "",
    loadComponent: () =>
      import("@chirimen-device-dashboard/libs-feature-list").then((m) => m.DeviceListComponent),
  },
];
