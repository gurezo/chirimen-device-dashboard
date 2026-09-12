import type {
  DeviceInfo,
  ExampleInfo,
  ExampleStatus,
  ProductInfo,
} from '@chirimen-device-dashboard/shared-types';
import type { CertifiedDevice } from './certified-devices.types';

const DEVICE_TAGS: DeviceInfo['tag'][] = [
  'GPIO',
  'I2C',
  'Analog',
  'Actuator',
  'Other',
  'BoardComputer',
];

const EXAMPLE_STATUSES: ExampleStatus[] = [
  'primary',
  'legacy',
  'archive',
  'special',
  'incubator',
];

const PLATFORM_HARDWARE: Record<string, string> = {
  'pizero-esm': 'Pi Zero',
  'microbit-driver': 'micro:bit',
  'microbit-web': 'micro:bit',
  'legacy-gc-gpio': 'chirimen',
  'legacy-gc-i2c': 'chirimen',
  'remote-connection': 'remote',
  remote: 'remote',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function field(record: Record<string, unknown>, key: string): unknown {
  return record[key];
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function optionalUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function adaptTag(value: unknown): DeviceInfo['tag'] {
  return typeof value === 'string' &&
    (DEVICE_TAGS as string[]).includes(value)
    ? (value as DeviceInfo['tag'])
    : 'Other';
}

function adaptStatus(value: unknown): ExampleStatus {
  return typeof value === 'string' &&
    (EXAMPLE_STATUSES as string[]).includes(value)
    ? (value as ExampleStatus)
    : 'legacy';
}

function hardwareForPlatform(platform: string): string {
  return PLATFORM_HARDWARE[platform] ?? platform;
}

function buildUpstreamRepositoryUrl(repository: string): string | undefined {
  const trimmed = repository.trim();
  return trimmed ? `https://github.com/${trimmed}` : undefined;
}

function adaptExample(example: unknown, deviceId: string): ExampleInfo | null {
  if (!isRecord(example)) {
    return null;
  }

  const platform = asString(field(example, 'platform'));
  const upstreamRepository = asString(field(example, 'upstreamRepository'));
  const upstreamPath = asString(field(example, 'upstreamPath'));
  const upstreamPathUrl = asString(field(example, 'upstreamPathUrl'));
  const verified = field(example, 'verified');
  const info: ExampleInfo = {
    hardware: platform ? hardwareForPlatform(platform) : '',
    code: upstreamPathUrl,
  };

  if (deviceId) {
    info.deviceId = deviceId;
  }
  if (platform) {
    info.platform = platform;
  }
  if (upstreamRepository) {
    info.upstreamRepository = upstreamRepository;
    const repositoryUrl = buildUpstreamRepositoryUrl(upstreamRepository);
    if (repositoryUrl) {
      info.upstreamRepositoryUrl = repositoryUrl;
    }
  }
  if (upstreamPath) {
    info.upstreamPath = upstreamPath;
  }
  if (upstreamPathUrl) {
    info.upstreamPathUrl = upstreamPathUrl;
  }

  info.status = adaptStatus(field(example, 'status'));

  const circuitUrl = optionalUrl(field(example, 'circuitUrl'));
  if (circuitUrl) {
    info.circuitUrl = circuitUrl;
  }

  info.verified = typeof verified === 'boolean' ? verified : false;

  return info;
}

function adaptCertifiedDeviceRecord(
  record: Record<string, unknown>,
): DeviceInfo {
  const metaValue = field(record, 'meta');
  const meta = isRecord(metaValue) ? metaValue : {};
  const id = asString(field(record, 'id')) || asString(field(meta, 'id'));
  const examples = field(meta, 'examples');
  const product: ProductInfo = {
    url: asString(field(meta, 'productUrl')).trim(),
    example: Array.isArray(examples)
      ? examples
          .map((example) => adaptExample(example, id))
          .filter((example): example is ExampleInfo => example !== null)
      : [],
  };

  const circuit = optionalUrl(field(meta, 'circuit'));
  if (circuit) {
    product.circuit = circuit;
  }
  const datasheet = optionalUrl(field(meta, 'datasheet'));
  if (datasheet) {
    product.datasheet = datasheet;
  }
  const reference = optionalUrl(field(meta, 'reference'));
  if (reference) {
    product.reference = reference;
  }

  return {
    id,
    deviceName: asString(field(meta, 'model')) || id,
    tag: adaptTag(field(meta, 'tag')),
    category: asString(field(meta, 'category')),
    description: asString(field(meta, 'description')),
    image: asString(field(meta, 'image')),
    product,
  };
}

export function adaptCertifiedDevice(device: CertifiedDevice): DeviceInfo {
  return adaptCertifiedDeviceRecord(
    device as unknown as Record<string, unknown>,
  );
}

export function adaptCertifiedDevicesJson(input: unknown): DeviceInfo[] {
  if (!isRecord(input)) {
    return [];
  }

  const devices = field(input, 'devices');
  if (!Array.isArray(devices)) {
    return [];
  }

  return devices.filter(isRecord).map(adaptCertifiedDeviceRecord);
}
