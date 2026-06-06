import path from 'node:path';
import { cloneOrFetchSource } from './clone-or-fetch-source';
import { buildExampleCandidatesForMapping } from './build-platform-example-candidates';
import { listExampleDirNames } from './list-example-dir-names';
import { loadSources } from './load-sources';
import {
  loadDashboardDeviceIds,
  loadDeviceIdOverrides,
  resolveDashboardDeviceId,
} from './resolve-dashboard-device-id';
import { resolveExampleDeviceId } from './resolve-example-device-id';
import type { SourceSyncResult, SyncSummary, UpstreamSource } from './types';
import { writeExampleCandidatesReport } from './write-example-candidates-report';
import { writeSyncSummary } from './write-sync-summary';

function getRepoRoot(): string {
  return process.cwd();
}

async function syncSource(
  repoRoot: string,
  source: UpstreamSource,
  dashboardDeviceIds: string[],
  overrides: Record<string, DeviceIdOverrideValue>
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
            dashboardDeviceIds: [],
            status: 'unresolved' as const,
          };

      const candidates = await buildExampleCandidatesForMapping({
        source,
        upstreamDirName,
        mirrorPath: mirror,
        dashboardMapping,
      });

      result.candidates.push(...candidates);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    result.errors.push(message);
  }

  return result;
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

  console.log(`Sync complete.`);
  console.log(`  Summary: ${path.relative(repoRoot, summaryPath)}`);
  console.log(
    `  Candidates report: ${path.relative(repoRoot, candidatesReportPath)}`
  );
  console.log(`  Next: pnpm generate:platform-examples`);

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

export { main, syncSource };
