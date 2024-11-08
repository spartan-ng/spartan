import { ClassProvider, InjectionToken, Type, inject } from '@angular/core';
import {} from './date-adapter';
import { BrnNativeDateAdapter } from './native-date-adapter';

/**
 * An abstraction that can be used to create and modify date time objects
 * immutably regardless of the underlying implementation.
 */
export interface BrnDateAdapter<T> {
	/**
	 * Create a new date time object.
	 */
	create(values: BrnDateUnits): T;

	/**
	 * Create a new date with the current date and time.
	 */
	now(): T;

	/**
	 * Set the year of the date time object based on a duration.
	 */
	set(date: T, values: BrnDateUnits): T;

	/**
	 * Add a duration to the date time object.
	 */
	add(date: T, duration: BrnDuration): T;

	/**
	 * Subtract a duration from the date time object.
	 */
	subtract(date: T, duration: BrnDuration): T;

	/**
	 * Compare two date time objects.
	 */
	compare(a: T, b: T): number;

	/**
	 * Determine if two date time objects are equal.
	 */
	isEqual(a: T, b: T): boolean;

	/**
	 * Determine if a date time object is before another.
	 */
	isBefore(a: T, b: T): boolean;

	/**
	 * Determine if a date time object is after another.
	 */
	isAfter(a: T, b: T): boolean;

	/**
	 * Determine if two date objects are on the same day.
	 */
	isSameDay(a: T, b: T): boolean;

	/**
	 * Determine if two date objects are on the same month.
	 */
	isSameMonth(a: T, b: T): boolean;

	/**
	 * Determine if two date objects are on the same year.
	 */
	isSameYear(a: T, b: T): boolean;

	/**
	 * Get the year.
	 */
	getYear(date: T): number;

	/**
	 * Get the month.
	 */
	getMonth(date: T): number;

	/**
	 * Get the date.
	 */
	getDate(date: T): number;

	/**
	 * Get the day.
	 */
	getDay(date: T): number;

	/**
	 * Get the hours.
	 */
	getHours(date: T): number;

	/**
	 * Get the minutes.
	 */
	getMinutes(date: T): number;

	/**
	 * Get the seconds.
	 */
	getSeconds(date: T): number;

	/**
	 * Get the milliseconds.
	 */
	getMilliseconds(date: T): number;

	/**
	 * Get the time.
	 */
	getTime(date: T): number;

	/**
	 * Get the first day of the month.
	 */
	startOfMonth(date: T): T;

	/**
	 * Get the last day of the month.
	 */
	endOfMonth(date: T): T;

	/**
	 * Get the start of the day.
	 */
	startOfDay(date: T): T;

	/**
	 * Get the end of the day.
	 */
	endOfDay(date: T): T;
}

export interface BrnDateUnits {
	/**
	 * The year.
	 */
	year?: number;

	/**
	 * The month.
	 */
	month?: number;

	/**
	 * The day.
	 */
	day?: number;

	/**
	 * The hour.
	 */
	hour?: number;

	/**
	 * The minute.
	 */
	minute?: number;

	/**
	 * The second.
	 */
	second?: number;

	/**
	 * The millisecond.
	 */
	millisecond?: number;
}

export interface BrnDuration {
	/**
	 * The years.
	 */
	years?: number;

	/**
	 * The months.
	 */
	months?: number;

	/**
	 * The days.
	 */
	days?: number;

	/**
	 * The hours.
	 */
	hours?: number;

	/**
	 * The minutes.
	 */
	minutes?: number;

	/**
	 * The seconds.
	 */
	seconds?: number;

	/**
	 * The milliseconds.
	 */
	milliseconds?: number;
}

export const BrnDateAdapterToken = new InjectionToken<BrnDateAdapter<unknown>>('BrnDateAdapterToken');

/**
 * Inject the DateAdapter instance
 */
export function injectDateAdapter<T>(): BrnDateAdapter<T> {
	return (inject(BrnDateAdapterToken, { optional: true }) as BrnDateAdapter<T>) ?? new BrnNativeDateAdapter();
}

/**
 * Provide the DateAdapter instance
 */
export function provideDateAdapter<T>(adapter: Type<BrnDateAdapter<T>>): ClassProvider {
	return { provide: BrnDateAdapterToken, useClass: adapter };
}
