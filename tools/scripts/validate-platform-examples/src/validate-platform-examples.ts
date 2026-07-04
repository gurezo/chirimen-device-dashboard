import {
  isPlatformSpecificExample,
  type ExampleInfo,
  type ExampleStatus,
} from '@chirimen-device-dashboard/shared-types';
import type { PlatformExampleDeviceEntry, ValidationIssue } from './types';

export type ValidationError = {
  dashboardDeviceId: string;
  platform?: string;
  field?: string;
  message: string;
};

const VALID_STATUSES: ExampleStatus[] = [
  'primary',
  'legacy',
  'archive',
  'special',
  'incubator',
];

const ADT7410_PLATFORMS = [
  'pizero-esm',
  'microbit-driver',
  'legacy-gc-i2c',
] as const;

const PLATFORM_EXAMPLE_REQUIRED_FIELDS = [
  'hardware',
  'code',
  'platform',
  'upstreamRepository',
  'upstreamRepositoryUrl',
  'upstreamPath',
  'upstreamPathUrl',
  'status',
  'circuitUrl',
] as const;

function requireNonEmptyString(
  value: string | undefined,
  field: string
): string | undefined {
  if (!value?.trim()) {
    return field;
  }

  return undefined;
}

function validateExampleFields(
  dashboardDeviceId: string,
  example: ExampleInfo,
  source: ValidationIssue['source']
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const platform = example.platform ?? '(unknown)';

  for (const field of PLATFORM_EXAMPLE_REQUIRED_FIELDS) {
    const missingField = requireNonEmptyString(example[field], field);
    if (missingField) {
      issues.push({
        source,
        dashboardDeviceId,
        platform,
        field: missingField,
        message: `${missingField} is required`,
      });
    }
  }

  if (
    example.status &&
    !VALID_STATUSES.includes(example.status as ExampleStatus)
  ) {
    issues.push({
      source,
      dashboardDeviceId,
      platform,
      field: 'status',
      message: `status must be one of ${VALID_STATUSES.join(', ')}`,
    });
  }

  if (!isPlatformSpecificExample(example)) {
    issues.push({
      source,
      dashboardDeviceId,
      platform,
      message: 'missing platform-specific fields',
    });
  }

  return issues;
}

export function validatePlatformExampleEntry(
  entry: PlatformExampleDeviceEntry,
  knownDeviceIds: Set<string>
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const source = 'platform-examples.json' as const;

  if (!entry.dashboardDeviceId?.trim()) {
    issues.push({
      source,
      dashboardDeviceId: '(unknown)',
      field: 'dashboardDeviceId',
      message: 'dashboardDeviceId is required',
    });
  } else if (!knownDeviceIds.has(entry.dashboardDeviceId)) {
    issues.push({
      source,
      dashboardDeviceId: entry.dashboardDeviceId,
      field: 'dashboardDeviceId',
      message: 'dashboardDeviceId does not exist in devices.json',
    });
  }

  if (!entry.exampleDeviceId?.trim()) {
    issues.push({
      source,
      dashboardDeviceId: entry.dashboardDeviceId ?? '(unknown)',
      field: 'exampleDeviceId',
      message: 'exampleDeviceId is required',
    });
  }

  for (const example of entry.examples) {
    issues.push(
      ...validateExampleFields(entry.dashboardDeviceId, example, source)
    );
  }

  return issues;
}

export function validatePlatformExamples(
  entries: PlatformExampleDeviceEntry[],
  knownDeviceIds: Set<string>
): ValidationIssue[] {
  return entries.flatMap((entry) =>
    validatePlatformExampleEntry(entry, knownDeviceIds)
  );
}

export function validateAdt7410Platforms(
  entries: PlatformExampleDeviceEntry[]
): ValidationIssue[] {
  const adt7410 = entries.find((e) => e.dashboardDeviceId === 'i2c-adt7410');
  if (!adt7410) {
    return [
      {
        source: 'platform-examples.json',
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
    source: 'platform-examples.json',
    dashboardDeviceId: 'i2c-adt7410',
    platform,
    message: `missing platform ${platform}`,
  }));
}

export function assertValidPlatformExamples(
  entries: PlatformExampleDeviceEntry[],
  knownDeviceIds: Set<string>,
  options: { requireAdt7410?: boolean } = {}
): void {
  const issues = [
    ...validatePlatformExamples(entries, knownDeviceIds),
    ...(options.requireAdt7410 ? validateAdt7410Platforms(entries) : []),
  ];

  if (issues.length > 0) {
    const detail = issues
      .map((issue) => {
        const platform = issue.platform ? ` [${issue.platform}]` : '';
        const field = issue.field ? ` (${issue.field})` : '';
        return `${issue.dashboardDeviceId}${platform}${field}: ${issue.message}`;
      })
      .join('\n');
    throw new Error(`Platform example validation failed:\n${detail}`);
  }
}

export function toValidationErrors(issues: ValidationIssue[]): ValidationError[] {
  return issues.map(({ dashboardDeviceId, platform, field, message }) => ({
    dashboardDeviceId,
    platform,
    field,
    message,
  }));
}
