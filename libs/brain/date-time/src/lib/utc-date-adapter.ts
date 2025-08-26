import type { BrnDateAdapter, BrnDateUnits, BrnDuration } from './date-adapter';

export class BrnUtcDateAdapter implements BrnDateAdapter<Date> {
	create({ day, hour, minute, month, second, year, millisecond }: BrnDateUnits): Date {
		const now = new Date();
		const utcTime = Date.UTC(
			year ?? now.getUTCFullYear(),
			month ?? now.getUTCMonth(),
			day ?? now.getUTCDate(),
			hour ?? now.getUTCHours(),
			minute ?? now.getUTCMinutes(),
			second ?? now.getUTCSeconds(),
			millisecond ?? now.getUTCMilliseconds(),
		);
		return new Date(utcTime);
	}

	now(): Date {
		return new Date(Date.now());
	}

	set(date: Date, values: BrnDateUnits): Date {
		const utcTime = Date.UTC(
			values.year ?? date.getUTCFullYear(),
			values.month ?? date.getUTCMonth(),
			values.day ?? date.getUTCDate(),
			values.hour ?? date.getUTCHours(),
			values.minute ?? date.getUTCMinutes(),
			values.second ?? date.getUTCSeconds(),
			values.millisecond ?? date.getUTCMilliseconds(),
		);
		return new Date(utcTime);
	}

	add(date: Date, duration: BrnDuration): Date {
		return new Date(
			Date.UTC(
				date.getUTCFullYear() + (duration.years ?? 0),
				date.getUTCMonth() + (duration.months ?? 0),
				date.getUTCDate() + (duration.days ?? 0),
				date.getUTCHours() + (duration.hours ?? 0),
				date.getUTCMinutes() + (duration.minutes ?? 0),
				date.getUTCSeconds() + (duration.seconds ?? 0),
				date.getUTCMilliseconds() + (duration.milliseconds ?? 0),
			),
		);
	}

	subtract(date: Date, duration: BrnDuration): Date {
		return new Date(
			Date.UTC(
				date.getUTCFullYear() - (duration.years ?? 0),
				date.getUTCMonth() - (duration.months ?? 0),
				date.getUTCDate() - (duration.days ?? 0),
				date.getUTCHours() - (duration.hours ?? 0),
				date.getUTCMinutes() - (duration.minutes ?? 0),
				date.getUTCSeconds() - (duration.seconds ?? 0),
				date.getUTCMilliseconds() - (duration.milliseconds ?? 0),
			),
		);
	}

	compare(a: Date, b: Date): number {
		const diff = a.getTime() - b.getTime();
		return diff === 0 ? 0 : diff > 0 ? 1 : -1;
	}

	isEqual(a: Date, b: Date): boolean {
		return a.getTime() === b.getTime();
	}

	isBefore(a: Date, b: Date): boolean {
		return a.getTime() < b.getTime();
	}

	isAfter(a: Date, b: Date): boolean {
		return a.getTime() > b.getTime();
	}

	isSameDay(a: Date, b: Date): boolean {
		return this.isSameYear(a, b) && this.isSameMonth(a, b) && a.getUTCDate() === b.getUTCDate();
	}

	isSameMonth(a: Date, b: Date): boolean {
		return this.isSameYear(a, b) && a.getUTCMonth() === b.getUTCMonth();
	}

	isSameYear(a: Date, b: Date): boolean {
		return a.getUTCFullYear() === b.getUTCFullYear();
	}

	getYear(date: Date): number {
		return date.getUTCFullYear();
	}

	getMonth(date: Date): number {
		return date.getUTCMonth();
	}

	getDay(date: Date): number {
		return date.getUTCDay();
	}

	getDate(date: Date): number {
		return date.getUTCDate();
	}

	getHours(date: Date): number {
		return date.getUTCHours();
	}

	getMinutes(date: Date): number {
		return date.getUTCMinutes();
	}

	getSeconds(date: Date): number {
		return date.getUTCSeconds();
	}

	getMilliseconds(date: Date): number {
		return date.getUTCMilliseconds();
	}

	getTime(date: Date): number {
		return date.getTime();
	}

	startOfMonth(date: Date): Date {
		return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
	}

	endOfMonth(date: Date): Date {
		return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0, 23, 59, 59, 999));
	}

	startOfDay(date: Date): Date {
		return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
	}

	endOfDay(date: Date): Date {
		return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));
	}
}
