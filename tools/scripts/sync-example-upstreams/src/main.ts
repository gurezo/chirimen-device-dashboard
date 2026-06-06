import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { ExampleInfo } from '@chirimen-device-dashboard/shared-types';
import { cloneOrFetchSource } from './clone-or-fetch-source';
import {
  buildExampleCandidate,
  groupCandidatesByDashboardDevice,
} from './build-platform-example-candidates';
import { listExampleDirNames } from './list-example-dir-names';
import { loadSources } from './load-sources';
import {
  loadDashboardDeviceIds,
  loadDeviceIdOverrides,
  resolveDashboardDeviceId,
} from './resolve-dashboard-device-id';
import { resolveExampleDeviceId } from './resolve-example-device-id';
import type {
  PlatformExampleDeviceEntry,
  SourceSyncResult,
  SyncSummary,
  UpstreamSource,
} from './types';
import { writeExampleCandidatesReport } from './write-example-candidates-report';
import { writeSyncSummary } from './write-sync-summary';

function getRepoRoot(): string {
  return process.cwd();
}

async function syncSource(
  repoRoot: string,
  source: UpstreamSource,
  dashboardDeviceIds: string[],
  overrides: Record<string, string>
): Promise<SourceSyncResult> {
  const result: SourceSyncResult = {
    sourceId: source.id,
    repo: source.repo,
    branch: source.branch,
    path: source.path,
    platform: source.platform,
    mirrorPath: path.join(repoRoot, 'generated/upstreams', source.id),
    exampleCount: 0,
    errors: [],
    candidates: [],
  };

  try {
    const { mirrorPath: mirror, commitSha } = await cloneOrFetchSource(
      repoRoot,
      source
    );
    result.mirrorPath = mirror;
    result.commitSha = commitSha;

    const dirNames = await listExampleDirNames(mirror);
    result.exampleCount = dirNames.length;

    for (const upstreamDirName of dirNames) {
      const parsedExampleDeviceId = resolveExampleDeviceId(upstreamDirName);

      const dashboardMapping = parsedExampleDeviceId
        ? resolveDashboardDeviceId(
            parsedExampleDeviceId,
            dashboardDeviceIds,
            overrides
          )
        : {
            dashboardDeviceId: null,
            status: 'unresolved' as const,
          };

      const candidate = await buildExampleCandidate({
        source,
        upstreamDirName,
        mirrorPath: mirror,
        dashboardMapping,
      });

      result.candidates.push(candidate);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    result.errors.push(message);
  }

  return result;
}

function buildPlatformExamplesJson(
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
      examples: entry.examples.sort((a, b) =>
        (a.platform ?? '').localeCompare(b.platform ?? '')
      ),
    }));
}

async function writeGeneratedPlatformExamples(
  repoRoot: string,
  entries: PlatformExampleDeviceEntry[]
): Promise<string> {
  const outPath = path.join(
    repoRoot,
    'data/platform-examples/platform-examples.generated.json'
  );
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, JSON.stringify(entries, null, 2) + '\n', 'utf8');
  return outPath;
}

async function main(): Promise<void> {
  const repoRoot = getRepoRoot();
  console.log('Loading upstream sources...');
  const sources = await loadSources(repoRoot);

  console.log('Loading dashboard device ids...');
  const dashboardDeviceIds = await loadDashboardDeviceIds(repoRoot);
  const overrides = await loadDeviceIdOverrides(repoRoot);

  const sourceResults: SourceSyncResult[] = [];
  const fatalErrors: string[] = [];

  for (const source of sources) {
    console.log(`Syncing ${source.id} (${source.repo})...`);
    const result = await syncSource(
      repoRoot,
      source,
      dashboardDeviceIds,
      overrides
    );
    sourceResults.push(result);
    if (result.errors.length > 0) {
      fatalErrors.push(`${source.id}: ${result.errors.join('; ')}`);
    }
  }

  const allCandidates = sourceResults.flatMap((s) => s.candidates);
  const grouped = groupCandidatesByDashboardDevice(allCandidates);
  const platformEntries = buildPlatformExamplesJson(grouped);

  const summary: SyncSummary = {
    generatedAt: new Date().toISOString(),
    repoRoot,
    sources: sourceResults,
    fatalErrors,
  };

  const summaryPath = await writeSyncSummary(repoRoot, summary);
  const candidatesReportPath = await writeExampleCandidatesReport(
    repoRoot,
    summary
  );
  const generatedJsonPath = await writeGeneratedPlatformExamples(
    repoRoot,
    platformEntries
  );

  console.log(`Sync complete.`);
  console.log(`  Summary: ${path.relative(repoRoot, summaryPath)}`);
  console.log(
    `  Candidates report: ${path.relative(repoRoot, candidatesReportPath)}`
  );
  console.log(
    `  Generated JSON: ${path.relative(repoRoot, generatedJsonPath)} (${platformEntries.length} devices)`
  );

  for (const source of sourceResults) {
    const relMirror = path.relative(repoRoot, source.mirrorPath);
    const status = source.errors.length > 0 ? 'ERROR' : 'OK';
    console.log(
      `  [${status}] ${source.sourceId}: ${source.exampleCount} example(s) → ${relMirror}`
    );
  }

  if (fatalErrors.length > 0) {
    console.error('\nFatal errors:');
    for (const err of fatalErrors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }
}

if (!process.env.VITEST) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

export { main, syncSource, buildPlatformExamplesJson };
