import { InjectionToken } from '@angular/core';

export const DEFAULT_CERTIFIED_DEVICES_JSON_URL =
  'https://raw.githubusercontent.com/gurezo/chirimen-certified-devices/main/generated/devices.json';

export const CERTIFIED_DEVICES_JSON_URL = new InjectionToken<string>(
  'CertifiedDevicesJsonUrl',
);

export const CERTIFIED_DEVICES_FETCH_TIMEOUT_MS = 10_000;
