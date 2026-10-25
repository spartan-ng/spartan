import type { BrnDateAdapter } from '@spartan-ng/brain/date-time';

/** Find the first enabled day from the target, moving in the requested direction. */
export function findEnabledDate<T>(
	start: T,
	direction: 1 | -1,
	adapter: BrnDateAdapter<T>,
	isDisabled: (date: T) => boolean,
): T | undefined {
	let date = start;
	// Stop after a year if the caller disables every day.
	for (let step = 0; step < 366; step++) {
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
): T {
	if (!isDisabled(date)) return date;
	return findEnabledDate(date, 1, adapter, isDisabled) ?? findEnabledDate(date, -1, adapter, isDisabled) ?? date;
}
