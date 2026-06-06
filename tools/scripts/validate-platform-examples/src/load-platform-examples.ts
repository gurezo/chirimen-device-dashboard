import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { PlatformExampleDeviceEntry } from './types';

export function getDefaultPlatformExamplesPath(repoRoot: string): string {
  return path.join(repoRoot, 'data/platform-examples/platform-examples.json');
}

export function loadPlatformExamples(
  filePath: string
): PlatformExampleDeviceEntry[] {
  const raw = readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(raw) as unknown;

  if (!Array.isArray(parsed)) {
    throw new Error(`Expected array in ${filePath}`);
  }

  return parsed as PlatformExampleDeviceEntry[];
}
