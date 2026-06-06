import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import type { ExampleStatus } from '@chirimen-device-dashboard/shared-types';
import type { UpstreamSource, UpstreamSourcesFile } from './types';

const REQUIRED_FIELDS = [
  'id',
  'repo',
  'branch',
  'path',
  'platform',
  'priority',
  'description',
] as const;

const VALID_PRIORITIES: ExampleStatus[] = [
  'primary',
  'legacy',
  'archive',
  'special',
  'incubator',
];

function assertSource(
  source: unknown,
  index: number
): asserts source is UpstreamSource {
  if (typeof source !== 'object' || source === null) {
    throw new Error(
      `data/example-upstreams/sources.yaml: sources[${index}] must be an object`
    );
  }

  const record = source as Record<string, unknown>;
  for (const field of REQUIRED_FIELDS) {
    if (typeof record[field] !== 'string' || record[field] === '') {
      throw new Error(
        `data/example-upstreams/sources.yaml: sources[${index}].${field} must be a non-empty string`
      );
    }
  }

  if (!VALID_PRIORITIES.includes(record.priority as ExampleStatus)) {
    throw new Error(
      `data/example-upstreams/sources.yaml: sources[${index}].priority must be one of ${VALID_PRIORITIES.join(', ')}`
    );
  }
}

export async function loadSources(repoRoot: string): Promise<UpstreamSource[]> {
  const filePath = path.join(
    repoRoot,
    'data/example-upstreams/sources.yaml'
  );
  const raw = await readFile(filePath, 'utf8');
  const parsed = parseYaml(raw) as unknown;

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('sources' in parsed) ||
    !Array.isArray((parsed as UpstreamSourcesFile).sources)
  ) {
    throw new Error(
      'data/example-upstreams/sources.yaml: expected sources array'
    );
  }

  const { sources } = parsed as UpstreamSourcesFile;
  sources.forEach((source, index) => assertSource(source, index));
  return sources;
}
