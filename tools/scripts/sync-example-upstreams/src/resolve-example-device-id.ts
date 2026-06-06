import { tryValidateExampleDeviceId } from './validate-example-device-id';

const LEGACY_GC_PREFIXES = ['i2c-', 'gpio-'] as const;

function normalizeLegacyGcName(dirName: string): string | null {
  const lower = dirName.toLowerCase();
  for (const prefix of LEGACY_GC_PREFIXES) {
    if (lower.startsWith(prefix)) {
      const stripped = lower.slice(prefix.length);
      return tryValidateExampleDeviceId(stripped);
    }
  }
  return null;
}

export function resolveExampleDeviceId(
  upstreamDirName: string
): string | null {
  const direct = tryValidateExampleDeviceId(upstreamDirName);
  if (direct) {
    return direct;
  }

  const lower = upstreamDirName.toLowerCase();
  const fromLower = tryValidateExampleDeviceId(lower);
  if (fromLower) {
    return fromLower;
  }

  return normalizeLegacyGcName(upstreamDirName);
}
