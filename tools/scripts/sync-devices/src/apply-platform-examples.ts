import type { DeviceInfo } from '@chirimen-device-dashboard/shared-types';
import type { PlatformExampleDeviceEntry } from './types';

export function applyPlatformExamples(
  devices: DeviceInfo[],
  platformEntries: PlatformExampleDeviceEntry[]
): { devices: DeviceInfo[]; warnings: string[] } {
  const examplesByDeviceId = new Map(
    platformEntries.map((entry) => [entry.dashboardDeviceId, entry.examples])
  );
  const deviceIds = new Set(devices.map((device) => device.id));
  const warnings: string[] = [];

  for (const dashboardDeviceId of examplesByDeviceId.keys()) {
    if (!deviceIds.has(dashboardDeviceId)) {
      warnings.push(
        `platform-examples.json references unknown dashboardDeviceId: ${dashboardDeviceId}`
      );
    }
  }

  const mergedDevices = devices.map((device) => {
    const platformExamples = examplesByDeviceId.get(device.id);
    if (!platformExamples) {
      return device;
    }

    return {
      ...device,
      product: {
        ...device.product,
        example: platformExamples.map((example) => ({ ...example })),
      },
    };
  });

  return { devices: mergedDevices, warnings };
}
