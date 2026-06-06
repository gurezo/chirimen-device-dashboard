import {
  isPlatformSpecificExample,
  type ExampleInfo,
} from '@chirimen-device-dashboard/shared-types';
import type { PlatformExampleDeviceEntry } from './types';

export type ValidationError = {
  dashboardDeviceId: string;
  platform?: string;
  message: string;
};

const ADT7410_PLATFORMS = [
  'pizero-esm',
  'node',
  'raspi-node',
  'microbit-driver',
  'legacy-gc-i2c',
] as const;

function validateExample(
  dashboardDeviceId: string,
  example: ExampleInfo
): ValidationError[] {
  const errors: ValidationError[] = [];
  const platform = example.platform ?? '(unknown)';

  if (!example.hardware?.trim()) {
    errors.push({
      dashboardDeviceId,
      platform,
      message: 'hardware is required',
    });
  }

  if (!example.code?.trim()) {
    errors.push({
      dashboardDeviceId,
      platform,
      message: 'code is required',
    });
  }

  if (!isPlatformSpecificExample(example)) {
    errors.push({
      dashboardDeviceId,
      platform,
      message: 'missing platform-specific fields',
    });
  } else {
    if (!example.upstreamRepositoryUrl?.trim()) {
      errors.push({
        dashboardDeviceId,
        platform,
        message: 'upstreamRepositoryUrl is required',
      });
    }
  }

  return errors;
}

export function validatePlatformExamples(
  entries: PlatformExampleDeviceEntry[]
): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const entry of entries) {
    for (const example of entry.examples) {
      errors.push(...validateExample(entry.dashboardDeviceId, example));
    }
  }

  return errors;
}

export function validateAdt7410Platforms(
  entries: PlatformExampleDeviceEntry[]
): ValidationError[] {
  const adt7410 = entries.find((e) => e.dashboardDeviceId === 'i2c-adt7410');
  if (!adt7410) {
    return [
      {
        dashboardDeviceId: 'i2c-adt7410',
        message: 'ADT7410 entry not found',
      },
    ];
  }

  const platforms = new Set(
    adt7410.examples.map((ex) => ex.platform).filter(Boolean)
  );
  const missing = ADT7410_PLATFORMS.filter((p) => !platforms.has(p));

  return missing.map((platform) => ({
    dashboardDeviceId: 'i2c-adt7410',
    platform,
    message: `missing platform ${platform}`,
  }));
}

export function assertValidPlatformExamples(
  entries: PlatformExampleDeviceEntry[],
  options: { requireAdt7410?: boolean } = {}
): void {
  const errors = [
    ...validatePlatformExamples(entries),
    ...(options.requireAdt7410 ? validateAdt7410Platforms(entries) : []),
  ];

  if (errors.length > 0) {
    const detail = errors
      .map((e) => {
        const platform = e.platform ? ` [${e.platform}]` : '';
        return `${e.dashboardDeviceId}${platform}: ${e.message}`;
      })
      .join('\n');
    throw new Error(`Platform example validation failed:\n${detail}`);
  }
}
