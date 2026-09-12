import { inject, Provider } from '@angular/core';
import {
  CERTIFIED_DEVICES_JSON_URL,
  DEFAULT_CERTIFIED_DEVICES_JSON_URL,
} from './certified-devices.config';
import { DEVICE_REPOSITORY } from './device.repository';
import { JsonDeviceRepository } from './json-device.repository';

export function provideDeviceRepository(): Provider[] {
  return [
    {
      provide: CERTIFIED_DEVICES_JSON_URL,
      useValue: DEFAULT_CERTIFIED_DEVICES_JSON_URL,
    },
    {
      provide: DEVICE_REPOSITORY,
      useFactory: () =>
        new JsonDeviceRepository(inject(CERTIFIED_DEVICES_JSON_URL)),
    },
  ];
}
