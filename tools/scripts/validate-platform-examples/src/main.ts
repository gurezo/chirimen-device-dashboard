import path from 'node:path';
import {
  getDefaultDevicesJsonPath,
  loadDeviceIds,
  loadDevices,
} from './load-devices';
import {
  getDefaultPlatformExamplesPath,
  loadPlatformExamples,
} from './load-platform-examples';
import { writeValidationReports } from './render-report';
import {
  detectDuplicatedDeviceProductExamples,
  detectDuplicatedPlatformExamples,
} from './detect-duplicated-platform-examples';
import type { ValidationReportContext, ValidationResult } from './types';
import {
  comparePlatformExamplesWithSource,
  validateDeviceProductExamples,
} from './validate-device-product-examples';
import { validatePlatformExamples } from './validate-platform-examples';

function getRepoRoot(): string {
  return process.cwd();
}

export function runValidation(
  repoRoot: string,
  platformExamplesPath: string,
  devicesJsonPath: string
): ValidationResult {
  const platformEntries = loadPlatformExamples(platformExamplesPath);
  const devices = loadDevices(devicesJsonPath);
  const knownDeviceIds = loadDeviceIds(devicesJsonPath);

  const issues = [
    ...validatePlatformExamples(platformEntries, knownDeviceIds),
    ...validateDeviceProductExamples(devices),
    ...detectDuplicatedPlatformExamples(platformEntries),
    ...detectDuplicatedDeviceProductExamples(devices),
  ];

  const warnings = comparePlatformExamplesWithSource(devices, platformEntries);

  return { issues, warnings };
}

export async function main(): Promise<number> {
  const repoRoot = getRepoRoot();
  const platformExamplesPath = getDefaultPlatformExamplesPath(repoRoot);
  const devicesJsonPath = getDefaultDevicesJsonPath(repoRoot);
  const result = runValidation(repoRoot, platformExamplesPath, devicesJsonPath);

  const context: ValidationReportContext = {
    generatedAt: new Date().toISOString(),
    repoRoot,
    platformExamplesPath: path.relative(repoRoot, platformExamplesPath),
    devicesJsonPath: path.relative(repoRoot, devicesJsonPath),
    result,
  };

  const reportPaths = await writeValidationReports(context);

  console.log('Platform example validation complete.');
  console.log(`Issues: ${result.issues.length}`);
  console.log(`Warnings: ${result.warnings.length}`);
  for (const reportPath of reportPaths) {
    console.log(`Report: ${path.relative(repoRoot, reportPath)}`);
  }

  return result.issues.length > 0 ? 1 : 0;
}

if (!process.env.VITEST) {
  main()
    .then((exitCode) => {
      process.exit(exitCode);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
