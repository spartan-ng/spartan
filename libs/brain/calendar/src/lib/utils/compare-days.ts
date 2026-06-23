import type { BrnDateAdapter } from '@spartan-ng/brain/date-time';

export const compareDays = <T>(a: T[], b: T[], dateAdapter: BrnDateAdapter<T>): boolean => {
	if (a === b) return true;
	if (!a || !b) return false;
	if (a.length !== b.length) return false;
	return a.every((day, i) => dateAdapter.isSameDay(day, b[i]));
};
