import { readdir } from 'node:fs/promises';
import path from 'node:path';

const CIRCUIT_FILENAME_CANDIDATES = [
  'schematic.png',
  'Schematic.png',
  'circuit.png',
  'Circuit.png',
];

const CIRCUIT_DIR_CANDIDATES = ['imgs', 'images', 'img'];

async function findPngInDir(dir: string): Promise<string | undefined> {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    const pngs = entries
      .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.png'))
      .map((e) => e.name)
      .sort();
    return pngs[0];
  } catch {
    return undefined;
  }
}

export async function detectCircuitFilename(
  exampleMirrorDir: string
): Promise<string | undefined> {
  for (const name of CIRCUIT_FILENAME_CANDIDATES) {
    try {
      const { access } = await import('node:fs/promises');
      await access(path.join(exampleMirrorDir, name));
      return name;
    } catch {
      // try next candidate
    }
  }

  for (const subdir of CIRCUIT_DIR_CANDIDATES) {
    const subdirPath = path.join(exampleMirrorDir, subdir);
    const png = await findPngInDir(subdirPath);
    if (png) {
      return `${subdir}/${png}`;
    }
  }

  const rootPng = await findPngInDir(exampleMirrorDir);
  return rootPng;
}
