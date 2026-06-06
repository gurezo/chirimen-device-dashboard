import { readdir } from 'node:fs/promises';
import path from 'node:path';

const CIRCUIT_FILENAME_CANDIDATES = [
  'schematic.png',
  'Schematic.png',
  'circuit.png',
  'Circuit.png',
];

const CIRCUIT_DIR_CANDIDATES = ['imgs', 'images', 'img'];

async function listFilesInDir(dir: string): Promise<string[]> {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    return entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
  } catch {
    return [];
  }
}

function findCaseInsensitiveMatch(
  files: string[],
  candidate: string
): string | undefined {
  const normalizedCandidate = candidate.toLowerCase();
  return files.find((name) => name.toLowerCase() === normalizedCandidate);
}

async function findPngInDir(dir: string): Promise<string | undefined> {
  const files = await listFilesInDir(dir);
  const pngs = files
    .filter((name) => name.toLowerCase().endsWith('.png'))
    .sort((a, b) => a.localeCompare(b));
  return pngs[0];
}

export async function detectCircuitFilename(
  exampleMirrorDir: string
): Promise<string | undefined> {
  const files = await listFilesInDir(exampleMirrorDir);

  for (const candidate of CIRCUIT_FILENAME_CANDIDATES) {
    const match = findCaseInsensitiveMatch(files, candidate);
    if (match) {
      return match;
    }
  }

  for (const subdir of CIRCUIT_DIR_CANDIDATES) {
    const subdirPath = path.join(exampleMirrorDir, subdir);
    const png = await findPngInDir(subdirPath);
    if (png) {
      return `${subdir}/${png}`;
    }
  }

  return findPngInDir(exampleMirrorDir);
}
