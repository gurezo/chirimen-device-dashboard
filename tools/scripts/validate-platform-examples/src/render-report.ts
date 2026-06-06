import path from 'node:path';
import type { ValidationIssue, ValidationReportContext } from './types';
import { writeFileIfChanged } from './write-file-if-changed';

function renderIssueTable(
  title: string,
  issues: ValidationIssue[],
  columns: Array<'source' | 'dashboardDeviceId' | 'platform' | 'field' | 'message'>
): string {
  if (issues.length === 0) {
    return `## ${title}\n\nNo issues found.\n`;
  }

  const header = `| ${columns.join(' | ')} |`;
  const separator = `| ${columns.map(() => '---').join(' | ')} |`;
  const rows = issues.map((issue) =>
    `| ${columns
      .map((column) => {
        const value = issue[column] ?? '-';
        return column === 'dashboardDeviceId' ? `\`${value}\`` : value;
      })
      .join(' | ')} |`
  );

  return [`## ${title}`, '', header, separator, ...rows, ''].join('\n');
}

export function renderMissingExampleFieldsMarkdown(
  context: ValidationReportContext
): string {
  const fieldIssues = context.result.issues.filter((issue) => issue.field);
  const lines = [
    '# Missing example fields',
    '',
    `Generated at: ${context.generatedAt}`,
    '',
    renderIssueTable('Missing fields', fieldIssues, [
      'source',
      'dashboardDeviceId',
      'platform',
      'field',
      'message',
    ]),
  ];

  return `${lines.join('\n').trimEnd()}\n`;
}

export function renderDuplicatedPlatformExamplesMarkdown(
  context: ValidationReportContext
): string {
  const duplicateIssues = context.result.issues.filter((issue) =>
    issue.message.startsWith('duplicate platform')
  );
  const lines = [
    '# Duplicated platform examples',
    '',
    `Generated at: ${context.generatedAt}`,
    '',
    renderIssueTable('Duplicates', duplicateIssues, [
      'source',
      'dashboardDeviceId',
      'platform',
      'message',
    ]),
  ];

  return `${lines.join('\n').trimEnd()}\n`;
}

export function renderMissingCircuitUrlMarkdown(
  context: ValidationReportContext
): string {
  const circuitIssues = context.result.issues.filter(
    (issue) => issue.field === 'circuitUrl'
  );
  const lines = [
    '# Missing circuit URL',
    '',
    `Generated at: ${context.generatedAt}`,
    '',
    renderIssueTable('Missing circuitUrl', circuitIssues, [
      'source',
      'dashboardDeviceId',
      'platform',
      'message',
    ]),
  ];

  return `${lines.join('\n').trimEnd()}\n`;
}

export function renderValidationSummaryMarkdown(
  context: ValidationReportContext
): string {
  const issueCount = context.result.issues.length;
  const warningCount = context.result.warnings.length;
  const status = issueCount === 0 ? 'PASS' : 'FAIL';

  const lines = [
    '# Platform example validation summary',
    '',
    `Generated at: ${context.generatedAt}`,
    '',
    `Status: **${status}**`,
    '',
    '## Inputs',
    '',
    `- platform examples: \`${context.platformExamplesPath}\``,
    `- devices.json: \`${context.devicesJsonPath}\``,
    '',
    '## Counts',
    '',
    `- issues: ${issueCount}`,
    `- warnings: ${warningCount}`,
    `- missing fields: ${context.result.issues.filter((issue) => issue.field).length}`,
    `- duplicate platforms: ${context.result.issues.filter((issue) => issue.message.startsWith('duplicate platform')).length}`,
    `- missing circuitUrl: ${context.result.issues.filter((issue) => issue.field === 'circuitUrl').length}`,
  ];

  if (context.result.warnings.length > 0) {
    lines.push(
      '',
      renderIssueTable('Warnings', context.result.warnings, [
        'source',
        'dashboardDeviceId',
        'platform',
        'message',
      ])
    );
  }

  lines.push('');
  return `${lines.join('\n').trimEnd()}\n`;
}

export async function writeValidationReports(
  context: ValidationReportContext
): Promise<string[]> {
  const reportsDir = path.join(context.repoRoot, 'generated/reports');
  const reportFiles = [
    {
      fileName: 'missing-example-fields.md',
      content: renderMissingExampleFieldsMarkdown(context),
    },
    {
      fileName: 'duplicated-platform-examples.md',
      content: renderDuplicatedPlatformExamplesMarkdown(context),
    },
    {
      fileName: 'missing-circuit-url.md',
      content: renderMissingCircuitUrlMarkdown(context),
    },
    {
      fileName: 'platform-example-validation-summary.md',
      content: renderValidationSummaryMarkdown(context),
    },
  ];

  const writtenPaths: string[] = [];

  for (const report of reportFiles) {
    const outPath = path.join(reportsDir, report.fileName);
    await writeFileIfChanged(outPath, report.content);
    writtenPaths.push(outPath);
  }

  return writtenPaths;
}
