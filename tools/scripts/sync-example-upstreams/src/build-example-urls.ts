import type { ExampleStatus } from '@chirimen-device-dashboard/shared-types';

export type ExampleUrls = {
  upstreamRepositoryUrl: string;
  upstreamPathUrl: string;
  circuitUrl: string;
};

const PLATFORM_HARDWARE: Record<string, string> = {
  'pizero-esm': 'Pi Zero',
  node: 'Raspberry Pi',
  'raspi-node': 'Raspberry Pi',
  'microbit-driver': 'micro:bit',
  'microbit-web': 'micro:bit',
  'legacy-gc-gpio': 'chirimen',
  'legacy-gc-i2c': 'chirimen',
  remote: 'remote',
  'pre-arranged': 'pre-arranged',
};

export function buildUpstreamRepositoryUrl(upstreamRepository: string): string {
  return `https://github.com/${upstreamRepository}`;
}

export function buildUpstreamPathUrl(
  upstreamRepository: string,
  upstreamPath: string,
  branch = 'master'
): string {
  return `https://github.com/${upstreamRepository}/tree/${branch}/${upstreamPath}`;
}

export function buildCircuitBlobUrl(
  upstreamRepository: string,
  upstreamPath: string,
  filename: string,
  branch = 'master'
): string {
  return `https://github.com/${upstreamRepository}/blob/${branch}/${upstreamPath}/${filename}`;
}

export function buildExampleUrls(
  upstreamRepository: string,
  upstreamPath: string,
  branch: string,
  circuitFilename?: string
): ExampleUrls {
  return {
    upstreamRepositoryUrl: buildUpstreamRepositoryUrl(upstreamRepository),
    upstreamPathUrl: buildUpstreamPathUrl(
      upstreamRepository,
      upstreamPath,
      branch
    ),
    circuitUrl: circuitFilename
      ? buildCircuitBlobUrl(
          upstreamRepository,
          upstreamPath,
          circuitFilename,
          branch
        )
      : '',
  };
}

export function defaultHardwareForPlatform(platform: string): string {
  return PLATFORM_HARDWARE[platform] ?? platform;
}

export function mapPriorityToStatus(priority: string): ExampleStatus {
  const valid: ExampleStatus[] = [
    'primary',
    'legacy',
    'archive',
    'special',
    'incubator',
  ];
  if (valid.includes(priority as ExampleStatus)) {
    return priority as ExampleStatus;
  }
  return 'legacy';
}

export function buildLocalPath(deviceId: string, platform: string): string {
  return `examples/devices/${deviceId}/platforms/${platform}`;
}

export function buildUpstreamPath(
  sourcePath: string,
  upstreamDirName: string
): string {
  if (sourcePath === '.') {
    return upstreamDirName;
  }
  return `${sourcePath}/${upstreamDirName}`;
}
