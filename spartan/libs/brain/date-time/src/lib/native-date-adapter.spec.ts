import { BrnNativeDateAdapter } from './native-date-adapter';

describe('BrnNativeDateAdapter', () => {
	const adapter = new BrnNativeDateAdapter();

	test('now() should return the current time', () => {
		const actual = adapter.now();
		const expected = new Date();
		expect(actual.getTime()).toBeCloseTo(expected.getTime(), -2);
	});

	test('set() should update specified date properties', () => {
		const date = new Date(2023, 9, 10, 10, 0, 0);
		const result = adapter.set(date, { hour: 15, minute: 45 });
		expect(result.getHours()).toBe(15);
		expect(result.getMinutes()).toBe(45);
	});

	test('add() should add duration to a date', () => {
		const date = new Date(2023, 9, 10);
		const result = adapter.add(date, { days: 2, hours: 5 });
		expect(result).toEqual(new Date(2023, 9, 12, 5));
	});

	test('subtract() should subtract duration from a date', () => {
		const date = new Date(2023, 9, 10);
		const result = adapter.subtract(date, { days: 1, hours: 2 });
		expect(result).toEqual(new Date(2023, 9, 8, 22));
	});

	test('compare() should compare two dates', () => {
		const dateA = new Date(2023, 9, 10);
		const dateB = new Date(2023, 9, 12);
		expect(adapter.compare(dateA, dateB)).toBe(-1);
		expect(adapter.compare(dateB, dateA)).toBe(1);
		expect(adapter.compare(dateA, dateA)).toBe(0);
	});

	test('isEqual() should check if two dates are equal', () => {
		const dateA = new Date(2023, 9, 10);
		const dateB = new Date(2023, 9, 10);
		const dateC = new Date(2023, 9, 11);
		expect(adapter.isEqual(dateA, dateB)).toBe(true);
		expect(adapter.isEqual(dateA, dateC)).toBe(false);
	});

	test('isBefore() should check if a date is before another', () => {
		const dateA = new Date(2023, 9, 10);
		const dateB = new Date(2023, 9, 11);
		expect(adapter.isBefore(dateA, dateB)).toBe(true);
		expect(adapter.isBefore(dateB, dateA)).toBe(false);
	});

	test('isAfter() should check if a date is after another', () => {
		const dateA = new Date(2023, 9, 10);
		const dateB = new Date(2023, 9, 9);
		expect(adapter.isAfter(dateA, dateB)).toBe(true);
		expect(adapter.isAfter(dateB, dateA)).toBe(false);
	});

	test('isSameDay() should check if two dates are on the same day', () => {
		const dateA = new Date(2023, 9, 10, 5);
		const dateB = new Date(2023, 9, 10, 22);
		const dateC = new Date(2023, 9, 11);
		expect(adapter.isSameDay(dateA, dateB)).toBe(true);
		expect(adapter.isSameDay(dateA, dateC)).toBe(false);
	});

	test('getYear() should return the year of a date', () => {
		const date = new Date(2023, 9, 10);
		expect(adapter.getYear(date)).toBe(2023);
	});

	test('getMonth() should return the month of a date', () => {
		const date = new Date(2023, 9, 10);
		expect(adapter.getMonth(date)).toBe(9); // JavaScript months are 0-based
	});

	test('getDate() should return the day of the month of a date', () => {
		const date = new Date(2023, 9, 10);
		expect(adapter.getDate(date)).toBe(10);
	});

	test('getTime() should return the timestamp of a date', () => {
		const date = new Date(2023, 9, 10, 12);
		expect(adapter.getTime(date)).toBe(date.getTime());
	});

	test('startOfMonth() should return the start of the month', () => {
		const date = new Date(2023, 9, 10, 12);
		expect(adapter.startOfMonth(date)).toEqual(new Date(2023, 9, 1));
	});

	test('endOfMonth() should return the end of the month', () => {
		const date = new Date(2023, 9, 10, 12);
		expect(adapter.endOfMonth(date)).toEqual(new Date(2023, 9, 31));
	});

	test('isSameMonth() should check if two dates are in the same month', () => {
		const dateA = new Date(2023, 9, 10);
		const dateB = new Date(2023, 9, 15);
		const dateC = new Date(2023, 10, 10);
		expect(adapter.isSameMonth(dateA, dateB)).toBe(true);
		expect(adapter.isSameMonth(dateA, dateC)).toBe(false);
	});

	test('isSameYear() should check if two dates are in the same year', () => {
		const dateA = new Date(2023, 9, 10);
		const dateB = new Date(2023, 11, 15);
		const dateC = new Date(2024, 9, 10);
		expect(adapter.isSameYear(dateA, dateB)).toBe(true);
		expect(adapter.isSameYear(dateA, dateC)).toBe(false);
	});

	test('getDay() should return the day of week', () => {
		expect(adapter.getDay(new Date(2024, 2, 17))).toBe(0);
		expect(adapter.getDay(new Date(2024, 2, 18))).toBe(1);
		expect(adapter.getDay(new Date(2024, 2, 19))).toBe(2);
		expect(adapter.getDay(new Date(2024, 2, 20))).toBe(3);
		expect(adapter.getDay(new Date(2024, 2, 21))).toBe(4);
		expect(adapter.getDay(new Date(2024, 2, 22))).toBe(5);
		expect(adapter.getDay(new Date(2024, 2, 23))).toBe(6);
	});

	test('getHours() should return the hours of a date', () => {
		const date = new Date(2023, 9, 10, 15, 30);
		expect(adapter.getHours(date)).toBe(15);
	});

	test('getMinutes() should return the minutes of a date', () => {
		const date = new Date(2023, 9, 10, 15, 30);
		expect(adapter.getMinutes(date)).toBe(30);
	});

	test('getSeconds() should return the seconds of a date', () => {
		const date = new Date(2023, 9, 10, 15, 30, 45);
		expect(adapter.getSeconds(date)).toBe(45);
	});

	test('getMilliseconds() should return the milliseconds of a date', () => {
		const date = new Date(2023, 9, 10, 15, 30, 45, 500);
		expect(adapter.getMilliseconds(date)).toBe(500);
	});

	test('startOfDay() should return the start of the day', () => {
		const date = new Date(2023, 9, 10, 15, 30, 45);
		expect(adapter.startOfDay(date)).toEqual(new Date(2023, 9, 10, 0, 0, 0, 0));
	});

	test('endOfDay() should return the end of the day', () => {
		const date = new Date(2023, 9, 10, 15, 30, 45);
		expect(adapter.endOfDay(date)).toEqual(new Date(2023, 9, 10, 23, 59, 59, 999));
	});

	test('create() should create a new date from values', () => {
		const values = { year: 2023, month: 9, day: 10, hour: 12, minute: 30, second: 0, millisecond: 0 };
		const date = adapter.create(values);
		expect(date).toEqual(new Date(2023, 9, 10, 12, 30));
	});
});
