import { mkdtemp, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { loadSources } from './load-sources';

const tempDirs: string[] = [];

afterEach(async () => {
  const { rm } = await import('node:fs/promises');
  for (const dir of tempDirs.splice(0)) {
    await rm(dir, { recursive: true, force: true });
  }
});

async function createTempRepoWithSources(content: string): Promise<string> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'sync-upstreams-test-'));
  tempDirs.push(dir);
  const dataDir = path.join(dir, 'data/example-upstreams');
  const { mkdir } = await import('node:fs/promises');
  await mkdir(dataDir, { recursive: true });
  await writeFile(path.join(dataDir, 'sources.yaml'), content, 'utf8');
  return dir;
}

describe('loadSources', () => {
  it('loads valid sources yaml', async () => {
    const repoRoot = await createTempRepoWithSources(`
sources:
  - id: test-source
    repo: chirimen-oh/chirimen.org
    branch: master
    path: pizero/src/esm-examples
    platform: pizero-esm
    priority: primary
    description: test source
`);
    const sources = await loadSources(repoRoot);
    expect(sources).toHaveLength(1);
    expect(sources[0].id).toBe('test-source');
    expect(sources[0].priority).toBe('primary');
  });

  it('throws on invalid priority', async () => {
    const repoRoot = await createTempRepoWithSources(`
sources:
  - id: test-source
    repo: chirimen-oh/chirimen.org
    branch: master
    path: examples
    platform: node
    priority: invalid
    description: test
`);
    await expect(loadSources(repoRoot)).rejects.toThrow(/priority/);
  });

  it('throws when sources array is missing', async () => {
    const repoRoot = await createTempRepoWithSources('other: value');
    await expect(loadSources(repoRoot)).rejects.toThrow(/sources array/);
  });
});
