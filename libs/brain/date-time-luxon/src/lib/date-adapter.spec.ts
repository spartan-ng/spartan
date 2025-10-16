import { DateTime } from 'luxon';
import { BrnLuxonDateAdapter } from './date-adapter';

describe('BrnLuxonDateAdapter', () => {
	const adapter = new BrnLuxonDateAdapter();

	test('now() should return the current time', () => {
		const actual = adapter.now();
		const expected = DateTime.now();
		expect(actual.toMillis()).toBeCloseTo(expected.toMillis(), -200);
	});

	test('set() should update specified date properties', () => {
		const date = DateTime.utc(2023, 10, 10, 10, 0, 0);
		const result = adapter.set(date, { hour: 15, minute: 45 });
		expect(result.hour).toBe(15);
		expect(result.minute).toBe(45);
	});

	test('add() should add duration to a date', () => {
		const date = DateTime.utc(2023, 10, 10);
		const result = adapter.add(date, { days: 2, hours: 5 });
		expect(result.toISO()).toBe(DateTime.utc(2023, 10, 12, 5).toISO());
	});

	test('subtract() should subtract duration from a date', () => {
		const date = DateTime.utc(2023, 10, 10);
		const result = adapter.subtract(date, { days: 1, hours: 2 });
		expect(result.toISO()).toBe(DateTime.utc(2023, 10, 8, 22).toISO());
	});

	test('compare() should compare two dates', () => {
		const dateA = DateTime.utc(2023, 10, 10);
		const dateB = DateTime.utc(2023, 10, 12);
		expect(adapter.compare(dateA, dateB)).toBe(-1);
		expect(adapter.compare(dateB, dateA)).toBe(1);
		expect(adapter.compare(dateA, dateA)).toBe(0);
	});

	test('isEqual() should check if two dates are equal', () => {
		const dateA = DateTime.utc(2023, 10, 10);
		const dateB = DateTime.utc(2023, 10, 10);
		const dateC = DateTime.local(2023, 10, 10);
		expect(adapter.isEqual(dateA, dateB)).toBe(true);
		expect(adapter.isEqual(dateA, dateC)).toBe(false);
	});

	test('isBefore() should check if a date is before another', () => {
		const dateA = DateTime.utc(2023, 10, 10);
		const dateB = DateTime.utc(2023, 10, 11);
		expect(adapter.isBefore(dateA, dateB)).toBe(true);
		expect(adapter.isBefore(dateB, dateA)).toBe(false);
	});

	test('isAfter() should check if a date is after another', () => {
		const dateA = DateTime.utc(2023, 10, 10);
		const dateB = DateTime.utc(2023, 10, 9);
		expect(adapter.isAfter(dateA, dateB)).toBe(true);
		expect(adapter.isAfter(dateB, dateA)).toBe(false);
	});

	test('isSameDay() should check if two dates are on the same day', () => {
		const dateA = DateTime.utc(2023, 10, 10, 5);
		const dateB = DateTime.utc(2023, 10, 10, 22);
		const dateC = DateTime.utc(2023, 10, 11);
		expect(adapter.isSameDay(dateA, dateB)).toBe(true);
		expect(adapter.isSameDay(dateA, dateC)).toBe(false);
	});

	test('isSameMonth() should check if two dates are in the same month', () => {
		const dateA = DateTime.utc(2023, 10, 10);
		const dateB = DateTime.utc(2023, 10, 15);
		const dateC = DateTime.utc(2023, 11, 1);
		expect(adapter.isSameMonth(dateA, dateB)).toBe(true);
		expect(adapter.isSameMonth(dateA, dateC)).toBe(false);
	});

	test('isSameYear() should check if two dates are in the same year', () => {
		const dateA = DateTime.utc(2023, 10, 10);
		const dateB = DateTime.utc(2023, 11, 1);
		const dateC = DateTime.utc(2024, 1, 1);
		expect(adapter.isSameYear(dateA, dateB)).toBe(true);
		expect(adapter.isSameYear(dateA, dateC)).toBe(false);
	});

	test('getYear() should return the year of a date', () => {
		const date = DateTime.utc(2023, 10, 10);
		expect(adapter.getYear(date)).toBe(2023);
	});

	test('getMonth() should return the month of a date', () => {
		const date = DateTime.utc(2023, 10, 10);
		expect(adapter.getMonth(date)).toBe(10);
	});

	test('getDate() should return the day of the month of a date', () => {
		const date = DateTime.utc(2023, 10, 10);
		expect(adapter.getDate(date)).toBe(10);
	});

	describe('getDay() should return the day of the week (0-based, Sunday as 0)', () => {
		test('should return 0 for Sunday', () => {
			const date = DateTime.fromObject({
				weekday: 7,
			}); // Sunday
			expect(adapter.getDay(date)).toBe(0);
		});

		test('should return 1 for Monday', () => {
			const date = DateTime.fromObject({ weekday: 1 }); // Monday
			expect(adapter.getDay(date)).toBe(1);
		});

		test('should return 2 for Tuesday', () => {
			const date = DateTime.fromObject({ weekday: 2 }); // Tuesday
			expect(adapter.getDay(date)).toBe(2);
		});

		test('should return 3 for Wednesday', () => {
			const date = DateTime.fromObject({ weekday: 3 }); // Wednesday
			expect(adapter.getDay(date)).toBe(3);
		});

		test('should return 4 for Thursday', () => {
			const date = DateTime.fromObject({ weekday: 4 }); // Thursday
			expect(adapter.getDay(date)).toBe(4);
		});

		test('should return 5 for Friday', () => {
			const date = DateTime.fromObject({ weekday: 5 }); // Friday
			expect(adapter.getDay(date)).toBe(5);
		});

		test('should return 6 for Saturday', () => {
			const date = DateTime.fromObject({ weekday: 6 }); // Saturday
			expect(adapter.getDay(date)).toBe(6);
		});
	});

	test('getHours() should return the hour of the given datetime', () => {
		const date = DateTime.utc(2023, 10, 10, 14, 30);
		expect(adapter.getHours(date)).toBe(14);
	});

	test('getMinutes() should return the minute of the given datetime', () => {
		const date = DateTime.utc(2023, 10, 10, 14, 45);
		expect(adapter.getMinutes(date)).toBe(45);
	});

	test('getSeconds() should return the seconds of the given datetime', () => {
		const date = DateTime.utc(2023, 10, 10, 14, 45, 30);
		expect(adapter.getSeconds(date)).toBe(30);
	});

	test('getMilliseconds() should return the milliseconds of the given datetime', () => {
		const date = DateTime.utc(2023, 10, 10, 14, 45, 30, 123);
		expect(adapter.getMilliseconds(date)).toBe(123);
	});

	test('getTime() should return the timestamp of a date', () => {
		const date = DateTime.utc(2023, 10, 10, 12);
		expect(adapter.getTime(date)).toBe(date.toMillis());
	});

	test('startOfMonth() should return the start of the month', () => {
		const date = DateTime.utc(2023, 10, 10, 12);
		expect(adapter.startOfMonth(date)).toEqual(DateTime.utc(2023, 10, 1));
	});

	test('endOfMonth() should return the end of the month', () => {
		const date = DateTime.utc(2023, 10, 10, 12);
		expect(adapter.endOfMonth(date)).toEqual(DateTime.utc(2023, 10, 31, 23, 59, 59, 999));
	});

	test('startOfDay() should return the start of the given day', () => {
		const date = DateTime.utc(2023, 10, 10, 14, 45, 30, 123);
		expect(adapter.startOfDay(date)).toEqual(DateTime.utc(2023, 10, 10).startOf('day'));
	});

	test('endOfDay() should return the end of the given day', () => {
		const date = DateTime.utc(2023, 10, 10, 14, 45, 30, 123);
		expect(adapter.endOfDay(date)).toEqual(DateTime.utc(2023, 10, 10).endOf('day'));
	});

	test('create() should create a new date from values', () => {
		const values = {
			year: 2023,
			month: 10,
			day: 10,
			hour: 12,
			minute: 30,
			second: 0,
			millisecond: 0,
		};
		const date = adapter.create(values);
		expect(date).toEqual(DateTime.fromObject(values));
	});
});
