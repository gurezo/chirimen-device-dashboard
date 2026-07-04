import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { RefreshSourceReport, SyncSummary } from './types';

const PARTSLIST_SOURCE = {
  repository: 'chirimen-oh/chirimen.org',
  branch: 'master',
  path: '_data/partslist.csv',
} as const;

function findPartslistCommit(summary: SyncSummary): string | null {
  return (
    summary.sources.find(
      (source) =>
        source.repo === PARTSLIST_SOURCE.repository &&
        source.branch === PARTSLIST_SOURCE.branch,
    )?.commitSha ?? null
  );
}

export function buildRefreshSourceReport(
  summary: SyncSummary,
  generatedAt = new Date().toISOString(),
): RefreshSourceReport {
  return {
    generatedAt,
    partslist: {
      ...PARTSLIST_SOURCE,
      commit: findPartslistCommit(summary),
    },
    examples: summary.sources.map((source) => ({
      sourceId: source.sourceId,
      repository: source.repo,
      branch: source.branch,
      path: source.path,
      platform: source.platform,
      commit: source.commitSha ?? null,
    })),
  };
}

function sourceState(
  report: RefreshSourceReport,
): Omit<RefreshSourceReport, 'generatedAt'> {
  return {
    partslist: report.partslist,
    examples: report.examples,
  };
}

function hasSameSourceState(
  current: RefreshSourceReport,
  next: RefreshSourceReport,
): boolean {
  return (
    JSON.stringify(sourceState(current)) === JSON.stringify(sourceState(next))
  );
}

export async function writeRefreshSourcesReport(
  repoRoot: string,
  summary: SyncSummary,
): Promise<{ filePath: string; changed: boolean }> {
  const filePath = path.join(
    repoRoot,
    'generated/reports/refresh-sources.json',
  );
  const nextReport = buildRefreshSourceReport(summary, summary.generatedAt);

  try {
    const existing = JSON.parse(
      await readFile(filePath, 'utf8'),
    ) as RefreshSourceReport;

    if (hasSameSourceState(existing, nextReport)) {
      return { filePath, changed: false };
    }
  } catch (err: unknown) {
    if (
      !(err instanceof Error) ||
      !('code' in err) ||
      (err as NodeJS.ErrnoException).code !== 'ENOENT'
    ) {
      throw err;
    }
  }

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(nextReport, null, 2)}\n`, 'utf8');
  return { filePath, changed: true };
}
