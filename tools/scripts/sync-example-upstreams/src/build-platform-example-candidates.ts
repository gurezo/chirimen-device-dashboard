import path from 'node:path';
import type { ExampleInfo } from '@chirimen-device-dashboard/shared-types';
import {
  buildExampleUrls,
  buildLocalPath,
  buildUpstreamPath,
  defaultHardwareForPlatform,
  mapPriorityToStatus,
} from './build-example-urls';
import { detectCircuitFilename } from './detect-circuit-url';
import type { DashboardDeviceMappingResult } from './resolve-dashboard-device-id';
import { resolveExampleDeviceId } from './resolve-example-device-id';
import type { ExampleCandidateEntry, UpstreamSource } from './types';

export type BuildCandidateInput = {
  source: UpstreamSource;
  upstreamDirName: string;
  mirrorPath: string;
  dashboardMapping: DashboardDeviceMappingResult;
};

export async function buildExampleCandidate(
  input: BuildCandidateInput
): Promise<ExampleCandidateEntry> {
  const { source, upstreamDirName, mirrorPath, dashboardMapping } = input;
  const warnings: string[] = [];

  const exampleDeviceId = resolveExampleDeviceId(upstreamDirName);
  if (!exampleDeviceId) {
    return {
      sourceId: source.id,
      upstreamDirName,
      exampleDeviceId: null,
      dashboardDeviceId: null,
      dashboardMappingStatus: 'unresolved',
      example: null,
      warnings: [`Could not resolve example device id from "${upstreamDirName}"`],
    };
  }

  if (dashboardMapping.status === 'ambiguous') {
    warnings.push(
      `Ambiguous dashboard device id for "${exampleDeviceId}": ${dashboardMapping.ambiguousDashboardDeviceIds?.join(', ')}`
    );
  } else if (dashboardMapping.status === 'unresolved') {
    warnings.push(
      `No dashboard device id found for example device id "${exampleDeviceId}"`
    );
  }

  const upstreamPath = buildUpstreamPath(source.path, upstreamDirName);
  const exampleMirrorDir = path.join(mirrorPath, upstreamDirName);
  const circuitFilename = await detectCircuitFilename(exampleMirrorDir);

  if (!circuitFilename) {
    warnings.push(`No circuit image detected in ${upstreamDirName}`);
  }

  const urls = buildExampleUrls(
    source.repo,
    upstreamPath,
    source.branch,
    circuitFilename
  );

  const status = mapPriorityToStatus(source.priority);
  const platform = source.platform;
  const hardware = defaultHardwareForPlatform(platform);

  const example: ExampleInfo = {
    hardware,
    code: urls.upstreamPathUrl,
    deviceId: exampleDeviceId,
    platform,
    localPath: buildLocalPath(exampleDeviceId, platform),
    upstreamRepository: source.repo,
    upstreamRepositoryUrl: urls.upstreamRepositoryUrl,
    upstreamPath,
    upstreamPathUrl: urls.upstreamPathUrl,
    status,
    ...(urls.circuitUrl ? { circuitUrl: urls.circuitUrl } : {}),
    verified: false,
  };

  return {
    sourceId: source.id,
    upstreamDirName,
    exampleDeviceId,
    dashboardDeviceId: dashboardMapping.dashboardDeviceId,
    dashboardMappingStatus: dashboardMapping.status,
    ambiguousDashboardDeviceIds: dashboardMapping.ambiguousDashboardDeviceIds,
    example,
    warnings,
  };
}

export function groupCandidatesByDashboardDevice(
  candidates: ExampleCandidateEntry[]
): Map<
  string,
  { exampleDeviceId: string; examples: ExampleInfo[]; warnings: string[] }
> {
  const grouped = new Map<
    string,
    { exampleDeviceId: string; examples: ExampleInfo[]; warnings: string[] }
  >();

  for (const candidate of candidates) {
    if (!candidate.example || !candidate.dashboardDeviceId) {
      continue;
    }

    const key = candidate.dashboardDeviceId;
    const existing = grouped.get(key);
    if (existing) {
      existing.examples.push(candidate.example as ExampleInfo);
      existing.warnings.push(...candidate.warnings);
    } else {
      grouped.set(key, {
        exampleDeviceId: candidate.exampleDeviceId ?? key,
        examples: [candidate.example as ExampleInfo],
        warnings: [...candidate.warnings],
      });
    }
  }

  return grouped;
}
