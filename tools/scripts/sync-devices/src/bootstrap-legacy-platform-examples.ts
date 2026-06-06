import type { DeviceInfo, ExampleInfo } from '@chirimen-device-dashboard/shared-types';
import { isPlatformSpecificExample } from '@chirimen-device-dashboard/shared-types';
import { classifyLegacyExampleUrl } from './classify-legacy-example-url';
import type { PlatformExampleDeviceEntry } from './types';

const DEFAULT_UPSTREAM_BY_PLATFORM: Record<
  string,
  { upstreamRepository: string; upstreamPath: string }
> = {
  'pizero-esm': {
    upstreamRepository: 'chirimen-oh/chirimen.org',
    upstreamPath: 'pizero/src/esm-examples',
  },
  'microbit-driver': {
    upstreamRepository: 'chirimen-oh/chirimen-drivers',
    upstreamPath: 'microbit-examples',
  },
  chirimen: {
    upstreamRepository: 'chirimen-oh/chirimen',
    upstreamPath: 'gc/examples',
  },
};

function buildUpstreamRepositoryUrl(upstreamRepository: string): string {
  return `https://github.com/${upstreamRepository}`;
}

function buildUpstreamPathUrl(
  upstreamRepository: string,
  upstreamPath: string
): string {
  return `https://github.com/${upstreamRepository}/tree/master/${upstreamPath}`;
}

function buildLocalPath(exampleDeviceId: string, platform: string): string {
  return `examples/devices/${exampleDeviceId}/platforms/${platform}`;
}

function parseGithubRepository(codeUrl: string): string | null {
  const match = codeUrl.match(/github\.com\/([^/]+\/[^/]+)/i);
  return match?.[1] ?? null;
}

function resolveUpstreamFields(
  platform: string,
  codeUrl: string,
  enriched?: Partial<ExampleInfo>
): Pick<
  ExampleInfo,
  | 'upstreamRepository'
  | 'upstreamRepositoryUrl'
  | 'upstreamPath'
  | 'upstreamPathUrl'
  | 'circuitUrl'
> {
  if (
    enriched?.upstreamRepository &&
    enriched.upstreamPath &&
    enriched.upstreamRepositoryUrl &&
    enriched.upstreamPathUrl
  ) {
    return {
      upstreamRepository: enriched.upstreamRepository,
      upstreamRepositoryUrl: enriched.upstreamRepositoryUrl,
      upstreamPath: enriched.upstreamPath,
      upstreamPathUrl: enriched.upstreamPathUrl,
      circuitUrl: enriched.circuitUrl || codeUrl,
    };
  }

  const externalRepo = parseGithubRepository(codeUrl);
  if (externalRepo && !codeUrl.includes('chirimen-oh/')) {
    const upstreamPath = 'examples';
    return {
      upstreamRepository: externalRepo,
      upstreamRepositoryUrl: buildUpstreamRepositoryUrl(externalRepo),
      upstreamPath,
      upstreamPathUrl: codeUrl,
      circuitUrl: codeUrl,
    };
  }

  const defaults = DEFAULT_UPSTREAM_BY_PLATFORM[platform];
  if (!defaults) {
    return {
      upstreamRepository: 'chirimen-oh/chirimen.org',
      upstreamRepositoryUrl: buildUpstreamRepositoryUrl('chirimen-oh/chirimen.org'),
      upstreamPath: 'examples',
      upstreamPathUrl: codeUrl,
      circuitUrl: codeUrl,
    };
  }

  const useTutorialUrl =
    codeUrl.includes('tutorial.chirimen.org') ||
    codeUrl.includes('r.chirimen.org') ||
    codeUrl.includes('chirimen.org/chirimen');

  return {
    upstreamRepository: defaults.upstreamRepository,
    upstreamRepositoryUrl: buildUpstreamRepositoryUrl(defaults.upstreamRepository),
    upstreamPath: defaults.upstreamPath,
    upstreamPathUrl: useTutorialUrl
      ? codeUrl
      : buildUpstreamPathUrl(defaults.upstreamRepository, defaults.upstreamPath),
    circuitUrl: enriched?.circuitUrl || codeUrl,
  };
}

