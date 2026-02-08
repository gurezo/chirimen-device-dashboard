import { Provider } from '@angular/core';
import { DeviceListStore } from './device-list.store';

export function provideDeviceListStore(): Provider {
  return DeviceListStore;
}
