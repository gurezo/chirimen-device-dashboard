import path from 'node:path';
import { buildExampleCandidate } from '../../sync-example-upstreams/src/build-platform-example-candidates';
import { listExampleDirNames } from '../../sync-example-upstreams/src/list-example-dir-names';
import { resolveExampleDeviceId } from '../../sync-example-upstreams/src/resolve-example-device-id';
import {
  resolveDashboardDeviceId,
  type DashboardDeviceMappingResult,
} from './load-device-map';
import type { ExampleCandidateEntry, UpstreamSource } from './types';

export type LoadCandidatesInput = {
  repoRoot: string;
  source: UpstreamSource;
  dashboardDeviceIds: string[];
  overrides: Record<string, string>;
};

export async function loadExampleCandidates(
  input: LoadCandidatesInput
): Promise<ExampleCandidateEntry[]> {
  const { repoRoot, source, dashboardDeviceIds, overrides } = input;
  const mirrorPath = path.join(repoRoot, 'generated/upstreams', source.id);
  const candidates: ExampleCandidateEntry[] = [];

  let dirNames: string[];
  try {
    dirNames = await listExampleDirNames(mirrorPath);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(
      `Failed to read mirror for ${source.id} at ${mirrorPath}: ${message}. Run pnpm sync:example-upstreams first.`
    );
  }

  for (const upstreamDirName of dirNames) {
    const parsedExampleDeviceId = resolveExampleDeviceId(upstreamDirName);

    const dashboardMapping: DashboardDeviceMappingResult = parsedExampleDeviceId
      ? resolveDashboardDeviceId(
          parsedExampleDeviceId,
          dashboardDeviceIds,
          overrides
        )
      : {
          dashboardDeviceId: null,
          status: 'unresolved',
        };

    const candidate = await buildExampleCandidate({
      source,
      upstreamDirName,
      mirrorPath,
      dashboardMapping,
    });

    candidates.push(candidate);
  }

  return candidates;
}
