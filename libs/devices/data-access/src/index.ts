export {
  type DeviceRepository,
  DEVICE_REPOSITORY,
} from './lib/device.repository';
export { JsonDeviceRepository } from './lib/json-device.repository';
export { provideDeviceRepository } from './lib/providers';
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

