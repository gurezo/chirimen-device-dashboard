import path from 'node:path';
import { loadExampleCandidates } from './load-example-candidates';
import {
  loadDashboardDeviceIds,
  loadDeviceIdOverrides,
} from './load-device-map';
import { loadUpstreamSources } from './load-upstream-sources';
import {
  generatePlatformExamples,
  listNewGeneratedPlatforms,
  loadCanonicalPlatformExamples,
  selectCanonicalGeneratedEntries,
} from './generate-platform-examples';
import { assertValidPlatformExamples } from '../../validate-platform-examples/src/validate-platform-examples';
import { writeJsonIfChanged } from './write-json-if-changed';
import type { ExampleCandidateEntry } from './types';

const OUTPUT_RELATIVE_PATH =
  'data/platform-examples/platform-examples.generated.json';

function getRepoRoot(): string {
  return process.cwd();
}

export async function main(): Promise<void> {
  const repoRoot = getRepoRoot();

  console.log('Loading upstream sources...');
  const sources = await loadUpstreamSources(repoRoot);

  console.log('Loading dashboard device ids...');
  const dashboardDeviceIds = await loadDashboardDeviceIds(repoRoot);
  const overrides = await loadDeviceIdOverrides(repoRoot);

  console.log('Loading canonical platform examples...');
  const canonical = await loadCanonicalPlatformExamples(repoRoot);

  const allCandidates: ExampleCandidateEntry[] = [];

  for (const source of sources) {
    console.log(`Loading candidates from ${source.id}...`);
    const candidates = await loadExampleCandidates({
      repoRoot,
      source,
      dashboardDeviceIds,
      overrides,
    });
    allCandidates.push(...candidates);
    console.log(`  ${candidates.length} candidate(s)`);
  }

  const entries = generatePlatformExamples(allCandidates, canonical);

  const newPlatforms = listNewGeneratedPlatforms(entries, canonical);
  for (const { dashboardDeviceId, platform } of newPlatforms) {
    console.warn(
      `Warning: skipping hard validation for new platform candidate ${dashboardDeviceId} [${platform}] (not in canonical platform-examples.json)`
    );
  }

  const canonicalEntries = selectCanonicalGeneratedEntries(entries, canonical);
  if (canonicalEntries.length > 0) {
    assertValidPlatformExamples(canonicalEntries, new Set(dashboardDeviceIds));
  }

  const outPath = path.join(repoRoot, OUTPUT_RELATIVE_PATH);
  const changed = await writeJsonIfChanged(outPath, entries);

  console.log(`Devices: ${entries.length}`);
  console.log(`Candidates: ${allCandidates.length}`);
  if (changed) {
    console.log(`Wrote ${OUTPUT_RELATIVE_PATH}`);
  } else {
    console.log(`Unchanged ${OUTPUT_RELATIVE_PATH}`);
  }
}

if (!process.env.VITEST) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
