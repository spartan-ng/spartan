import { BrnNativeDateAdapter } from '@spartan-ng/brain/date-time';
import { findEnabledDate, findInitialFocusedDate } from './find-enabled-date';

describe('enabled calendar focus', () => {
	const adapter = new BrnNativeDateAdapter();
	const weekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

	it('skips closed weekends in both directions', () => {
		expect(findEnabledDate(new Date(2026, 8, 19), 1, adapter, weekend)).toEqual(new Date(2026, 8, 21));
		expect(findEnabledDate(new Date(2026, 8, 20), -1, adapter, weekend)).toEqual(new Date(2026, 8, 18));
	});

	it('does not start keyboard focus on a disabled date', () => {
		expect(findInitialFocusedDate(new Date(2026, 8, 19), adapter, weekend)).toEqual(new Date(2026, 8, 21));
	});

	it('moves back when min/max leave no available forward date', () => {
		const max = new Date(2026, 8, 19);
		const blocked = (date: Date) => weekend(date) || adapter.isAfter(date, max);
		expect(findInitialFocusedDate(max, adapter, blocked)).toEqual(new Date(2026, 8, 18));
	});

	it('stops searching if every date is disabled', () => {
		const start = new Date(2026, 8, 19);
		expect(findEnabledDate(start, 1, adapter, () => true)).toBeUndefined();
		expect(findInitialFocusedDate(start, adapter, () => true)).toEqual(start);
	});
});
