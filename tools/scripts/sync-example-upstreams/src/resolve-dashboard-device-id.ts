import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import type { DeviceInfo } from '@chirimen-device-dashboard/shared-types';
import type { DeviceIdOverridesFile } from './types';

export type DashboardDeviceMappingStatus =
  | 'resolved'
  | 'fan-out'
  | 'ambiguous'
  | 'unresolved'
  | 'override';

export type DashboardDeviceMappingResult = {
  dashboardDeviceIds: string[];
  status: DashboardDeviceMappingStatus;
  ambiguousDashboardDeviceIds?: string[];
};

export type DeviceIdOverrideValue = string | string[];

export async function loadDeviceIdOverrides(
  repoRoot: string
): Promise<Record<string, DeviceIdOverrideValue>> {
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

export function matchProductAlias(
  exampleDeviceId: string,
  dashboardDeviceIds: string[]
): string[] {
  if (exampleDeviceId === 'neopixel-i2c') {
    return dashboardDeviceIds.filter(
      (id) => id === 'i2c-neopixel-led' || id.startsWith('i2c-neopixel-led-')
    );
  }

  return [];
}

export function findDashboardDeviceIdMatches(
  exampleDeviceId: string,
  dashboardDeviceIds: string[]
): string[] {
  const suffix = `-${exampleDeviceId}`;
  const suffixMatches = dashboardDeviceIds.filter((id) => id.endsWith(suffix));
  if (suffixMatches.length > 0) {
    return suffixMatches;
  }

  const infix = `-${exampleDeviceId}-`;
  const infixMatches = dashboardDeviceIds.filter((id) => id.includes(infix));
  if (infixMatches.length > 0) {
    return infixMatches;
  }

  return matchProductAlias(exampleDeviceId, dashboardDeviceIds);
}

function categorizeMatches(
  matches: string[]
): Pick<
  DashboardDeviceMappingResult,
  'dashboardDeviceIds' | 'status' | 'ambiguousDashboardDeviceIds'
> {
  if (matches.length === 0) {
    return {
      dashboardDeviceIds: [],
      status: 'unresolved',
    };
  }

  if (matches.length === 1) {
    return {
      dashboardDeviceIds: matches,
      status: 'resolved',
    };
  }

  const interfaceTags = new Set(matches.map((id) => id.split('-')[0]));
  if (interfaceTags.size > 1) {
    return {
      dashboardDeviceIds: [],
      status: 'ambiguous',
      ambiguousDashboardDeviceIds: matches,
    };
  }

  return {
    dashboardDeviceIds: matches,
    status: 'fan-out',
  };
}

export function resolveDashboardDeviceId(
  exampleDeviceId: string,
  dashboardDeviceIds: string[],
  overrides: Record<string, DeviceIdOverrideValue>
): DashboardDeviceMappingResult {
  const override = overrides[exampleDeviceId];
  if (override) {
    const dashboardDeviceIdsFromOverride = Array.isArray(override)
      ? override
      : [override];

    return {
      dashboardDeviceIds: dashboardDeviceIdsFromOverride,
      status: 'override',
    };
  }

  const matches = findDashboardDeviceIdMatches(
    exampleDeviceId,
    dashboardDeviceIds
  );

  return categorizeMatches(matches);
}
