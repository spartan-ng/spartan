import { JalaliDate } from './jalali-date';
import { BrnJalaliDateAdapter } from './jalali-date-adapter';

describe('BrnJalaliDateAdapter', () => {
	const adapter = new BrnJalaliDateAdapter();

	// Known conversions:
	// 1400/1/1  = 2021-03-21 (Nowruz, Sunday)
	// 1400/6/31 = 2021-09-22 (last day of Shahrivar)
	// 1400/12/29 = 2022-03-20 (last day of non-leap year)
	// 1403/12/30 = 2025-03-20 (leap year, Esfand has 30)
	// 1399/12/30 = 2021-03-20 (leap year)

	const nowruz1400 = new JalaliDate(1400, 1, 1);

	test('now() should return the current Jalali date', () => {
		const now = adapter.now();
		const g = new Date();
		const expected = new Date(g.getFullYear(), g.getMonth(), g.getDate()).getTime();
		expect(now.valueOf()).toBeCloseTo(expected, -3);
		expect(now.year).toBeGreaterThan(1300);
	});

	test('create() should create a JalaliDate from values', () => {
		const date = adapter.create({ year: 1400, month: 0, day: 1 });
		expect(date.year).toBe(1400);
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
		const result = adapter.set(nowruz1400, { year: 1405 });
		expect(result.year).toBe(1405);
		expect(result.month).toBe(1);
		expect(result.day).toBe(1);
	});

	test('set() should update month (0-indexed)', () => {
		const result = adapter.set(nowruz1400, { month: 6 });
		expect(result.year).toBe(1400);
		expect(result.month).toBe(7);
		expect(result.day).toBe(1);
	});

	test('set() should update day', () => {
		const result = adapter.set(nowruz1400, { day: 15 });
		expect(result.year).toBe(1400);
		expect(result.month).toBe(1);
		expect(result.day).toBe(15);
	});

	test('set() should clamp day to month max when overflow', () => {
		// Esfand (month 12) in 1400 has 29 days (non-leap)
		const dateInBahman = new JalaliDate(1400, 11, 30);
		const result = adapter.set(dateInBahman, { month: 11 }); // 0-indexed 11 = Esfand
		expect(result.month).toBe(12);
		expect(result.day).toBe(29); // clamped from 30 to 29
	});

	test('add() should add days across month boundary', () => {
		// 1400/1/1 + 31 days = 1400/2/1 (Farvardin has 31 days)
		const result = adapter.add(nowruz1400, { days: 31 });
		expect(result.year).toBe(1400);
		expect(result.month).toBe(2);
		expect(result.day).toBe(1);
	});

	test('add() should add months', () => {
		const result = adapter.add(nowruz1400, { months: 1 });
		expect(result.year).toBe(1400);
		expect(result.month).toBe(2);
	});

	test('add() should add years', () => {
		const result = adapter.add(nowruz1400, { years: 5 });
		expect(result.year).toBe(1405);
		expect(result.month).toBe(1);
		expect(result.day).toBe(1);
	});

	test('add() should wrap across year boundary', () => {
		// 1400/12/1 + 29 days = 1401/1/1 (Esfand has 29 days in non-leap 1400)
		const date = new JalaliDate(1400, 12, 1);
		const result = adapter.add(date, { days: 29 });
		expect(result.year).toBe(1401);
		expect(result.month).toBe(1);
		expect(result.day).toBe(1);
	});

	test('subtract() should subtract days', () => {
		// 1400/2/1 - 1 day = 1400/1/31
		const date = new JalaliDate(1400, 2, 1);
		const result = adapter.subtract(date, { days: 1 });
		expect(result.year).toBe(1400);
		expect(result.month).toBe(1);
		expect(result.day).toBe(31);
	});

	test('subtract() should wrap across year boundary', () => {
		// 1400/1/1 - 1 day = 1399/12/30 (1399 is leap)
		const result = adapter.subtract(nowruz1400, { days: 1 });
		expect(result.year).toBe(1399);
		expect(result.month).toBe(12);
		expect(result.day).toBe(30);
	});

	test('compare() should compare two Jalali dates', () => {
		const later = new JalaliDate(1400, 6, 1);
		expect(adapter.compare(nowruz1400, later)).toBe(-1);
		expect(adapter.compare(later, nowruz1400)).toBe(1);
		expect(adapter.compare(nowruz1400, nowruz1400)).toBe(0);
	});

	test('isEqual() should check if two dates are equal', () => {
		const a = new JalaliDate(1400, 1, 1);
		const b = new JalaliDate(1400, 1, 1);
		const c = new JalaliDate(1400, 1, 2);
		expect(adapter.isEqual(a, b)).toBe(true);
		expect(adapter.isEqual(a, c)).toBe(false);
	});

	test('isBefore() should check if a date is before another', () => {
		const a = new JalaliDate(1400, 1, 1);
		const b = new JalaliDate(1400, 1, 2);
		expect(adapter.isBefore(a, b)).toBe(true);
		expect(adapter.isBefore(b, a)).toBe(false);
	});

	test('isAfter() should check if a date is after another', () => {
		const a = new JalaliDate(1400, 1, 1);
		const b = new JalaliDate(1399, 12, 30);
		expect(adapter.isAfter(a, b)).toBe(true);
		expect(adapter.isAfter(b, a)).toBe(false);
	});

	test('isSameDay() should check if two dates are on the same day', () => {
		const a = new JalaliDate(1400, 1, 1);
		const b = new JalaliDate(1400, 1, 1);
		const c = new JalaliDate(1400, 1, 2);
		expect(adapter.isSameDay(a, b)).toBe(true);
		expect(adapter.isSameDay(a, c)).toBe(false);
	});

	test('getYear() should return the Jalali year', () => {
		expect(adapter.getYear(nowruz1400)).toBe(1400);
	});

	test('getMonth() should return 0-indexed Jalali month', () => {
		expect(adapter.getMonth(nowruz1400)).toBe(0);
		expect(adapter.getMonth(new JalaliDate(1400, 12, 1))).toBe(11);
	});

	test('getDate() should return the day of month', () => {
		expect(adapter.getDate(nowruz1400)).toBe(1);
		expect(adapter.getDate(new JalaliDate(1400, 1, 31))).toBe(31);
	});

	test('getDay() should return day of week (0=Sunday) for Jalali dates', () => {
		// 1400/1/1 = 2021-03-21 = Sunday = 0
		expect(adapter.getDay(nowruz1400)).toBe(0);
		// 1400/1/2 = Monday = 1
		const day2 = new JalaliDate(1400, 1, 2);
		expect(adapter.getDay(day2)).toBe(1);
	});

	test('getTime() should return timestamp', () => {
		const time = adapter.getTime(nowruz1400);
		const expected = new Date(2021, 2, 21).getTime();
		expect(time).toBe(expected);
	});

	test('startOfMonth() should return the first day of the month', () => {
		const date = new JalaliDate(1400, 6, 15);
		const start = adapter.startOfMonth(date);
		expect(start.year).toBe(1400);
		expect(start.month).toBe(6);
		expect(start.day).toBe(1);
	});

	test('endOfMonth() should return the last day of the month', () => {
		// Months 1-6 have 31 days
		const date = new JalaliDate(1400, 6, 15);
		const end = adapter.endOfMonth(date);
		expect(end.year).toBe(1400);
		expect(end.month).toBe(6);
		expect(end.day).toBe(31);

		// Month 12 (Esfand) in non-leap year has 29 days
		const esfand = new JalaliDate(1401, 12, 1);
		const endEsfand = adapter.endOfMonth(esfand);
		expect(endEsfand.year).toBe(1401);
		expect(endEsfand.month).toBe(12);
		expect(endEsfand.day).toBe(29);

		// Month 12 in leap year has 30 days
		const esfandLeap = new JalaliDate(1403, 12, 1);
		const endLeap = adapter.endOfMonth(esfandLeap);
		expect(endLeap.day).toBe(30);
	});

	test('isSameMonth() should check if two dates are in the same Jalali month', () => {
		const a = new JalaliDate(1400, 1, 10);
		const b = new JalaliDate(1400, 1, 15);
		const c = new JalaliDate(1400, 2, 10);
		expect(adapter.isSameMonth(a, b)).toBe(true);
		expect(adapter.isSameMonth(a, c)).toBe(false);
	});

	test('isSameYear() should check if two dates are in the same Jalali year', () => {
		const a = new JalaliDate(1400, 1, 10);
		const b = new JalaliDate(1400, 12, 15);
		const c = new JalaliDate(1401, 1, 10);
		expect(adapter.isSameYear(a, b)).toBe(true);
		expect(adapter.isSameYear(a, c)).toBe(false);
	});

	test('startOfDay() should return the same date', () => {
		const result = adapter.startOfDay(nowruz1400);
		expect(result).toBe(nowruz1400);
	});

	test('endOfDay() should return the same date', () => {
		const result = adapter.endOfDay(nowruz1400);
		expect(result).toBe(nowruz1400);
	});

	test('getHours() should return 0', () => {
		expect(adapter.getHours(nowruz1400)).toBe(0);
	});

	test('getMinutes() should return 0', () => {
		expect(adapter.getMinutes(nowruz1400)).toBe(0);
	});

	test('getSeconds() should return 0', () => {
		expect(adapter.getSeconds(nowruz1400)).toBe(0);
	});

	test('getMilliseconds() should return 0', () => {
		expect(adapter.getMilliseconds(nowruz1400)).toBe(0);
	});

	test('add() with months should wrap across year boundary', () => {
		const date = new JalaliDate(1400, 12, 1);
		const result = adapter.add(date, { months: 1 });
		expect(result.year).toBe(1401);
		expect(result.month).toBe(1);
		expect(result.day).toBe(1);
	});

	test('subtract() with months should wrap across year boundary', () => {
		const result = adapter.subtract(nowruz1400, { months: 1 });
		expect(result.year).toBe(1399);
		expect(result.month).toBe(12);
		expect(result.day).toBe(1);
	});

	test('add() with days should handle month boundaries correctly', () => {
		// Tir (month 4) has 31 days, Mordad (month 5) has 31 days
		// 1400/4/31 + 1 day = 1400/5/1
		const tirEnd = new JalaliDate(1400, 4, 31);
		const result = adapter.add(tirEnd, { days: 1 });
		expect(result.month).toBe(5);
		expect(result.day).toBe(1);
	});

	test('subtract() with 12 months should not produce month 13', () => {
		// Edge case: subtracting exactly 12 months from month 1
		const result = adapter.subtract(nowruz1400, { months: 12 });
		expect(result.year).toBe(1399);
		expect(result.month).toBe(1);
		expect(result.day).toBe(1);
	});

	test('subtract() with 24 months should wrap correctly', () => {
		const result = adapter.subtract(nowruz1400, { months: 24 });
		expect(result.year).toBe(1398);
		expect(result.month).toBe(1);
		expect(result.day).toBe(1);
	});

	test('add() with 12 months should not produce month 13', () => {
		const result = adapter.add(nowruz1400, { months: 12 });
		expect(result.year).toBe(1401);
		expect(result.month).toBe(1);
		expect(result.day).toBe(1);
	});

	test('valueOf() should return correct timestamp for known date', () => {
		// 1400/1/1 = 2021-03-21 00:00:00 UTC
		const expected = new Date(2021, 2, 21).getTime();
		expect(nowruz1400.valueOf()).toBe(expected);
	});
});
