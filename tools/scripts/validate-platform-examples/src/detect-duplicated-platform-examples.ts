import { isPlatformSpecificExample, type ExampleInfo } from '@chirimen-device-dashboard/shared-types';
import type { PlatformExampleDeviceEntry, ValidationIssue } from './types';

type ExampleWithPlatform = {
  dashboardDeviceId: string;
  platform: string;
  example: ExampleInfo;
};

function collectPlatformExamples(
  dashboardDeviceId: string,
  examples: ExampleInfo[]
): ExampleWithPlatform[] {
  const platformExamples: ExampleWithPlatform[] = [];

  for (const example of examples) {
    if (!isPlatformSpecificExample(example)) {
      continue;
    }

    platformExamples.push({
      dashboardDeviceId,
      platform: example.platform,
      example,
    });
  }

  return platformExamples;
}

export function detectDuplicatedPlatformExamples(
  entries: PlatformExampleDeviceEntry[]
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const entry of entries) {
    const seen = new Map<string, number>();

    for (const example of entry.examples) {
      if (!example.platform?.trim()) {
        continue;
      }

      seen.set(example.platform, (seen.get(example.platform) ?? 0) + 1);
    }

    for (const [platform, count] of seen.entries()) {
      if (count > 1) {
        issues.push({
          source: 'platform-examples.json',
          dashboardDeviceId: entry.dashboardDeviceId,
          platform,
          message: `duplicate platform ${platform} (${count} entries)`,
        });
      }
    }
  }

  return issues;
}

export function detectDuplicatedDeviceProductExamples(
  devices: Array<{ id: string; product: { example: ExampleInfo[] } }>
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const device of devices) {
    const platformExamples = collectPlatformExamples(
      device.id,
      device.product.example
    );
    const seen = new Map<string, number>();

    for (const item of platformExamples) {
      seen.set(item.platform, (seen.get(item.platform) ?? 0) + 1);
    }

    for (const [platform, count] of seen.entries()) {
      if (count > 1) {
        issues.push({
          source: 'devices.json',
          dashboardDeviceId: device.id,
          platform,
          message: `duplicate platform ${platform} (${count} entries)`,
        });
      }
    }
  }

  return issues;
}
