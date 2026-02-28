import { Provider } from '@angular/core';
import { DEVICE_REPOSITORY } from './device.repository';
import { JsonDeviceRepository } from './json-device.repository';

export function provideDeviceRepository(): Provider {
  return {
    provide: DEVICE_REPOSITORY,
    useClass: JsonDeviceRepository,
  };
}
