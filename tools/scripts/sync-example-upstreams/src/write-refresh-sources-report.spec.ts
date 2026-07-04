import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import type { SyncSummary } from './types';
import {
  buildRefreshSourceReport,
  writeRefreshSourcesReport,
} from './write-refresh-sources-report';

function createSummary(overrides: Partial<SyncSummary> = {}): SyncSummary {
  return {
    generatedAt: '2026-07-04T00:00:00.000Z',
    repoRoot: '/repo',
    fatalErrors: [],
    sources: [
      {
        sourceId: 'chirimen-org-pizero-esm',
        repo: 'chirimen-oh/chirimen.org',
        branch: 'master',
        path: 'pizero/src/esm-examples',
        platform: 'pizero-esm',
        mirrorPath: '/repo/generated/upstreams/chirimen-org-pizero-esm',
        commitSha: 'partslist-and-example-sha',
        exampleCount: 1,
        errors: [],
        candidates: [],
      },
      {
        sourceId: 'chirimen-drivers-microbit',
        repo: 'chirimen-oh/chirimen-drivers',
        branch: 'master',
        path: 'microbit-examples',
        platform: 'microbit-driver',
        mirrorPath: '/repo/generated/upstreams/chirimen-drivers-microbit',
        commitSha: 'driver-sha',
        exampleCount: 1,
        errors: [],
        candidates: [],
      },
    ],
    ...overrides,
  };
}

describe('buildRefreshSourceReport', () => {
  it('records partslist and upstream example source commits', () => {
    const report = buildRefreshSourceReport(createSummary());

    expect(report.partslist).toEqual({
      repository: 'chirimen-oh/chirimen.org',
      branch: 'master',
      path: '_data/partslist.csv',
      commit: 'partslist-and-example-sha',
    });
    expect(report.examples).toEqual([
      {
        sourceId: 'chirimen-org-pizero-esm',
        repository: 'chirimen-oh/chirimen.org',
        branch: 'master',
        path: 'pizero/src/esm-examples',
        platform: 'pizero-esm',
        commit: 'partslist-and-example-sha',
      },
      {
        sourceId: 'chirimen-drivers-microbit',
        repository: 'chirimen-oh/chirimen-drivers',
        branch: 'master',
        path: 'microbit-examples',
        platform: 'microbit-driver',
        commit: 'driver-sha',
      },
    ]);
  });
});

describe('writeRefreshSourcesReport', () => {
  let tempDir: string | undefined;

  afterEach(async () => {
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true });
      tempDir = undefined;
    }
  });

  it('keeps the existing file when only generatedAt differs', async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), 'refresh-sources-'));
    const first = await writeRefreshSourcesReport(tempDir, createSummary());

    expect(first.changed).toBe(true);

    const second = await writeRefreshSourcesReport(
      tempDir,
      createSummary({ generatedAt: '2026-07-05T00:00:00.000Z' }),
    );
    const content = JSON.parse(await readFile(second.filePath, 'utf8'));

    expect(second.changed).toBe(false);
    expect(content.generatedAt).toBe('2026-07-04T00:00:00.000Z');
  });
});
