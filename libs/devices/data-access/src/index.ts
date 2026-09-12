export {
  type DeviceRepository,
  DEVICE_REPOSITORY,
} from './lib/device.repository';
export { JsonDeviceRepository } from './lib/json-device.repository';
export { provideDeviceRepository } from './lib/providers';
export {
  CERTIFIED_DEVICES_FETCH_TIMEOUT_MS,
  CERTIFIED_DEVICES_JSON_URL,
  DEFAULT_CERTIFIED_DEVICES_JSON_URL,
} from './lib/certified-devices.config';
export {
  SUPPORTED_CERTIFIED_DEVICES_VERSION,
  isSupportedCertifiedDevicesVersion,
  type CertifiedExampleStatus,
  type CertifiedPlatform,
  type CertifiedPlatformsCatalog,
  type CertifiedDirectoryRules,
  type CertifiedCompositeDevice,
  type CertifiedRemoteDevice,
  type CertifiedExampleNameAlias,
  type CertifiedAliases,
  type CertifiedExample,
  type CertifiedDeviceMeta,
  type CertifiedDeviceReadmeFrontmatter,
  type CertifiedDeviceReadme,
  type CertifiedDevice,
  type CertifiedDevicesJson,
} from './lib/certified-devices.types';
export {
  adaptCertifiedDevice,
  adaptCertifiedDevicesJson,
} from './lib/certified-device.adapter';
export {
  buildDeviceIdIndex,
  parseCertifiedAliases,
  resolveDeviceId,
  type DeviceIdIndex,
  type DeviceIdMatchKind,
  type DeviceIdResolution,
} from './lib/resolve-device-id';

