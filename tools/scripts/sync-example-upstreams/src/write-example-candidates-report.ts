import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { ExampleCandidateEntry, SyncSummary } from './types';

function renderUnmappedSection(candidates: ExampleCandidateEntry[]): string {
  const unmapped = candidates.filter(
    (c) =>
      c.example &&
      (!c.dashboardDeviceId ||
        c.dashboardMappingStatus === 'ambiguous' ||
        c.dashboardMappingStatus === 'unresolved')
  );

  if (unmapped.length === 0) {
    return 'All candidates with valid example device ids have dashboard mappings.\n';
  }

  const lines: string[] = [
    '## Unmapped or ambiguous candidates',
    '',
    '| Source | Upstream dir | Example device id | Status | Notes |',
    '| --- | --- | --- | --- | --- |',
  ];

  for (const c of unmapped) {
    const notes =
      c.dashboardMappingStatus === 'ambiguous'
        ? `Candidates: ${c.ambiguousDashboardDeviceIds?.join(', ')}`
        : c.warnings.join('; ');
    lines.push(
      `| ${c.sourceId} | \`${c.upstreamDirName}\` | ${c.exampleDeviceId ?? '-'} | ${c.dashboardMappingStatus} | ${notes} |`
    );
  }

  lines.push('');
  return lines.join('\n');
}

function renderUnknownDeviceSection(candidates: ExampleCandidateEntry[]): string {
  const unknown = candidates.filter((c) => !c.exampleDeviceId);

  if (unknown.length === 0) {
    return '';
  }

  const lines: string[] = [
    '## Unknown example device ids',
    '',
    '| Source | Upstream dir |',
    '| --- | --- |',
  ];

  for (const c of unknown) {
    lines.push(`| ${c.sourceId} | \`${c.upstreamDirName}\` |`);
  }

  lines.push('');
  return lines.join('\n');
}

function renderMappedPreview(candidates: ExampleCandidateEntry[]): string {
  const mapped = candidates.filter((c) => c.dashboardDeviceId && c.example);

  if (mapped.length === 0) {
    return '';
  }

  const lines: string[] = [
    '## Mapped candidates (preview)',
    '',
    '| Dashboard device id | Example device id | Platform | Upstream path |',
    '| --- | --- | --- | --- |',
  ];

  for (const c of mapped.slice(0, 50)) {
    lines.push(
      `| \`${c.dashboardDeviceId}\` | ${c.exampleDeviceId} | ${c.example?.platform} | \`${c.example?.upstreamPath}\` |`
    );
  }

  if (mapped.length > 50) {
    lines.push('');
    lines.push(`_... and ${mapped.length - 50} more mapped candidates._`);
  }

  lines.push('');
  return lines.join('\n');
}

export function renderExampleCandidatesMarkdown(
  summary: SyncSummary
): string {
  const allCandidates = summary.sources.flatMap((s) => s.candidates);

  const lines: string[] = [
    '# Example candidates report',
    '',
    `Generated at: ${summary.generatedAt}`,
    '',
    'Review this report before merging `platform-examples.generated.json` into `platform-examples.json`.',
    '',
    renderUnmappedSection(allCandidates),
    renderUnknownDeviceSection(allCandidates),
    renderMappedPreview(allCandidates),
  ];

  return `${lines.join('\n').trimEnd()}\n`;
}

export async function writeExampleCandidatesReport(
  repoRoot: string,
  summary: SyncSummary
): Promise<string> {
  const outPath = path.join(
    repoRoot,
    'generated/reports/example-candidates.md'
  );
  await mkdir(path.dirname(outPath), { recursive: true });
  const content = renderExampleCandidatesMarkdown(summary);
  await writeFile(outPath, content, 'utf8');
  return outPath;
}
