import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { SyncSummary } from './types';

function renderSourceSection(summary: SyncSummary): string {
  const lines: string[] = [];

  for (const source of summary.sources) {
    lines.push(`### ${source.sourceId}`);
    lines.push('');
    lines.push('| 項目 | 内容 |');
    lines.push('| --- | --- |');
    lines.push(`| Repository | \`${source.repo}\` |`);
    lines.push(`| Branch | \`${source.branch}\` |`);
    lines.push(`| Path | \`${source.path}\` |`);
    lines.push(`| Platform | \`${source.platform}\` |`);
    lines.push(
      `| Mirror | \`${path.relative(summary.repoRoot, source.mirrorPath)}\` |`
    );
    if (source.commitSha) {
      lines.push(`| Commit | \`${source.commitSha}\` |`);
    }
    lines.push(`| Examples detected | ${source.exampleCount} |`);
    lines.push(
      `| Candidates with dashboard mapping | ${source.candidates.filter((c) => c.dashboardDeviceId).length} |`
    );
    lines.push('');

    if (source.errors.length > 0) {
      lines.push('**Errors**');
      lines.push('');
      for (const err of source.errors) {
        lines.push(`- ${err}`);
      }
      lines.push('');
    }

    const withWarnings = source.candidates.filter((c) => c.warnings.length > 0);
    if (withWarnings.length > 0) {
      lines.push('**Warnings**');
      lines.push('');
      for (const candidate of withWarnings.slice(0, 20)) {
        for (const warning of candidate.warnings) {
          lines.push(
            `- \`${candidate.upstreamDirName}\` (${candidate.sourceId}): ${warning}`
          );
        }
      }
      if (withWarnings.length > 20) {
        lines.push(`- ... and ${withWarnings.length - 20} more`);
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}

export function renderSyncSummaryMarkdown(summary: SyncSummary): string {
  const totalCandidates = summary.sources.reduce(
    (sum, s) => sum + s.candidates.length,
    0
  );
  const mappedCandidates = summary.sources.reduce(
    (sum, s) => sum + s.candidates.filter((c) => c.dashboardDeviceId).length,
    0
  );

  const lines: string[] = [
    '# Upstream sync summary',
    '',
    `Generated at: ${summary.generatedAt}`,
    '',
    '## Overview',
    '',
    '| 項目 | 値 |',
    '| --- | --- |',
    `| Sources | ${summary.sources.length} |`,
    `| Total candidates | ${totalCandidates} |`,
    `| Mapped to dashboard device | ${mappedCandidates} |`,
    '',
  ];

  if (summary.fatalErrors.length > 0) {
    lines.push('## Fatal errors');
    lines.push('');
    for (const err of summary.fatalErrors) {
      lines.push(`- ${err}`);
    }
    lines.push('');
  }

  lines.push('## Sources');
  lines.push('');
  lines.push(renderSourceSection(summary));

  return `${lines.join('\n').trimEnd()}\n`;
}

export async function writeSyncSummary(
  repoRoot: string,
  summary: SyncSummary
): Promise<string> {
  const outPath = path.join(
    repoRoot,
    'generated/reports/example-sync-summary.md'
  );
  await mkdir(path.dirname(outPath), { recursive: true });
  const content = renderSyncSummaryMarkdown(summary);
  await writeFile(outPath, content, 'utf8');
  return outPath;
}
