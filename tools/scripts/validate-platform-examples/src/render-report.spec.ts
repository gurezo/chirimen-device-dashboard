import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { renderValidationSummaryMarkdown, writeValidationReports } from './render-report';
import type { ValidationReportContext } from './types';

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

describe('renderValidationSummaryMarkdown', () => {
  it('marks validation as pass when there are no issues', () => {
    const markdown = renderValidationSummaryMarkdown({
      generatedAt: '2026-06-06T00:00:00.000Z',
      repoRoot: '/tmp/repo',
      platformExamplesPath: 'data/platform-examples/platform-examples.json',
      devicesJsonPath: 'apps/web/public/devices.json',
      result: { issues: [], warnings: [] },
    });

    expect(markdown).toContain('Status: **PASS**');
  });
});

describe('writeValidationReports', () => {
  it('writes all validation report files', async () => {
    const repoRoot = await mkdtemp(path.join(os.tmpdir(), 'validate-platform-examples-'));
    tempDirs.push(repoRoot);

    const context: ValidationReportContext = {
      generatedAt: '2026-06-06T00:00:00.000Z',
      repoRoot,
      platformExamplesPath: 'data/platform-examples/platform-examples.json',
      devicesJsonPath: 'apps/web/public/devices.json',
      result: {
        issues: [
          {
            source: 'platform-examples.json',
            dashboardDeviceId: 'i2c-adt7410',
            platform: 'pizero-esm',
            field: 'circuitUrl',
            message: 'circuitUrl is required',
          },
        ],
        warnings: [],
      },
    };

    const reportPaths = await writeValidationReports(context);
    expect(reportPaths).toHaveLength(4);

    const summary = await readFile(
      path.join(repoRoot, 'generated/reports/platform-example-validation-summary.md'),
      'utf8'
    );
    expect(summary).toContain('Status: **FAIL**');
  });
});
