import type { NumberInput } from '@angular/cdk/coercion';
import {
	computed,
	contentChild,
	Directive,
	inject,
	InjectionToken,
	input,
	numberAttribute,
	type Signal,
} from '@angular/core';
import { injectDateAdapter } from '@spartan-ng/brain/date-time';
import { BrnCalendarHeader } from './brn-calendar-header';
import { injectBrnCalendar } from './brn-calendar.token';
import { compareDays } from './utils/compare-days';

export interface BrnCalendarMonthContext<T> {
	/** The first day of the displayed month. */
	month: Signal<T>;
	/** The days to render for this month. */
	days: Signal<T[]>;
	/** The header of this month. */
	header: Signal<BrnCalendarHeader | undefined>;
	/** The offset of this month relative to the first displayed month. */
	offset: Signal<number>;
}

export const BrnCalendarMonthToken = new InjectionToken<BrnCalendarMonthContext<unknown>>('BrnCalendarMonthToken');

/**
 * Inject the month context, if the element is rendered within a `brnCalendarMonth`.
 */
export function injectBrnCalendarMonth<T>(): BrnCalendarMonthContext<T> | null {
	return inject(BrnCalendarMonthToken, { optional: true }) as BrnCalendarMonthContext<T> | null;
}

/**
 * Scopes the grid, weeks, weekdays, cells, header and selects within it to a single displayed month.
 * Use it to render multiple months, e.g. with `numberOfMonths` on `brnCalendarRange`.
 */
@Directive({
	selector: '[brnCalendarMonth]',
	exportAs: 'brnCalendarMonth',
	providers: [{ provide: BrnCalendarMonthToken, useExisting: BrnCalendarMonth }],
	host: {
		'data-slot': 'calendar-month',
	},
})
export class BrnCalendarMonth<T> implements BrnCalendarMonthContext<T> {
	/** Access the calendar */
	private readonly _calendar = injectBrnCalendar<T>();

	/** Access the date adapter */
	private readonly _dateAdapter = injectDateAdapter<T>();

	/** The offset of this month relative to the first displayed month. */
	public readonly offset = input<number, NumberInput>(0, {
		transform: (value) => numberAttribute(value, 0),
	});

	/** @internal The header of this month. */
	public readonly header = contentChild(BrnCalendarHeader);

	private readonly _data = computed(() => this._calendar.months?.()[this.offset()]);

	/** The first day of the displayed month. */
	public readonly month = computed(
		() => this._data()?.month ?? this._dateAdapter.startOfMonth(this._calendar.focusedDate()),
		{ equal: (a, b) => this._dateAdapter.isSameMonth(a, b) },
	);

	/** The days to render for this month. */
	public readonly days = computed(() => this._data()?.days ?? this._calendar.days(), {
		equal: (a, b) => compareDays(a, b, this._dateAdapter),
	});
}
