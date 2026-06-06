import { describe, expect, it } from 'vitest';
import {
  getExampleStatusClasses,
  getExampleStatusLabel,
} from './example-status';

describe('example-status', () => {
  it('should return status labels', () => {
    expect(getExampleStatusLabel('primary')).toBe('primary');
    expect(getExampleStatusLabel('legacy')).toBe('legacy');
    expect(getExampleStatusLabel('archive')).toBe('archive');
  });

  it('should return badge classes for each status', () => {
    for (const status of [
      'primary',
      'legacy',
      'archive',
      'special',
      'incubator',
    ] as const) {
      const classes = getExampleStatusClasses(status);
      expect(classes).toContain('rounded-md');
      expect(classes).toContain('font-medium');
    }
  });
});
