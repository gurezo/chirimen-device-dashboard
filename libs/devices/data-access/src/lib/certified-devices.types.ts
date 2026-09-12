/**
 * Input types for chirimen-certified-devices `generated/devices.json`.
 * UI components must not import these types; convert via the adapter first.
 */

export const SUPPORTED_CERTIFIED_DEVICES_VERSION = 1;

export function isSupportedCertifiedDevicesVersion(
  version: unknown,
): boolean {
  return version === SUPPORTED_CERTIFIED_DEVICES_VERSION;
}

export type CertifiedExampleStatus =
  | 'primary'
  | 'legacy'
  | 'archive'
  | 'special'
  | 'incubator';

export interface CertifiedPlatform {
  id: string;
  label: string;
  defaultStatus: CertifiedExampleStatus;
  allowedStatuses: CertifiedExampleStatus[];
  upstreamRepository: string;
  upstreamBasePath: string;
  legacyCodeUrlPatterns: string[];
}

export interface CertifiedPlatformsCatalog {
  platforms: Record<string, CertifiedPlatform>;
}

export interface CertifiedDirectoryRules {
  single: string;
  composite: string;
  remoteSingle: string;
  remoteComposite: string;
}

export interface CertifiedCompositeDevice {
  models: string[];
  description: string;
}

export interface CertifiedRemoteDevice {
  baseModel: string;
  models?: string[];
  description: string;
}

export interface CertifiedExampleNameAlias {
  directoryId: string;
  exampleDeviceId: string;
  legacyExampleNames: string[];
}

export interface CertifiedAliases {
  directoryRules: CertifiedDirectoryRules;
  compositeDevices: Record<string, CertifiedCompositeDevice>;
  remoteDevices: Record<string, CertifiedRemoteDevice>;
  exampleNameAliases: Record<string, CertifiedExampleNameAlias>;
}

export interface CertifiedExample {
  platform: string;
  status: string;
  upstreamRepository: string;
  upstreamPath: string;
  upstreamPathUrl: string;
  circuitUrl?: string | null;
  driver?: string | null;
  verified?: boolean;
  platformLabel?: string;
}

export interface CertifiedDeviceMeta {
  id: string;
  model: string;
  tag: string;
  category: string;
  description: string;
  image: string | null;
  productUrl: string | null;
  examples: CertifiedExample[];
  circuit: string | null;
  datasheet: string | null;
  reference: string | null;
  packages?: string[];
  platform?: string;
  status?: string;
  verified?: boolean;
}

export interface CertifiedDeviceReadmeFrontmatter {
  title?: string;
  model?: string;
  category?: string;
  description?: string;
}

export interface CertifiedDeviceReadme {
  path: string;
  frontmatter?: CertifiedDeviceReadmeFrontmatter;
}

export interface CertifiedDevice {
  id: string;
  directory: string;
  meta: CertifiedDeviceMeta;
  readme?: CertifiedDeviceReadme;
}

export interface CertifiedDevicesJson {
  version: number;
  generatedAt: string;
  platforms: CertifiedPlatformsCatalog;
  aliases: CertifiedAliases;
  devices: CertifiedDevice[];
}
