import { LunarDate } from './lunar-date';
import { BrnLunarDateAdapter } from './lunar-date-adapter';
import { LunarDateMath } from './lunar-date-math';

describe('BrnLunarDateAdapter', () => {
	const adapter = new BrnLunarDateAdapter();

	// Tabular Islamic calendar reference dates (EPOCH_JDN = 1948437):
	// 1 Muharram 1 AH     = 622-07-16
	// 1 Muharram 1445 AH  = 2023-07-19
	// 1 Muharram 1446 AH  = 2024-07-05
	// 1 Ramadan 1445 AH   = 2024-03-11
	// 10 Muharram 1446 AH = 2024-07-14

	const muharram11446 = new LunarDate(1446, 1, 1);

	test('now() should return the current lunar date', () => {
		const fixed = new Date(2024, 6, 5);
		vi.useFakeTimers().setSystemTime(fixed);
		try {
			const now = adapter.now();
			expect(now.year).toBe(1446);
			expect(now.month).toBe(1);
			expect(now.day).toBe(1);
			expect(now.valueOf()).toBe(fixed.getTime());
		} finally {
			vi.useRealTimers();
		}
	});

	test('create() should create a LunarDate from values', () => {
		const date = adapter.create({ year: 1446, month: 0, day: 1 });
		expect(date.year).toBe(1446);
		expect(date.month).toBe(1);
		expect(date.day).toBe(1);
	});

	test('create() should default missing fields to now', () => {
		const date = adapter.create({});
		expect(date.year).toBeGreaterThan(1300);
		expect(date.month).toBeGreaterThanOrEqual(1);
		expect(date.day).toBeGreaterThanOrEqual(1);
	});

	test('set() should update year', () => {
		const result = adapter.set(muharram11446, { year: 1447 });
		expect(result.year).toBe(1447);
		expect(result.month).toBe(1);
		expect(result.day).toBe(1);
	});

	test('set() should update month (0-indexed)', () => {
		const result = adapter.set(muharram11446, { month: 8 });
		expect(result.year).toBe(1446);
		expect(result.month).toBe(9);
		expect(result.day).toBe(1);
	});

	test('set() should update day', () => {
		const result = adapter.set(muharram11446, { day: 10 });
		expect(result.year).toBe(1446);
		expect(result.month).toBe(1);
		expect(result.day).toBe(10);
	});

	test('set() should clamp day to month max when overflow', () => {
		const dateInRajab = new LunarDate(1446, 7, 30);
		const result = adapter.set(dateInRajab, { month: 5 });
		expect(result.month).toBe(6);
		expect(result.day).toBe(29);
	});

	test('add() should add days across month boundary', () => {
		const result = adapter.add(muharram11446, { days: 30 });
		expect(result.year).toBe(1446);
		expect(result.month).toBe(2);
		expect(result.day).toBe(1);
	});

	test('add() should add months', () => {
		const result = adapter.add(muharram11446, { months: 1 });
		expect(result.year).toBe(1446);
		expect(result.month).toBe(2);
	});

	test('add() should add years', () => {
		const result = adapter.add(muharram11446, { years: 2 });
		expect(result.year).toBe(1448);
		expect(result.month).toBe(1);
		expect(result.day).toBe(1);
	});

	test('add() should wrap across year boundary', () => {
		const date = new LunarDate(1446, 12, 28);
		const result = adapter.add(date, { days: 5 });
		expect(result.year).toBe(1447);
		expect(result.month).toBe(1);
		expect(result.day).toBe(4);
	});

	test('subtract() should subtract days', () => {
		const date = new LunarDate(1446, 2, 1);
		const result = adapter.subtract(date, { days: 1 });
		expect(result.year).toBe(1446);
		expect(result.month).toBe(1);
		expect(result.day).toBe(30);
	});

	test('subtract() should wrap across year boundary', () => {
		const result = adapter.subtract(muharram11446, { days: 1 });
		expect(result.year).toBe(1445);
		expect(result.month).toBe(12);
		expect(result.day).toBe(30);
	});

	test('compare() should compare two lunar dates', () => {
		const later = new LunarDate(1446, 6, 1);
		expect(adapter.compare(muharram11446, later)).toBe(-1);
		expect(adapter.compare(later, muharram11446)).toBe(1);
		expect(adapter.compare(muharram11446, muharram11446)).toBe(0);
	});

	test('isEqual() should check if two dates are equal', () => {
		const a = new LunarDate(1446, 1, 1);
		const b = new LunarDate(1446, 1, 1);
		const c = new LunarDate(1446, 1, 2);
		expect(adapter.isEqual(a, b)).toBe(true);
		expect(adapter.isEqual(a, c)).toBe(false);
	});

	test('isBefore() should check if a date is before another', () => {
		const a = new LunarDate(1446, 1, 1);
		const b = new LunarDate(1446, 1, 2);
		expect(adapter.isBefore(a, b)).toBe(true);
		expect(adapter.isBefore(b, a)).toBe(false);
	});

	test('isAfter() should check if a date is after another', () => {
		const a = new LunarDate(1446, 1, 1);
		const b = new LunarDate(1445, 12, 29);
		expect(adapter.isAfter(a, b)).toBe(true);
		expect(adapter.isAfter(b, a)).toBe(false);
	});

	test('isSameDay() should check if two dates are on the same day', () => {
		const a = new LunarDate(1446, 1, 1);
		const b = new LunarDate(1446, 1, 1);
		const c = new LunarDate(1446, 1, 2);
		expect(adapter.isSameDay(a, b)).toBe(true);
		expect(adapter.isSameDay(a, c)).toBe(false);
	});

	test('getYear() should return the lunar year', () => {
		expect(adapter.getYear(muharram11446)).toBe(1446);
	});

	test('getMonth() should return 0-indexed lunar month', () => {
		expect(adapter.getMonth(muharram11446)).toBe(0);
		expect(adapter.getMonth(new LunarDate(1446, 12, 1))).toBe(11);
	});

	test('getDate() should return the day of month', () => {
		expect(adapter.getDate(muharram11446)).toBe(1);
		expect(adapter.getDate(new LunarDate(1446, 1, 30))).toBe(30);
	});

	test('getDay() should return day of week (0=Sunday)', () => {
		const known = LunarDateMath.lunarToGregorian(1446, 1, 1);
		const expectedDow = new Date(known[0], known[1] - 1, known[2]).getDay();
		expect(adapter.getDay(muharram11446)).toBe(expectedDow);
	});

	test('getTime() should return timestamp', () => {
		const [gy, gm, gd] = LunarDateMath.lunarToGregorian(1446, 1, 1);
		const expected = new Date(gy, gm - 1, gd).getTime();
		expect(adapter.getTime(muharram11446)).toBe(expected);
	});

	test('startOfMonth() should return the first day of the month', () => {
		const date = new LunarDate(1446, 6, 15);
		const start = adapter.startOfMonth(date);
		expect(start.year).toBe(1446);
		expect(start.month).toBe(6);
		expect(start.day).toBe(1);
	});

	test('endOfMonth() should return the last day of the month', () => {
		const date = new LunarDate(1446, 6, 15);
		const end = adapter.endOfMonth(date);
		expect(end.year).toBe(1446);
		expect(end.month).toBe(6);
		expect(end.day).toBe(29);

		const muharramEnd = adapter.endOfMonth(muharram11446);
		expect(muharramEnd.year).toBe(1446);
		expect(muharramEnd.month).toBe(1);
		expect(muharramEnd.day).toBe(30);
	});

	test('isSameMonth() should check if two dates are in the same lunar month', () => {
		const a = new LunarDate(1446, 1, 10);
		const b = new LunarDate(1446, 1, 15);
		const c = new LunarDate(1446, 2, 10);
		expect(adapter.isSameMonth(a, b)).toBe(true);
		expect(adapter.isSameMonth(a, c)).toBe(false);
	});

	test('isSameYear() should check if two dates are in the same lunar year', () => {
		const a = new LunarDate(1446, 1, 10);
		const b = new LunarDate(1446, 12, 15);
		const c = new LunarDate(1447, 1, 10);
		expect(adapter.isSameYear(a, b)).toBe(true);
		expect(adapter.isSameYear(a, c)).toBe(false);
	});

	test('startOfDay() should return the same date', () => {
		const result = adapter.startOfDay(muharram11446);
		expect(result).toBe(muharram11446);
	});

	test('endOfDay() should return the same date', () => {
		const result = adapter.endOfDay(muharram11446);
		expect(result).toBe(muharram11446);
	});

	test('getHours() should return 0', () => {
		expect(adapter.getHours(muharram11446)).toBe(0);
	});

	test('getMinutes() should return 0', () => {
		expect(adapter.getMinutes(muharram11446)).toBe(0);
	});

	test('getSeconds() should return 0', () => {
		expect(adapter.getSeconds(muharram11446)).toBe(0);
	});

	test('getMilliseconds() should return 0', () => {
		expect(adapter.getMilliseconds(muharram11446)).toBe(0);
	});

	test('add() with months should wrap across year boundary', () => {
		const date = new LunarDate(1446, 12, 1);
		const result = adapter.add(date, { months: 1 });
		expect(result.year).toBe(1447);
		expect(result.month).toBe(1);
		expect(result.day).toBe(1);
	});

	test('subtract() with months should wrap across year boundary', () => {
		const result = adapter.subtract(muharram11446, { months: 1 });
		expect(result.year).toBe(1445);
		expect(result.month).toBe(12);
		expect(result.day).toBe(1);
	});

	test('add() with days should handle month boundaries correctly', () => {
		const muharramEnd = new LunarDate(1446, 1, 30);
		const result = adapter.add(muharramEnd, { days: 1 });
		expect(result.month).toBe(2);
		expect(result.day).toBe(1);
	});

	test('subtract() with 12 months should not produce month 13', () => {
		const result = adapter.subtract(muharram11446, { months: 12 });
		expect(result.year).toBe(1445);
		expect(result.month).toBe(1);
		expect(result.day).toBe(1);
	});

	test('valueOf() should return correct timestamp for known date', () => {
		const [gy, gm, gd] = LunarDateMath.lunarToGregorian(1446, 1, 1);
		const expected = new Date(gy, gm - 1, gd).getTime();
		expect(muharram11446.valueOf()).toBe(expected);
	});
});
