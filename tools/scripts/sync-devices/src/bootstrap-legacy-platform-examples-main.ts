import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import type { DeviceInfo } from '@chirimen-device-dashboard/shared-types';
import {
  bootstrapLegacyPlatformExamples,
  buildReverseOverrideMap,
} from './bootstrap-legacy-platform-examples';
import type { PlatformExampleDeviceEntry } from './types';

const repoRoot = path.resolve(__dirname, '../../../..');

function readJson<T>(filePath: string): T {
  return JSON.parse(readFileSync(filePath, 'utf8')) as T;
}

function mergePlatformExamples(
  canonical: PlatformExampleDeviceEntry[],
  bootstrap: PlatformExampleDeviceEntry[]
): PlatformExampleDeviceEntry[] {
  const canonicalIds = new Set(canonical.map((entry) => entry.dashboardDeviceId));
  const merged = [...canonical];

  for (const entry of bootstrap) {
    if (canonicalIds.has(entry.dashboardDeviceId)) {
      console.warn(
        `Skipping bootstrap entry for ${entry.dashboardDeviceId}: already in platform-examples.json`
      );
      continue;
    }
    merged.push(entry);
  }

  return merged.sort((a, b) =>
    a.dashboardDeviceId.localeCompare(b.dashboardDeviceId)
  );
}

export async function main(): Promise<void> {
  const devicesPath = path.join(repoRoot, 'apps/web/public/devices.json');
  const platformExamplesPath = path.join(
    repoRoot,
    'data/platform-examples/platform-examples.json'
  );
  const generatedPath = path.join(
    repoRoot,
    'data/platform-examples/platform-examples.generated.json'
  );
  const overridesPath = path.join(
    repoRoot,
    'data/example-upstreams/device-id-overrides.yaml'
  );
  const outputFlag = process.argv.includes('--write');
  const outputPath =
    process.argv.find((arg) => arg.startsWith('--output='))?.split('=')[1] ??
    platformExamplesPath;

  const devices = readJson<DeviceInfo[]>(devicesPath);
  const canonical = readJson<PlatformExampleDeviceEntry[]>(platformExamplesPath);

  let enrichedEntries: PlatformExampleDeviceEntry[] = [];
  try {
    enrichedEntries = readJson<PlatformExampleDeviceEntry[]>(generatedPath);
  } catch {
    console.warn(`No generated platform examples found at ${generatedPath}`);
  }

  const overridesFile = parseYaml(readFileSync(overridesPath, 'utf8')) as {
    overrides: Record<string, string | string[]>;
  };
  const overrideExampleDeviceIds = buildReverseOverrideMap(
    overridesFile.overrides ?? {}
  );

  const bootstrap = bootstrapLegacyPlatformExamples(devices, {
    overrideExampleDeviceIds,
    enrichedEntries,
  });

  console.log(`Bootstrap entries: ${bootstrap.length}`);

  if (outputFlag) {
    const merged = mergePlatformExamples(canonical, bootstrap);
    writeFileSync(outputPath, `${JSON.stringify(merged, null, 2)}\n`, 'utf8');
    console.log(`Wrote ${merged.length} entries to ${outputPath}`);
    return;
  }

  process.stdout.write(`${JSON.stringify(bootstrap, null, 2)}\n`);
}

if (require.main === module) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
}
