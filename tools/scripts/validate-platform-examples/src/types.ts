export type {
  PlatformExampleDeviceEntry,
} from '../../sync-example-upstreams/src/types';

export type ValidationSource =
  | 'platform-examples.json'
  | 'devices.json';

export type ValidationIssue = {
  source: ValidationSource;
  dashboardDeviceId: string;
  platform?: string;
  field?: string;
  message: string;
};

export type ValidationResult = {
  issues: ValidationIssue[];
  warnings: ValidationIssue[];
};

export type ValidationReportContext = {
  generatedAt: string;
  repoRoot: string;
  platformExamplesPath: string;
  devicesJsonPath: string;
  result: ValidationResult;
};
