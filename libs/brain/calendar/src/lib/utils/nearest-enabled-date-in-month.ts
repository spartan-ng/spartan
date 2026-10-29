import type { BrnDateAdapter } from '@spartan-ng/brain/date-time';

/**
 * Enabled day in `month` closest to `preferred`'s day-of-month.
 * Undefined when every day in the month is disabled.
 * An earlier day wins a distance tie.
 */
export function nearestEnabledDateInMonth<T>(
	month: T,
	preferred: T,
	adapter: BrnDateAdapter<T>,
	isDisabled: (date: T) => boolean,
): T | undefined {
	const preferredDay = adapter.getDate(preferred);
	let cursor = adapter.startOfMonth(month);
	const end = adapter.endOfMonth(month);
	let best: T | undefined;
	let bestDistance = Number.POSITIVE_INFINITY;

	for (let step = 0; step < 31 && !adapter.isAfter(cursor, end); step++) {
		if (!isDisabled(cursor)) {
			const distance = Math.abs(adapter.getDate(cursor) - preferredDay);
			if (distance < bestDistance) {
				best = cursor;
				bestDistance = distance;
			}
		}

		cursor = adapter.add(cursor, { days: 1 });
	}

	return best;
}