export function deriveExampleDeviceId(dashboardDeviceId: string): string {
  return dashboardDeviceId
    .replace(/^(i2c|gpio|analog|actuator|other)-/, '')
    .replace(/-device(-\d+)?$/, '')
    .replace(/-device$/, '');
}

export function buildReverseOverrideMap(
  overrides: Record<string, string | string[]>
): Map<string, string> {
  const reverse = new Map<string, string>();

  for (const [exampleDeviceId, dashboardValue] of Object.entries(overrides)) {
    const dashboardIds = Array.isArray(dashboardValue)
      ? dashboardValue
      : [dashboardValue];
    for (const dashboardDeviceId of dashboardIds) {
      reverse.set(dashboardDeviceId, exampleDeviceId);
    }
  }

  return reverse;
}

export function isLegacyOnlyDevice(device: DeviceInfo): boolean {
  const examples = device.product?.example ?? [];
  if (examples.length === 0) {
    return false;
  }

  return !examples.some(isPlatformSpecificExample);
}

export function bootstrapLegacyExampleEntry(
  legacyExample: ExampleInfo,
  options: {
    dashboardDeviceId: string;
    exampleDeviceId: string;
    productCircuit?: string;
    enrichedByPlatform?: Map<string, Partial<ExampleInfo>>;
  }
): ExampleInfo | null {
  const code = legacyExample.code?.trim() ?? '';
  const classification = classifyLegacyExampleUrl(code);
  if (!classification) {
    return null;
  }

  const { platform, status } = classification;
  const enriched = options.enrichedByPlatform?.get(platform);
  const upstream = resolveUpstreamFields(platform, code, enriched);
  const circuitUrl =
    enriched?.circuitUrl?.trim() ||
    options.productCircuit?.trim() ||
    upstream.circuitUrl ||
    code;

  return {
    hardware: legacyExample.hardware?.trim() || platform,
    code,
    deviceId: options.exampleDeviceId,
    platform,
    localPath: buildLocalPath(options.exampleDeviceId, platform),
    upstreamRepository: upstream.upstreamRepository,
    upstreamRepositoryUrl: upstream.upstreamRepositoryUrl,
    upstreamPath: upstream.upstreamPath,
    upstreamPathUrl: upstream.upstreamPathUrl,
    status,
    circuitUrl,
    verified: enriched?.verified ?? false,
  };
}

export function bootstrapLegacyPlatformExamples(
  devices: DeviceInfo[],
  options: {
    overrideExampleDeviceIds?: Map<string, string>;
    enrichedEntries?: PlatformExampleDeviceEntry[];
  } = {}
): PlatformExampleDeviceEntry[] {
  const enrichedByDashboard = new Map(
    (options.enrichedEntries ?? []).map((entry) => [entry.dashboardDeviceId, entry])
  );

  const entries: PlatformExampleDeviceEntry[] = [];

  for (const device of devices) {
    if (!isLegacyOnlyDevice(device)) {
      continue;
    }

    const exampleDeviceId =
      options.overrideExampleDeviceIds?.get(device.id) ??
      deriveExampleDeviceId(device.id);

    const enrichedEntry = enrichedByDashboard.get(device.id);
    const enrichedByPlatform = new Map(
      (enrichedEntry?.examples ?? [])
        .filter((example) => example.platform)
        .map((example) => [example.platform as string, example])
    );

    const examples = device.product.example
      .map((legacyExample) =>
        bootstrapLegacyExampleEntry(legacyExample, {
          dashboardDeviceId: device.id,
          exampleDeviceId,
          productCircuit: device.product.circuit,
          enrichedByPlatform,
        })
      )
      .filter((example): example is ExampleInfo => example !== null);

    if (examples.length === 0) {
      continue;
    }

    entries.push({
      dashboardDeviceId: device.id,
      exampleDeviceId,
      examples,
    });
  }

  return entries.sort((a, b) =>
    a.dashboardDeviceId.localeCompare(b.dashboardDeviceId)
  );
}
