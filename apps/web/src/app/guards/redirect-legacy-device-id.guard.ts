import { inject } from '@angular/core';
import {
  RedirectCommand,
  Router,
  type CanActivateFn,
} from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { DEVICE_REPOSITORY } from '@chirimen-device-dashboard/libs-data-access';

export const redirectLegacyDeviceIdGuard: CanActivateFn = (route) => {
  const repository = inject(DEVICE_REPOSITORY);
  const router = inject(Router);
  const id = route.paramMap.get('id') ?? '';

  return repository.get(id).pipe(
    map((device) => {
      if (device && device.id !== id) {
        return new RedirectCommand(router.createUrlTree(['/devices', device.id]), {
          replaceUrl: true,
        });
      }
      return true;
    }),
    catchError(() => of(true)),
  );
};
