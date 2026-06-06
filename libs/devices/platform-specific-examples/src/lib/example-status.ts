import type { ExampleStatus } from '@chirimen-device-dashboard/shared-types';

const STATUS_LABELS: Record<ExampleStatus, string> = {
  primary: 'primary',
  legacy: 'legacy',
  archive: 'archive',
  special: 'special',
  incubator: 'incubator',
};

const STATUS_CLASSES: Record<ExampleStatus, string> = {
  primary:
    'bg-[rgba(25,118,210,0.12)] text-[#1565c0] dark:bg-[rgba(66,165,245,0.16)] dark:text-[#90caf9]',
  legacy:
    'bg-[rgba(245,124,0,0.12)] text-[#e65100] dark:bg-[rgba(255,183,77,0.16)] dark:text-[#ffcc80]',
  archive:
    'bg-black/6 text-black/60 dark:bg-white/10 dark:text-white/60',
  special:
    'bg-[rgba(123,31,162,0.12)] text-[#6a1b9a] dark:bg-[rgba(186,104,200,0.16)] dark:text-[#ce93d8]',
  incubator:
    'bg-[rgba(46,125,50,0.12)] text-[#2e7d32] dark:bg-[rgba(102,187,106,0.16)] dark:text-[#a5d6a7]',
};

const BADGE_BASE =
  'inline-flex text-[0.75rem] font-medium py-1 px-2.5 rounded-md whitespace-nowrap';

const STATUS_SORT_ORDER: Record<ExampleStatus, number> = {
  primary: 0,
  legacy: 1,
  archive: 2,
  incubator: 3,
  special: 4,
};

export function compareExampleStatus(
  a: ExampleStatus,
  b: ExampleStatus,
): number {
  return STATUS_SORT_ORDER[a] - STATUS_SORT_ORDER[b];
}

export function getExampleStatusLabel(status: ExampleStatus): string {
  return STATUS_LABELS[status];
}

export function getExampleStatusClasses(status: ExampleStatus): string {
  return `${BADGE_BASE} ${STATUS_CLASSES[status]}`;
}
