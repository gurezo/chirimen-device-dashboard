import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import type { DeviceInfo } from '@chirimen-device-dashboard/shared-types';
import type { DeviceIdOverridesFile } from './types';

export type DashboardDeviceMappingResult = {
  dashboardDeviceId: string | null;
  status: 'resolved' | 'ambiguous' | 'unresolved' | 'override';
  ambiguousDashboardDeviceIds?: string[];
};

export async function loadDeviceIdOverrides(
  repoRoot: string
): Promise<Record<string, string>> {
  const filePath = path.join(
    repoRoot,
    'data/example-upstreams/device-id-overrides.yaml'
  );

  try {
    const raw = await readFile(filePath, 'utf8');
    const parsed = parseYaml(raw) as unknown;

    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !('overrides' in parsed)
    ) {
      return {};
    }

    const { overrides } = parsed as DeviceIdOverridesFile;
    if (typeof overrides !== 'object' || overrides === null) {
      return {};
    }

    return overrides;
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      'code' in err &&
      (err as NodeJS.ErrnoException).code === 'ENOENT'
    ) {
      return {};
    }
    throw err;
  }
}

export async function loadDashboardDeviceIds(
  repoRoot: string
): Promise<string[]> {
  const filePath = path.join(repoRoot, 'apps/web/public/devices.json');
  const raw = await readFile(filePath, 'utf8');
  const devices = JSON.parse(raw) as DeviceInfo[];
  return devices.map((d) => d.id);
}

export function resolveDashboardDeviceId(
  exampleDeviceId: string,
  dashboardDeviceIds: string[],
  overrides: Record<string, string>
): DashboardDeviceMappingResult {
  const override = overrides[exampleDeviceId];
  if (override) {
    return {
      dashboardDeviceId: override,
      status: 'override',
    };
  }

  const suffix = `-${exampleDeviceId}`;
  const matches = dashboardDeviceIds.filter((id) => id.endsWith(suffix));

  if (matches.length === 1) {
    return {
      dashboardDeviceId: matches[0],
      status: 'resolved',
    };
  }

  if (matches.length > 1) {
    return {
      dashboardDeviceId: null,
      status: 'ambiguous',
      ambiguousDashboardDeviceIds: matches,
    };
  }

  return {
    dashboardDeviceId: null,
    status: 'unresolved',
  };
}
