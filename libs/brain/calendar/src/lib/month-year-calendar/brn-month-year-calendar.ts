import type { BooleanInput } from '@angular/cdk/coercion';
import {
	afterNextRender,
	booleanAttribute,
	ChangeDetectorRef,
	computed,
	contentChild,
	Directive,
	inject,
	Injector,
	input,
	linkedSignal,
	model,
} from '@angular/core';
import { injectDateAdapter } from '@spartan-ng/brain/date-time';
import { BrnMonthYearCalendarHeader } from './brn-month-year-calendar-header';
import {
	type BrnMonthYearCalendarBase,
	type BrnMonthYearCalendarCell,
	type BrnMonthYearCalendarView,
	provideBrnMonthYearCalendar,
} from './brn-month-year-calendar.token';

/** The number of years shown per page (4 columns x 6 rows). */
const YEARS_PER_PAGE = 12;

/** Positive modulo. */
function floorMod(value: number, modulo: number): number {
	return ((value % modulo) + modulo) % modulo;
}

@Directive({
	selector: '[brnMonthYearCalendar]',
	providers: [provideBrnMonthYearCalendar(BrnMonthYearCalendar)],
})
export class BrnMonthYearCalendar<T> implements BrnMonthYearCalendarBase<T> {
	/** Access the date adapter */
	protected readonly _dateAdapter = injectDateAdapter<T>();

	/** Access the change detector */
	private readonly _changeDetector = inject(ChangeDetectorRef);

	/** Access the injector */
	private readonly _injector = inject(Injector);

	/** The minimum date that can be selected. */
	public readonly min = input<T>();

	/** The maximum date that can be selected. */
	public readonly max = input<T>();

	/** Whether the month/year selector is disabled. */
	public readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** The selected month. Represented by the first day of the month. */
	public readonly date = model<T>();

	/** The default focused date. */
	public readonly defaultFocusedDate = input<T>();

	/** The current view. The year view is shown first. */
	public readonly viewInput = input<BrnMonthYearCalendarView>('year', { alias: 'view' });

	/** The current view mutable. The year view is shown first. */
	public readonly view = linkedSignal(this.viewInput);

	/** @internal Access the header */
	public readonly header = contentChild(BrnMonthYearCalendarHeader);

	/** The focused date. */
	public readonly focusedDate = linkedSignal(() =>
		this.constrainDate(this.defaultFocusedDate() ?? this.date() ?? this._dateAdapter.now()),
	);

	private readonly _cells: BrnMonthYearCalendarCell<T>[] = [];

	/** The 12 months of the currently focused year. */
	public readonly months = computed<T[]>(() => {
		const focused = this.focusedDate();
		return Array.from({ length: 12 }, (_, month) =>
			this._dateAdapter.startOfMonth(this._dateAdapter.set(focused, { month, day: 1 })),
		);
	});

	/** The first and last year of the current page. */
	public readonly yearRange = computed(() => {
		const year = this._dateAdapter.getYear(this.focusedDate());
		const start = year - floorMod(year, YEARS_PER_PAGE);
		return { start, end: start + YEARS_PER_PAGE - 1 };
	});

	/** The years of the current page. */
	public readonly years = computed<T[]>(() => {
		const focused = this.focusedDate();
		const { start } = this.yearRange();
		return Array.from({ length: YEARS_PER_PAGE }, (_, i) =>
			this._dateAdapter.startOfMonth(this._dateAdapter.set(focused, { year: start + i, month: 0, day: 1 })),
		);
	});

	/** @internal Constrain a date to the min and max boundaries. */
	constrainDate(date: T): T {
		const min = this.min();
		const max = this.max();

		if (min && this._dateAdapter.isBefore(date, this._dateAdapter.startOfDay(min))) {
			return min;
		}

		if (max && this._dateAdapter.isAfter(date, this._dateAdapter.endOfDay(max))) {
			return max;
		}

		return date;
	}

	selectMonth(date: T): void {
		if (this.isMonthDisabled(date)) {
			return;
		}

		const month = this._dateAdapter.startOfDay(this._dateAdapter.startOfMonth(date));

		if (this.isMonthSelected(date)) {
			this.date.set(undefined);
		} else {
			this.date.set(month);
		}

		this.focusedDate.set(month);
	}

