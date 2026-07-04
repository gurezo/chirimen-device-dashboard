import { describe, expect, it } from 'vitest';
import {
  buildCircuitBlobUrl,
  buildExampleUrls,
  buildLocalPath,
  buildUpstreamPath,
  buildUpstreamPathUrl,
  buildUpstreamRepositoryUrl,
  defaultHardwareForPlatform,
  mapPriorityToStatus,
} from './build-example-urls';

describe('buildExampleUrls', () => {
  it('builds repository and path urls', () => {
    expect(buildUpstreamRepositoryUrl('chirimen-oh/chirimen.org')).toBe(
      'https://github.com/chirimen-oh/chirimen.org'
    );
    expect(
      buildUpstreamPathUrl(
        'chirimen-oh/chirimen.org',
        'pizero/src/esm-examples/adt7410'
      )
    ).toBe(
      'https://github.com/chirimen-oh/chirimen.org/tree/master/pizero/src/esm-examples/adt7410'
    );
  });

  it('builds circuit blob url when filename provided', () => {
    expect(
      buildCircuitBlobUrl(
        'chirimen-oh/chirimen-drivers',
        'microbit-examples/adt7410',
        'imgs/pinbit_adt7410.png'
      )
    ).toBe(
      'https://github.com/chirimen-oh/chirimen-drivers/blob/master/microbit-examples/adt7410/imgs/pinbit_adt7410.png'
    );
  });

  it('builds full example urls object', () => {
    const urls = buildExampleUrls(
      'chirimen-oh/chirimen-drivers',
      'microbit-examples/adt7410',
      'master',
      'imgs/pinbit_adt7410.png'
    );
    expect(urls.upstreamRepositoryUrl).toContain('chirimen-drivers');
    expect(urls.upstreamPathUrl).toContain('/tree/master/');
    expect(urls.circuitUrl).toContain('/blob/master/');
  });

  it('leaves circuitUrl empty when no filename', () => {
    const urls = buildExampleUrls(
      'chirimen-oh/chirimen',
      'gc/i2c/i2c-adt7410',
      'master'
    );
    expect(urls.circuitUrl).toBe('');
  });
});

describe('buildUpstreamPath', () => {
  it('joins source path and dir name', () => {
    expect(buildUpstreamPath('microbit-examples', 'adt7410')).toBe(
      'microbit-examples/adt7410'
    );
  });

  it('uses dir name only when source path is root', () => {
    expect(buildUpstreamPath('.', 'some-device')).toBe('some-device');
  });
});

describe('buildLocalPath', () => {
  it('builds catalog-compatible local path', () => {
    expect(buildLocalPath('adt7410', 'pizero-esm')).toBe(
      'examples/devices/adt7410/platforms/pizero-esm'
    );
  });
});

describe('mapPriorityToStatus', () => {
  it('maps valid priority values', () => {
    expect(mapPriorityToStatus('primary')).toBe('primary');
    expect(mapPriorityToStatus('archive')).toBe('archive');
  });

  it('falls back to legacy for unknown priority', () => {
    expect(mapPriorityToStatus('unknown')).toBe('legacy');
  });
});

describe('defaultHardwareForPlatform', () => {
  it('returns known hardware label', () => {
    expect(defaultHardwareForPlatform('pizero-esm')).toBe('Pi Zero');
  });

  it('returns platform id for unknown platform', () => {
    expect(defaultHardwareForPlatform('custom-platform')).toBe(
      'custom-platform'
    );
  });
});
