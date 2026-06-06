import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { serializeJson, writeJsonIfChanged } from './write-json-if-changed';

describe('writeJsonIfChanged', () => {
  let tempDir: string;

  afterEach(async () => {
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it('writes new file and returns true', async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), 'write-json-'));
    const filePath = path.join(tempDir, 'out.json');
    const changed = await writeJsonIfChanged(filePath, [{ id: 'a' }]);
    expect(changed).toBe(true);
    const content = await readFile(filePath, 'utf8');
    expect(content).toBe(serializeJson([{ id: 'a' }]));
  });

  it('returns false when content is unchanged', async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), 'write-json-'));
    const filePath = path.join(tempDir, 'out.json');
    const data = [{ id: 'a' }];
    await writeJsonIfChanged(filePath, data);
    const changed = await writeJsonIfChanged(filePath, data);
    expect(changed).toBe(false);
  });
});
