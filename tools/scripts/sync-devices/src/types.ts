import type { ExampleInfo } from '@chirimen-device-dashboard/shared-types';

export interface PlatformExampleDeviceEntry {
  dashboardDeviceId: string;
  exampleDeviceId: string;
  examples: ExampleInfo[];
}
