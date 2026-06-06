import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { detectCircuitFilename } from './detect-circuit-url';

describe('detectCircuitFilename', () => {
  const tempDirs: string[] = [];

  afterEach(async () => {
    const { rm } = await import('node:fs/promises');
    await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true })));
  });

  async function createTempExampleDir(files: Record<string, string>): Promise<string> {
    const dir = await mkdtemp(path.join(tmpdir(), 'example-mirror-'));
    tempDirs.push(dir);

    for (const [filename, contents] of Object.entries(files)) {
      await writeFile(path.join(dir, filename), contents);
    }

    return dir;
  }

  it('returns the actual filename when only the case differs', async () => {
    const dir = await createTempExampleDir({
      'Schematic.png': 'png',
      'main.js': 'js',
    });

    await expect(detectCircuitFilename(dir)).resolves.toBe('Schematic.png');
  });

  it('prefers schematic candidates over other png files', async () => {
    const dir = await createTempExampleDir({
      'aaa-other.png': 'png',
      'schematic.png': 'png',
    });

    await expect(detectCircuitFilename(dir)).resolves.toBe('schematic.png');
  });
});
