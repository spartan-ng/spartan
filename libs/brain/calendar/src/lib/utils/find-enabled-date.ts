import type { BrnDateAdapter } from '@spartan-ng/brain/date-time';

export interface EnabledDateBounds<T> {
	min?: T;
	max?: T;
}

/** Find the first enabled day from the target, moving in the requested direction. */
export function findEnabledDate<T>(
	start: T,
	direction: 1 | -1,
	adapter: BrnDateAdapter<T>,
	isDisabled: (date: T) => boolean,
	bounds?: EnabledDateBounds<T>,
): T | undefined {
	let date = start;
	// Allow multi-year disabled ranges, but cap searches with no far boundary.
	// Explicit calendar boundaries stop the search as soon as they are crossed.
	for (let step = 0; step < 3660; step++) {
		if (bounds?.min && adapter.isBefore(date, adapter.startOfDay(bounds.min))) return undefined;
		if (bounds?.max && adapter.isAfter(date, adapter.endOfDay(bounds.max))) return undefined;
		if (!isDisabled(date)) return date;
		date = direction === 1 ? adapter.add(date, { days: 1 }) : adapter.subtract(date, { days: 1 });
	}
	return undefined;
}

/** Find a usable initial tab stop if the requested focused day is disabled. */
export function findInitialFocusedDate<T>(
	date: T,
	adapter: BrnDateAdapter<T>,
	isDisabled: (date: T) => boolean,
	bounds?: EnabledDateBounds<T>,
): T {
	if (!isDisabled(date)) return date;
	return (
		findEnabledDate(date, 1, adapter, isDisabled, bounds) ??
		findEnabledDate(date, -1, adapter, isDisabled, bounds) ??
		date
	);
}
