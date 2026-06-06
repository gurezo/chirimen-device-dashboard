import type { ExampleStatus } from '@chirimen-device-dashboard/shared-types';

export type LegacyExampleClassification = {
  platform: string;
  status: ExampleStatus;
};

type UrlRule = {
  test: (url: string) => boolean;
  platform: string;
  status: ExampleStatus;
};

const URL_RULES: UrlRule[] = [
  {
    test: (url) => /tutorial\.chirimen\.org\/pizero\/esm-examples/i.test(url),
    platform: 'pizero-esm',
    status: 'primary',
  },
  {
    test: (url) => /tutorial\.chirimen\.org\/pizero\//i.test(url),
    platform: 'pizero-esm',
    status: 'primary',
  },
  {
    test: (url) => /r\.chirimen\.org\/examples/i.test(url),
    platform: 'chirimen',
    status: 'legacy',
  },
  {
    test: (url) => /chirimen\.org\/chirimen\/gc\/top\/examples/i.test(url),
    platform: 'chirimen',
    status: 'legacy',
  },
  {
    test: (url) => /tutorial\.chirimen\.org\/raspi/i.test(url),
    platform: 'chirimen',
    status: 'legacy',
  },
  {
    test: (url) =>
      /chirimen\.org\/chirimen-micro-bit\/examples/i.test(url),
    platform: 'microbit-driver',
    status: 'legacy',
  },
  {
    test: (url) => /tutorial\.chirimen\.org\/microbit/i.test(url),
    platform: 'microbit-driver',
    status: 'legacy',
  },
  {
    test: (url) => /chirimen\.org\/examples/i.test(url),
    platform: 'chirimen',
    status: 'legacy',
  },
  {
    test: (url) => /github\.com/i.test(url),
    platform: 'chirimen',
    status: 'legacy',
  },
];

export function classifyLegacyExampleUrl(
  codeUrl: string
): LegacyExampleClassification | null {
  const normalized = codeUrl.trim();
  if (!normalized) {
    return null;
  }

  for (const rule of URL_RULES) {
    if (rule.test(normalized)) {
      return { platform: rule.platform, status: rule.status };
    }
  }

  return null;
}
