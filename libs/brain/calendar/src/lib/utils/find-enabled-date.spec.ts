import { BrnNativeDateAdapter } from '@spartan-ng/brain/date-time';
import { findEnabledDate, findInitialFocusedDate } from './find-enabled-date';

describe('enabled calendar focus', () => {
	const adapter = new BrnNativeDateAdapter();
	const weekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

	it('skips closed weekends in both directions', () => {
		expect(findEnabledDate(new Date(2026, 8, 19), 1, adapter, weekend)).toEqual(new Date(2026, 8, 21));
		expect(findEnabledDate(new Date(2026, 8, 20), -1, adapter, weekend)).toEqual(new Date(2026, 8, 18));
	});

	it('searches inward to the first enabled day when a boundary is inside the month', () => {
		const min = new Date(2026, 8, 10);
		const max = new Date(2026, 8, 18);
		expect(findEnabledDate(new Date(2026, 8, 1), 1, adapter, () => false, { min })).toEqual(min);
		expect(findEnabledDate(new Date(2026, 8, 30), -1, adapter, () => false, { max })).toEqual(max);
	});

	it('stops at a boundary when the search moves away from the allowed range', () => {
		const min = new Date(2026, 8, 10);
		const max = new Date(2026, 8, 18);
		expect(findEnabledDate(new Date(2026, 8, 1), -1, adapter, () => false, { min })).toBeUndefined();
		expect(findEnabledDate(new Date(2026, 8, 30), 1, adapter, () => false, { max })).toBeUndefined();
	});
	it('does not start keyboard focus on a disabled date', () => {
		expect(findInitialFocusedDate(new Date(2026, 8, 19), adapter, weekend)).toEqual(new Date(2026, 8, 21));
	});

	it('moves back when min/max leave no available forward date', () => {
		const max = new Date(2026, 8, 19);
		const blocked = (date: Date) => weekend(date) || adapter.isAfter(date, max);
		expect(findInitialFocusedDate(max, adapter, blocked)).toEqual(new Date(2026, 8, 18));
	});

	it('searches past a full year of disabled dates inside the allowed range', () => {
		const start = new Date(2026, 8, 19);
		const min = start;
		const firstAvailable = new Date(2028, 0, 1);
		const blocked = (date: Date) =>
			adapter.isBefore(date, min) || adapter.isBefore(date, firstAvailable);
		expect(findInitialFocusedDate(start, adapter, blocked, { min })).toEqual(firstAvailable);
	});

	it('returns no result at the end of a bounded disabled range', () => {
		const min = new Date(2026, 8, 19);
		const max = new Date(2026, 8, 21);
		expect(findEnabledDate(min, 1, adapter, () => true, { min, max })).toBeUndefined();
	});

	it('stops searching if every date is disabled', () => {
		const start = new Date(2026, 8, 19);
		expect(findEnabledDate(start, 1, adapter, () => true)).toBeUndefined();
		expect(findInitialFocusedDate(start, adapter, () => true)).toEqual(start);
	});
});
