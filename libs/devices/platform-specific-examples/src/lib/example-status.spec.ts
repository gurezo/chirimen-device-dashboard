import { describe, expect, it } from 'vitest';
import {
  compareExampleStatus,
  getExampleStatusClasses,
  getExampleStatusLabel,
} from './example-status';

describe('example-status', () => {
  it('should return status labels', () => {
    expect(getExampleStatusLabel('primary')).toBe('primary');
    expect(getExampleStatusLabel('legacy')).toBe('legacy');
    expect(getExampleStatusLabel('archive')).toBe('archive');
  });

  it('should compare statuses by priority order', () => {
    expect(compareExampleStatus('primary', 'legacy')).toBeLessThan(0);
    expect(compareExampleStatus('legacy', 'archive')).toBeLessThan(0);
    expect(compareExampleStatus('archive', 'incubator')).toBeLessThan(0);
    expect(compareExampleStatus('incubator', 'special')).toBeLessThan(0);
    expect(compareExampleStatus('primary', 'primary')).toBe(0);
    expect(compareExampleStatus('archive', 'primary')).toBeGreaterThan(0);
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
