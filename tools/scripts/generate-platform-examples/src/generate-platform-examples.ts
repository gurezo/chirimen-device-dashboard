import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { ExampleInfo } from '@chirimen-device-dashboard/shared-types';
import { groupCandidatesByDashboardDevice } from '../../sync-example-upstreams/src/build-platform-example-candidates';
import type {
  ExampleCandidateEntry,
  PlatformExampleDeviceEntry,
} from './types';

function sortExamples(examples: ExampleInfo[]): ExampleInfo[] {
  return [...examples].sort((a, b) =>
    (a.platform ?? '').localeCompare(b.platform ?? '')
  );
}

export function buildPlatformExamplesJson(
  grouped: Map<
    string,
    { exampleDeviceId: string; examples: ExampleInfo[]; warnings: string[] }
  >
): PlatformExampleDeviceEntry[] {
  return [...grouped.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dashboardDeviceId, entry]) => ({
      dashboardDeviceId,
      exampleDeviceId: entry.exampleDeviceId,
      examples: sortExamples(entry.examples),
    }));
}

function exampleKey(platform: string): string {
  return platform;
}

function mergeLegacyFieldsFromCanonical(
  generated: PlatformExampleDeviceEntry[],
  canonical: PlatformExampleDeviceEntry[]
): PlatformExampleDeviceEntry[] {
  const canonicalByDevice = new Map(
    canonical.map((entry) => [entry.dashboardDeviceId, entry])
  );

  return generated.map((deviceEntry) => {
    const canonicalDevice = canonicalByDevice.get(deviceEntry.dashboardDeviceId);
    if (!canonicalDevice) {
      return deviceEntry;
    }

    const canonicalByPlatform = new Map(
      canonicalDevice.examples.map((ex) => [
        exampleKey(ex.platform ?? ''),
        ex,
      ])
    );

    const mergedExamples = deviceEntry.examples.map((generatedEx) => {
      const canonicalEx = canonicalByPlatform.get(
        exampleKey(generatedEx.platform ?? '')
      );
      if (!canonicalEx) {
        return generatedEx;
      }

      return {
        ...generatedEx,
        hardware: canonicalEx.hardware || generatedEx.hardware,
        code: canonicalEx.code || generatedEx.code,
        circuitUrl: generatedEx.circuitUrl || canonicalEx.circuitUrl,
      };
    });

    return {
      ...deviceEntry,
      examples: sortExamples(mergedExamples),
    };
  });
}

export function warnDuplicatePlatforms(
  candidates: ExampleCandidateEntry[]
): string[] {
  const warnings: string[] = [];
  const seen = new Map<string, string>();

  for (const candidate of candidates) {
    if (!candidate.example?.platform || !candidate.dashboardDeviceId) {
      continue;
    }

    const key = `${candidate.dashboardDeviceId}:${candidate.example.platform}`;
    const previous = seen.get(key);
    if (previous) {
      warnings.push(
        `Duplicate platform "${candidate.example.platform}" for ${candidate.dashboardDeviceId} (sources: ${previous}, ${candidate.sourceId})`
      );
    } else {
      seen.set(key, candidate.sourceId);
    }
  }

  return warnings;
}

export async function loadCanonicalPlatformExamples(
  repoRoot: string
): Promise<PlatformExampleDeviceEntry[]> {
  const filePath = path.join(
    repoRoot,
    'data/platform-examples/platform-examples.json'
  );

  try {
    const raw = await readFile(filePath, 'utf8');
    return JSON.parse(raw) as PlatformExampleDeviceEntry[];
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      'code' in err &&
      (err as NodeJS.ErrnoException).code === 'ENOENT'
    ) {
      return [];
    }
    throw err;
  }
}

/**
 * Pick generated examples that already exist in the canonical dataset.
 *
 * Only device+platform pairs present in `platform-examples.json` are returned.
 * Newly discovered platforms (review candidates) are omitted so generate can
 * write incomplete entries to `platform-examples.generated.json` without
 * failing hard validation.
 */
export function selectCanonicalGeneratedEntries(
  entries: PlatformExampleDeviceEntry[],
  canonical: PlatformExampleDeviceEntry[]
): PlatformExampleDeviceEntry[] {
  const canonicalByDevice = new Map(
    canonical.map((entry) => [entry.dashboardDeviceId, entry])
  );

  if (canonicalByDevice.size === 0) {
    return [];
  }

  const selected: PlatformExampleDeviceEntry[] = [];

  for (const entry of entries) {
    const canonicalEntry = canonicalByDevice.get(entry.dashboardDeviceId);
    if (!canonicalEntry) {
      continue;
    }

    const canonicalPlatforms = new Set(
      canonicalEntry.examples
        .map((example) => example.platform)
        .filter((platform): platform is string => Boolean(platform))
    );

    const knownExamples = entry.examples.filter((example) => {
      const platform = example.platform;
      return typeof platform === 'string' && canonicalPlatforms.has(platform);
    });

    if (knownExamples.length === 0) {
      continue;
    }

    selected.push({
      ...entry,
      examples: knownExamples,
    });
  }

  return selected;
}

/** List generated device+platform pairs that are not in the canonical dataset. */
export function listNewGeneratedPlatforms(
  entries: PlatformExampleDeviceEntry[],
  canonical: PlatformExampleDeviceEntry[]
): Array<{ dashboardDeviceId: string; platform: string }> {
  const canonicalPlatformsByDevice = new Map(
    canonical.map((entry) => [
      entry.dashboardDeviceId,
      new Set(
        entry.examples
          .map((example) => example.platform)
          .filter((platform): platform is string => Boolean(platform))
      ),
    ])
  );

  const results: Array<{ dashboardDeviceId: string; platform: string }> = [];

  for (const entry of entries) {
    const canonicalPlatforms = canonicalPlatformsByDevice.get(
      entry.dashboardDeviceId
    );

    for (const example of entry.examples) {
      if (!example.platform) {
        continue;
      }

      if (!canonicalPlatforms?.has(example.platform)) {
        results.push({
          dashboardDeviceId: entry.dashboardDeviceId,
          platform: example.platform,
        });
      }
    }
  }

  return results;
}

export function generatePlatformExamples(
  candidates: ExampleCandidateEntry[],
  canonical: PlatformExampleDeviceEntry[]
): PlatformExampleDeviceEntry[] {
  const duplicateWarnings = warnDuplicatePlatforms(candidates);
  for (const warning of duplicateWarnings) {
    console.warn(`Warning: ${warning}`);
  }

  const grouped = groupCandidatesByDashboardDevice(candidates);
  const generated = buildPlatformExamplesJson(grouped);
  return mergeLegacyFieldsFromCanonical(generated, canonical);
}
