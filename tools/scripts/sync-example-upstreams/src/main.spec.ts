import { describe, expect, it } from 'vitest';

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
