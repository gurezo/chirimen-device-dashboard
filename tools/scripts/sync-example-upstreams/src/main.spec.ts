import { describe, expect, it } from 'vitest';
import { buildPlatformExamplesJson } from './main';
import type { ExampleCandidateEntry } from './types';

describe('buildPlatformExamplesJson', () => {
  it('groups candidates by dashboard device id', () => {
    const candidates: ExampleCandidateEntry[] = [
      {
        sourceId: 'src-a',
        upstreamDirName: 'adt7410',
        exampleDeviceId: 'adt7410',
        dashboardDeviceId: 'i2c-adt7410',
        dashboardMappingStatus: 'resolved',
        example: {
          hardware: 'Pi Zero',
          code: 'https://example.com/a',
          platform: 'pizero-esm',
          deviceId: 'adt7410',
        },
        warnings: [],
      },
      {
        sourceId: 'src-b',
        upstreamDirName: 'adt7410',
        exampleDeviceId: 'adt7410',
        dashboardDeviceId: 'i2c-adt7410',
        dashboardMappingStatus: 'resolved',
        example: {
          hardware: 'Raspberry Pi',
          code: 'https://example.com/b',
          platform: 'node',
          deviceId: 'adt7410',
        },
        warnings: [],
      },
    ];

    const grouped = new Map([
      [
        'i2c-adt7410',
        {
          exampleDeviceId: 'adt7410',
          examples: candidates
            .flatMap((c) => (c.example ? [c.example] : []))
            .sort((a, b) =>
              (a.platform ?? '').localeCompare(b.platform ?? '')
            ),
          warnings: [],
        },
      ],
    ]);

    const result = buildPlatformExamplesJson(grouped);
    expect(result).toHaveLength(1);
    expect(result[0].dashboardDeviceId).toBe('i2c-adt7410');
    expect(result[0].examples).toHaveLength(2);
    expect(result[0].examples[0].platform).toBe('node');
    expect(result[0].examples[1].platform).toBe('pizero-esm');
  });
});

describe('renderSyncSummaryMarkdown', () => {
  it('includes overview counts', async () => {
    const { renderSyncSummaryMarkdown } = await import('./write-sync-summary');
    const markdown = renderSyncSummaryMarkdown({
      generatedAt: '2026-01-01T00:00:00.000Z',
      repoRoot: '/repo',
      fatalErrors: [],
      sources: [
        {
          sourceId: 'test',
          repo: 'chirimen-oh/chirimen.org',
          branch: 'master',
          path: 'examples',
          platform: 'pizero-esm',
          mirrorPath: '/repo/generated/upstreams/test',
          exampleCount: 2,
          errors: [],
          candidates: [
            {
              sourceId: 'test',
              upstreamDirName: 'adt7410',
              exampleDeviceId: 'adt7410',
              dashboardDeviceId: 'i2c-adt7410',
              dashboardMappingStatus: 'resolved',
              example: null,
              warnings: [],
            },
          ],
        },
      ],
    });
    expect(markdown).toContain('# Upstream sync summary');
    expect(markdown).toContain('Total candidates | 1');
  });
});
