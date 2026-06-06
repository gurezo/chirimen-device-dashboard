const DEVICE_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateExampleDeviceId(deviceId: string): void {
  if (!deviceId) {
    throw new Error('deviceId is required');
  }

  if (deviceId.includes('_')) {
    throw new Error(
      `Invalid deviceId "${deviceId}": underscores are not allowed (e.g. use "${deviceId.replace(/_/g, '-')}" instead)`
    );
  }

  if (!DEVICE_ID_PATTERN.test(deviceId)) {
    throw new Error(
      `Invalid deviceId "${deviceId}": must be lowercase alphanumeric with optional hyphens`
    );
  }
}

export function tryValidateExampleDeviceId(deviceId: string): string | null {
  try {
    validateExampleDeviceId(deviceId);
    return deviceId;
  } catch {
    return null;
  }
}
