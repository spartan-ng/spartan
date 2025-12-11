import { BrnUtcDateAdapter } from './utc-date-adapter';

describe('BrnUtcDateAdapter (UTC)', () => {
	const adapter = new BrnUtcDateAdapter();

	it('should create a date using UTC values', () => {
		const date = adapter.create({ year: 2023, month: 0, day: 1, hour: 12 });
		expect(date.getUTCFullYear()).toBe(2023);
		expect(date.getUTCMonth()).toBe(0);
		expect(date.getUTCDate()).toBe(1);
		expect(date.getUTCHours()).toBe(12);
	});

	it('should get the current time', () => {
		const now = adapter.now();
		expect(now instanceof Date).toBe(true);
	});

	it('should set parts of a date immutably (UTC)', () => {
		const date = new Date(Date.UTC(2020, 5, 15, 10, 30));
		const updated = adapter.set(date, { year: 2025 });
		expect(updated.getUTCFullYear()).toBe(2025);
		expect(updated.getUTCMonth()).toBe(5);
		expect(updated.getUTCDate()).toBe(15);
	});

	it('should add duration to a date correctly (UTC)', () => {
		const date = new Date(Date.UTC(2023, 0, 1, 0, 0));
		const added = adapter.add(date, { days: 1, hours: 2 });
		expect(added.getUTCDate()).toBe(2);
		expect(added.getUTCHours()).toBe(2);
	});

	it('should subtract duration from a date correctly (UTC)', () => {
		const date = new Date(Date.UTC(2023, 0, 2, 2, 0));
		const subtracted = adapter.subtract(date, { days: 1, hours: 2 });
		expect(subtracted.getUTCDate()).toBe(1);
		expect(subtracted.getUTCHours()).toBe(0);
	});

	it('should compare two dates correctly', () => {
		const a = new Date(Date.UTC(2023, 0, 1));
		const b = new Date(Date.UTC(2023, 0, 2));
		expect(adapter.compare(a, b)).toBeLessThan(0);
		expect(adapter.compare(b, a)).toBeGreaterThan(0);
		expect(adapter.compare(a, new Date(Date.UTC(2023, 0, 1)))).toBe(0);
	});

	it('should check equality of two dates', () => {
		const a = new Date(Date.UTC(2023, 0, 1));
		const b = new Date(Date.UTC(2023, 0, 1));
		expect(adapter.isEqual(a, b)).toBe(true);
	});

	it('should detect same day, month, year correctly', () => {
		const a = new Date(Date.UTC(2023, 0, 1));
		const b = new Date(Date.UTC(2023, 0, 1, 23));
		expect(adapter.isSameDay(a, b)).toBe(true);
		expect(adapter.isSameMonth(a, b)).toBe(true);
		expect(adapter.isSameYear(a, b)).toBe(true);
	});

	it('should get start and end of month correctly', () => {
		const date = new Date(Date.UTC(2023, 1, 15));
		const start = adapter.startOfMonth(date);
		const end = adapter.endOfMonth(date);
		expect(start.getUTCDate()).toBe(1);
		expect(end.getUTCDate()).toBe(28);
	});

	it('should get start and end of day correctly', () => {
		const date = new Date(Date.UTC(2023, 0, 1, 10, 20, 30));
		const start = adapter.startOfDay(date);
		const end = adapter.endOfDay(date);

		expect(start.getUTCHours()).toBe(0);
		expect(end.getUTCHours()).toBe(23);
		expect(end.getUTCMinutes()).toBe(59);
		expect(end.getUTCSeconds()).toBe(59);
		expect(end.getUTCMilliseconds()).toBe(999);
	});
});
