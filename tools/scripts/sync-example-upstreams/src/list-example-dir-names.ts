import { readdir } from 'node:fs/promises';

export async function listExampleDirNames(
  mirrorPath: string
): Promise<string[]> {
  const entries = await readdir(mirrorPath, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory()).map((e) => e.name);
}
