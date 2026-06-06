import {
  isPlatformSpecificExample,
  type DeviceInfo,
  type ExampleInfo,
} from '@chirimen-device-dashboard/shared-types';
import type { ValidationIssue } from './types';

const PLATFORM_SPECIFIC_FIELDS = [
  'upstreamRepository',
  'upstreamRepositoryUrl',
  'upstreamPath',
  'upstreamPathUrl',
  'status',
  'circuitUrl',
] as const;

function validateLegacyExample(
  dashboardDeviceId: string,
  example: ExampleInfo
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!example.hardware?.trim()) {
    issues.push({
      source: 'devices.json',
      dashboardDeviceId,
      field: 'hardware',
      message: 'hardware is required',
    });
  }

  if (!example.code?.trim()) {
    issues.push({
      source: 'devices.json',
      dashboardDeviceId,
      field: 'code',
      message: 'code is required',
    });
  }

  return issues;
}

function validatePlatformSpecificExample(
  dashboardDeviceId: string,
  example: ExampleInfo
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const platform = example.platform ?? '(unknown)';

  if (!example.hardware?.trim()) {
    issues.push({
      source: 'devices.json',
      dashboardDeviceId,
      platform,
      field: 'hardware',
      message: 'hardware is required',
    });
  }

  if (!example.code?.trim()) {
    issues.push({
      source: 'devices.json',
      dashboardDeviceId,
      platform,
      field: 'code',
      message: 'code is required',
    });
  }

  for (const field of PLATFORM_SPECIFIC_FIELDS) {
    if (!example[field]?.trim()) {
      issues.push({
        source: 'devices.json',
        dashboardDeviceId,
        platform,
        field,
        message: `${field} is required`,
      });
    }
  }

  if (!isPlatformSpecificExample(example)) {
    issues.push({
      source: 'devices.json',
      dashboardDeviceId,
      platform,
      message: 'missing platform-specific fields',
    });
  }

  return issues;
}

export function validateDeviceProductExample(
  dashboardDeviceId: string,
  example: ExampleInfo
): ValidationIssue[] {
  if (isPlatformSpecificExample(example)) {
    return validatePlatformSpecificExample(dashboardDeviceId, example);
  }

  return validateLegacyExample(dashboardDeviceId, example);
}

export function validateDeviceProductExamples(
  devices: DeviceInfo[]
): ValidationIssue[] {
  return devices.flatMap((device) =>
    device.product.example.flatMap((example) =>
      validateDeviceProductExample(device.id, example)
    )
  );
}

export function comparePlatformExamplesWithSource(
  devices: DeviceInfo[],
  sourceEntries: Array<{ dashboardDeviceId: string; examples: ExampleInfo[] }>
): ValidationIssue[] {
  const warnings: ValidationIssue[] = [];
  const devicesById = new Map(devices.map((device) => [device.id, device]));

  for (const entry of sourceEntries) {
    const device = devicesById.get(entry.dashboardDeviceId);
    if (!device) {
      continue;
    }

    const sourcePlatforms = entry.examples
      .map((example) => example.platform)
      .filter(Boolean)
      .sort();
    const devicePlatforms = device.product.example
      .filter(isPlatformSpecificExample)
      .map((example) => example.platform)
      .sort();

    if (sourcePlatforms.join(',') !== devicePlatforms.join(',')) {
      warnings.push({
        source: 'devices.json',
        dashboardDeviceId: entry.dashboardDeviceId,
        message: `platform list mismatch (source: ${sourcePlatforms.join(', ') || '(none)'}; devices.json: ${devicePlatforms.join(', ') || '(none)'})`,
      });
    }
  }

  return warnings;
}
