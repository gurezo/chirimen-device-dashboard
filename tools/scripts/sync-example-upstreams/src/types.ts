import type {
  ExampleInfo,
  ExampleStatus,
} from '@chirimen-device-dashboard/shared-types';

export interface UpstreamSource {
  id: string;
  repo: string;
  branch: string;
  path: string;
  platform: string;
  priority: ExampleStatus;
  description: string;
}

export interface UpstreamSourcesFile {
  sources: UpstreamSource[];
}

export interface ExampleCandidateEntry {
  sourceId: string;
  upstreamDirName: string;
  exampleDeviceId: string | null;
  dashboardDeviceId: string | null;
  dashboardMappingStatus:
    | 'resolved'
    | 'fan-out'
    | 'ambiguous'
    | 'unresolved'
    | 'override';
  ambiguousDashboardDeviceIds?: string[];
  example: Partial<ExampleInfo> | null;
  warnings: string[];
}

export interface SourceSyncResult {
  sourceId: string;
  repo: string;
  branch: string;
  path: string;
  platform: string;
  mirrorPath: string;
  commitSha?: string;
  exampleCount: number;
  errors: string[];
  candidates: ExampleCandidateEntry[];
}

export interface SyncSummary {
  generatedAt: string;
  repoRoot: string;
  sources: SourceSyncResult[];
  fatalErrors: string[];
}

export interface RefreshSourceReport {
  generatedAt: string;
  partslist: {
    repository: string;
    branch: string;
    path: string;
    commit: string | null;
  };
  examples: {
    sourceId: string;
    repository: string;
    branch: string;
    path: string;
    platform: string;
    commit: string | null;
  }[];
}

export interface PlatformExampleDeviceEntry {
  dashboardDeviceId: string;
  exampleDeviceId: string;
  examples: ExampleInfo[];
}

export interface DeviceIdOverridesFile {
  overrides: Record<string, string | string[]>;
}
