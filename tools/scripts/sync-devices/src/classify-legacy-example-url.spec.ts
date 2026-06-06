import { describe, expect, it } from 'vitest';
import { classifyLegacyExampleUrl } from './classify-legacy-example-url';

describe('classifyLegacyExampleUrl', () => {
  it('classifies i2c-grove-gesture-paj7620u2 examples', () => {
    expect(
      classifyLegacyExampleUrl(
        'https://r.chirimen.org/examples/#I2C-Grove-Gesture'
      )
    ).toEqual({ platform: 'chirimen', status: 'legacy' });

    expect(
      classifyLegacyExampleUrl(
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_paj7620'
      )
    ).toEqual({ platform: 'pizero-esm', status: 'primary' });
  });

  it('classifies gpio-led examples across three platforms', () => {
    expect(
      classifyLegacyExampleUrl('https://r.chirimen.org/examples/#GPIO-Blink')
    ).toEqual({ platform: 'chirimen', status: 'legacy' });

    expect(
      classifyLegacyExampleUrl(
        'https://chirimen.org/chirimen-micro-bit/examples/#GPIO1'
      )
    ).toEqual({ platform: 'microbit-driver', status: 'legacy' });

    expect(
      classifyLegacyExampleUrl(
        'https://tutorial.chirimen.org/pizero/esm-examples/#GPIO_hello-world'
      )
    ).toEqual({ platform: 'pizero-esm', status: 'primary' });
  });

  it('classifies actuator-device-1 microbit and non-esm pizero urls', () => {
    expect(
      classifyLegacyExampleUrl('https://tutorial.chirimen.org/microbit/iot_actuate')
    ).toEqual({ platform: 'microbit-driver', status: 'legacy' });

    expect(
      classifyLegacyExampleUrl('https://tutorial.chirimen.org/pizero/#gpio-2')
    ).toEqual({ platform: 'pizero-esm', status: 'primary' });
  });

  it('classifies external github urls as chirimen legacy', () => {
    expect(
      classifyLegacyExampleUrl(
        'https://github.com/SeeedDocument/Grove-Water-Level-Sensor/blob/master/water-level-sensor-demo.ino'
      )
    ).toEqual({ platform: 'chirimen', status: 'legacy' });
  });

  it('returns null for empty or unknown urls', () => {
    expect(classifyLegacyExampleUrl('')).toBeNull();
    expect(classifyLegacyExampleUrl('https://example.com/unknown')).toBeNull();
  });
});
