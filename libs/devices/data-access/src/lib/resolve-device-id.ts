import type { DeviceInfo } from '@chirimen-device-dashboard/shared-types';
import type { CertifiedAliases } from './certified-devices.types';

export type DeviceIdMatchKind = 'exact' | 'case' | 'legacy' | 'alias';

export interface DeviceIdResolution {
  device: DeviceInfo;
  match: DeviceIdMatchKind;
}

export interface DeviceIdIndex {
  readonly byExact: ReadonlyMap<string, DeviceInfo>;
  readonly byCase: ReadonlyMap<string, DeviceInfo>;
  readonly byLegacy: ReadonlyMap<string, DeviceInfo>;
  readonly byAlias: ReadonlyMap<string, DeviceInfo>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeId(value: string): string {
  return value.trim().toLowerCase();
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === 'string');
}

/**
 * Best-effort parse of Certified Devices `aliases`. Invalid shapes are ignored.
 */
export function parseCertifiedAliases(
  value: unknown,
): CertifiedAliases | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const directoryRulesValue = value['directoryRules'];
  const directoryRules = isRecord(directoryRulesValue)
    ? {
        single: asString(directoryRulesValue['single']),
        composite: asString(directoryRulesValue['composite']),
        remoteSingle: asString(directoryRulesValue['remoteSingle']),
        remoteComposite: asString(directoryRulesValue['remoteComposite']),
      }
    : {
        single: '',
        composite: '',
        remoteSingle: '',
        remoteComposite: '',
      };

  const compositeDevices: CertifiedAliases['compositeDevices'] = {};
  if (isRecord(value['compositeDevices'])) {
    for (const [id, entry] of Object.entries(value['compositeDevices'])) {
      if (!isRecord(entry)) {
        continue;
      }
      compositeDevices[id] = {
        models: asStringArray(entry['models']),
        description: asString(entry['description']),
      };
    }
  }

  const remoteDevices: CertifiedAliases['remoteDevices'] = {};
  if (isRecord(value['remoteDevices'])) {
    for (const [id, entry] of Object.entries(value['remoteDevices'])) {
      if (!isRecord(entry)) {
        continue;
      }
      remoteDevices[id] = {
        baseModel: asString(entry['baseModel']),
        description: asString(entry['description']),
        ...(Array.isArray(entry['models'])
          ? { models: asStringArray(entry['models']) }
          : {}),
      };
    }
  }

  const exampleNameAliases: CertifiedAliases['exampleNameAliases'] = {};
  if (isRecord(value['exampleNameAliases'])) {
    for (const [id, entry] of Object.entries(value['exampleNameAliases'])) {
      if (!isRecord(entry)) {
        continue;
      }
      exampleNameAliases[id] = {
        directoryId: asString(entry['directoryId']),
        exampleDeviceId: asString(entry['exampleDeviceId']),
        legacyExampleNames: asStringArray(entry['legacyExampleNames']),
      };
    }
  }

  return {
    directoryRules,
    compositeDevices,
    remoteDevices,
    exampleNameAliases,
  };
}

function uniqueOrNone(
  collisions: Set<string>,
  map: Map<string, DeviceInfo>,
  key: string,
  device: DeviceInfo,
): void {
  if (!key || collisions.has(key)) {
    return;
  }
  const existing = map.get(key);
  if (existing && existing.id !== device.id) {
    map.delete(key);
    collisions.add(key);
    return;
  }
  map.set(key, device);
}

function taggedLegacyId(device: DeviceInfo): string {
  return `${device.tag.toLowerCase()}-${normalizeId(device.id)}`;
}

export function buildDeviceIdIndex(
  devices: DeviceInfo[],
  aliases?: CertifiedAliases,
): DeviceIdIndex {
  const byExact = new Map<string, DeviceInfo>();
  const byCase = new Map<string, DeviceInfo>();
  const byLegacy = new Map<string, DeviceInfo>();
  const byAlias = new Map<string, DeviceInfo>();
  const caseCollisions = new Set<string>();
  const legacyCollisions = new Set<string>();
  const aliasCollisions = new Set<string>();

  for (const device of devices) {
    if (!device.id) {
      continue;
    }
    byExact.set(device.id, device);
    uniqueOrNone(caseCollisions, byCase, normalizeId(device.id), device);
    uniqueOrNone(legacyCollisions, byLegacy, taggedLegacyId(device), device);
  }

  const devicesByExact = byExact;
  const devicesByCase = byCase;

  if (aliases) {
    for (const [canonicalId, entry] of Object.entries(
      aliases.exampleNameAliases,
    )) {
      const device =
        devicesByExact.get(canonicalId) ??
        devicesByCase.get(normalizeId(canonicalId));
      if (!device) {
        continue;
      }
      const names = [
        entry.directoryId,
        entry.exampleDeviceId,
        ...entry.legacyExampleNames,
      ];
      for (const name of names) {
        uniqueOrNone(aliasCollisions, byAlias, normalizeId(name), device);
      }
    }

    for (const [compositeId, entry] of Object.entries(
      aliases.compositeDevices,
    )) {
      const composite =
        devicesByExact.get(compositeId) ??
        devicesByCase.get(normalizeId(compositeId));
      if (!composite) {
        continue;
      }
      for (const model of entry.models) {
        const hasStandalone =
          devicesByExact.has(model) || devicesByCase.has(normalizeId(model));
        if (hasStandalone) {
          continue;
        }
        uniqueOrNone(aliasCollisions, byAlias, normalizeId(model), composite);
      }
    }
  }

  return { byExact, byCase, byLegacy, byAlias };
}

export function resolveDeviceId(
  index: DeviceIdIndex,
  requestedId: string,
): DeviceIdResolution | null {
  const trimmed = requestedId.trim();
  if (!trimmed) {
    return null;
  }

  const exact = index.byExact.get(trimmed);
  if (exact) {
    return { device: exact, match: 'exact' };
  }

  const folded = normalizeId(trimmed);
  const caseMatch = index.byCase.get(folded);
  if (caseMatch) {
    return { device: caseMatch, match: 'case' };
  }

  const legacy = index.byLegacy.get(folded);
  if (legacy) {
    return { device: legacy, match: 'legacy' };
  }

  const alias = index.byAlias.get(folded);
  if (alias) {
    return { device: alias, match: 'alias' };
  }

  return null;
}
