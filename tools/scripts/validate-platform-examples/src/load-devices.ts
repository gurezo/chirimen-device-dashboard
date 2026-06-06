import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { DeviceInfo } from '@chirimen-device-dashboard/shared-types';

export function getDefaultDevicesJsonPath(repoRoot: string): string {
  return path.join(repoRoot, 'apps/web/public/devices.json');
}

export function loadDevices(filePath: string): DeviceInfo[] {
  const raw = readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(raw) as unknown;

  if (!Array.isArray(parsed)) {
    throw new Error(`Expected array in ${filePath}`);
  }

  return parsed as DeviceInfo[];
}

export function loadDeviceIds(filePath: string): Set<string> {
  return new Set(loadDevices(filePath).map((device) => device.id));
}