	selectYear(date: T): void {
		if (this.isYearDisabled(date)) {
			return;
		}

		const year = this._dateAdapter.getYear(date);
		this.focusedDate.set(this._dateAdapter.set(this.focusedDate(), { year }));
		this.view.set('month');

		// focus the first available month once the month view is rendered.
		afterNextRender(
			{
				write: () => {
					const cell = this._cells[0];
					if (cell) {
						cell.focus();
					}
				},
			},
			{ injector: this._injector },
		);
		this._changeDetector.detectChanges();
	}

	isMonthSelected(date: T): boolean {
		const selected = this.date();
		return !!selected && this._dateAdapter.isSameMonth(date, selected) && this._dateAdapter.isSameYear(date, selected);
	}

	isYearSelected(date: T): boolean {
		const selected = this.date();
		return !!selected && this._dateAdapter.isSameYear(date, selected);
	}

	isMonthToday(date: T): boolean {
		const now = this._dateAdapter.now();
		return this._dateAdapter.isSameMonth(date, now) && this._dateAdapter.isSameYear(date, now);
	}

	isYearToday(date: T): boolean {
		return this._dateAdapter.isSameYear(date, this._dateAdapter.now());
	}

	isMonthDisabled(date: T): boolean {
		if (this.disabled()) {
			return true;
		}

		const min = this.min();
		const max = this.max();

		if (min && this._dateAdapter.isBefore(this._dateAdapter.endOfMonth(date), this._dateAdapter.startOfDay(min))) {
			return true;
		}

		if (max && this._dateAdapter.isAfter(this._dateAdapter.startOfMonth(date), this._dateAdapter.endOfDay(max))) {
			return true;
		}

		return false;
	}

	isYearDisabled(date: T): boolean {
		if (this.disabled()) {
			return true;
		}

		const year = this._dateAdapter.getYear(date);
		const min = this.min();
		const max = this.max();

		if (min && year < this._dateAdapter.getYear(min)) {
			return true;
		}

		if (max && year > this._dateAdapter.getYear(max)) {
			return true;
		}

		return false;
	}

	setFocusedMonth(date: T): void {
		if (this.isMonthDisabled(date)) {
			return;
		}
		this.focusedDate.set(this._dateAdapter.startOfMonth(date));
		this._focusCell((cell) => this._dateAdapter.isSameMonth(cell, date) && this._dateAdapter.isSameYear(cell, date));
	}

	setFocusedYear(date: T): void {
		if (this.isYearDisabled(date)) {
			return;
		}
		const year = this._dateAdapter.getYear(date);
		this.focusedDate.set(this._dateAdapter.set(this.focusedDate(), { year }));
		this._focusCell((cell) => this._dateAdapter.isSameYear(cell, date));
	}

	goToPrevious(): void {
		if (this.isPreviousDisabled()) {
			return;
		}
		const amount = this.view() === 'month' ? 1 : YEARS_PER_PAGE;
		this.focusedDate.set(this._dateAdapter.subtract(this.focusedDate(), { years: amount }));
	}

	goToNext(): void {
		if (this.isNextDisabled()) {
			return;
		}
		const amount = this.view() === 'month' ? 1 : YEARS_PER_PAGE;
		this.focusedDate.set(this._dateAdapter.add(this.focusedDate(), { years: amount }));
	}

	isPreviousDisabled(): boolean {
		if (this.disabled()) {
			return true;
		}
		const min = this.min();
		if (!min) {
			return false;
		}
		const minYear = this._dateAdapter.getYear(min);
		if (this.view() === 'month') {
			return this._dateAdapter.getYear(this.focusedDate()) - 1 < minYear;
		}
		return this.yearRange().start - 1 < minYear;
	}

	isNextDisabled(): boolean {
		if (this.disabled()) {
			return true;
		}
		const max = this.max();
		if (!max) {
			return false;
		}
		const maxYear = this._dateAdapter.getYear(max);
		if (this.view() === 'month') {
			return this._dateAdapter.getYear(this.focusedDate()) + 1 > maxYear;
		}
		return this.yearRange().end + 1 > maxYear;
	}

	private _focusCell(predicate: (value: T) => boolean): void {
		afterNextRender(
			{
				write: () => {
					const cell = this._cells.find((c) => predicate(c.value()));
					if (cell) {
						cell.focus();
					}
				},
			},
			{ injector: this._injector },
		);
		this._changeDetector.detectChanges();
	}

	registerCell(cell: BrnMonthYearCalendarCell<T>): void {
		this._cells.push(cell);
	}

	unregisterCell(cell: BrnMonthYearCalendarCell<T>): void {
		const index = this._cells.indexOf(cell);
		if (index !== -1) {
			this._cells.splice(index, 1);
		}
	}
}
