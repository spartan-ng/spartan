import type { BrnDateAdapter, BrnDateUnits, BrnDuration } from '@spartan-ng/brain/date-time';
import { DateTime } from 'luxon';

export class BrnLuxonDateAdapter implements BrnDateAdapter<DateTime> {
	now() {
		return DateTime.now();
	}

	set(date: DateTime, values: BrnDateUnits) {
		return date.set(values);
	}

	add(date: DateTime, duration: BrnDuration) {
		return date.plus(duration);
	}

	subtract(date: DateTime, duration: BrnDuration) {
		return date.minus(duration);
	}

	compare(a: DateTime, b: DateTime): number {
		if (a < b) {
			return -1;
		}

		if (a > b) {
			return 1;
		}

		return 0;
	}

	isEqual(a: DateTime, b: DateTime): boolean {
		return a.equals(b);
	}

	isBefore(a: DateTime, b: DateTime): boolean {
		return a < b;
	}

	isAfter(a: DateTime, b: DateTime): boolean {
		return a > b;
	}

	isSameDay(a: DateTime, b: DateTime): boolean {
		return a.hasSame(b, 'day') && a.hasSame(b, 'month') && a.hasSame(b, 'year');
	}

	isSameMonth(a: DateTime, b: DateTime): boolean {
		return a.hasSame(b, 'month') && a.hasSame(b, 'year');
	}

	isSameYear(a: DateTime, b: DateTime): boolean {
		return a.hasSame(b, 'year');
	}

	getYear(date: DateTime): number {
		return date.year;
	}

	getMonth(date: DateTime): number {
		return date.month;
	}

	getDate(date: DateTime): number {
		return date.day;
	}

	getDay(date: DateTime): number {
		// Adjust the range, Luxon calculates week days starting with Monday 1 to Sunday 7
		// , and we should return Sunday 0 to Saturday 6
		return date.weekday % 7;
	}

	getHours(date: DateTime): number {
		return date.hour;
	}

	getMinutes(date: DateTime): number {
		return date.minute;
	}

	getSeconds(date: DateTime): number {
		return date.second;
	}

	getMilliseconds(date: DateTime): number {
		return date.millisecond;
	}

	getTime(date: DateTime<boolean>): number {
		return date.toMillis();
	}

	startOfMonth(date: DateTime) {
		return date.startOf('month');
	}

	endOfMonth(date: DateTime) {
		return date.endOf('month');
	}

	startOfDay(date: DateTime) {
		return date.startOf('day');
	}

	endOfDay(date: DateTime) {
		return date.endOf('day');
	}

	create(values: BrnDateUnits) {
		return DateTime.fromObject(values);
	}
}
