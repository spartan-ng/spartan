import { Injectable, computed, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CalendarMode, CalendarView, NavigationDirection } from './brn-calendar.types';
import { DateService } from './date.service';

@Injectable()
export class BrnCalendarService {
	private _dateService = inject(DateService);

	public readonly state = signal<{
		id: string;
		mode: CalendarMode;
		selectedDate: Date | null;
		previewDate: Date;
		minDate: Date | null;
		maxDate: Date | null;
		startAt: Date | null;
		startView: CalendarView;
		dateFilter?: (d: Date) => boolean | null;
		daysOfTheWeek: string[];
		calendarWeeks: Array<Array<{ disabled: boolean; date: Date | null; number: number | null } | null>> | null;
		disabledDates: Date[];
		locale: string;
		months: { name: string; index: number; disabled: boolean }[][] | null;
		years: number[][] | null;
		view: CalendarView;
	}>({
		id: '',
		mode: 'single',
		selectedDate: null,
		previewDate: new Date(), // Preview date is used for calendar navigation 'current' date
		minDate: null,
		maxDate: null,
		startAt: null,
		startView: 'days',
		daysOfTheWeek: [],
		disabledDates: [],
		calendarWeeks: null,
		months: [],
		years: [], // Array for keeping the current years for given year range
		locale: 'en-US', // Only default value
		view: 'days',
	});

	public readonly id = computed(() => this.state().id);
	public readonly mode = computed(() => this.state().mode);
	public readonly selectedDate = computed(() => this.state().selectedDate);
	public readonly minDate = computed(() => this.state().minDate);
	public readonly maxDate = computed(() => this.state().maxDate);
	public readonly startAt = computed(() => this.state().startAt);
	public readonly startView = computed(() => this.state().startView);
	public readonly daysOfTheWeek = computed(() => this.state().daysOfTheWeek);

	public readonly calendarWeeks = computed(() => this.state().calendarWeeks);

	public readonly disabledDates = computed(() => this.state().disabledDates);
	public readonly previewDate = computed(() => this.state().previewDate);
	public readonly locale = computed(() => this.state().locale);
	public readonly view = computed(() => this.state().view);
	public readonly months = computed(() => this.state().months);
	public readonly years = computed(() => this.state().years);

	// Used for generating tables
	public days$ = computed(() => this.getDaysInMonth(this.previewDate()));
	public months$ = computed(() => this.getLocalizedMonths());
	public previewDate$ = toObservable(this.previewDate);

	private getDaysInMonth(date: Date): number[] {
		const year = date.getFullYear();
		const month = date.getMonth();
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		return Array.from({ length: daysInMonth }, (_, i) => i + 1);
	}

	private getLocalizedMonths(): string[] {
		const formatter = new Intl.DateTimeFormat(this.locale() || 'en-US', { month: 'short' });
		return Array.from({ length: 12 }, (_, i) => formatter.format(new Date(0, i)));
	}

	private readonly yearsPerPage = 24;
	private readonly yearsPerRow = 4;

	/**
	 * Getters
	 */

	public getLocale(): string {
		return this._dateService.getLocale();
	}

	public getToday(): Date {
		return this._dateService.today();
	}

	public isToday(date: Date | null | undefined): boolean {
		const today = this._dateService.today();
		if (
			date &&
			today.getFullYear() === date.getFullYear() &&
			today.getMonth() === date.getMonth() &&
			today.getDate() === date.getDate()
		) {
			return true;
		}
		return false;
	}

	public readonly currentMonth = computed(() => this._dateService.getMonth(this.previewDate()));

	public readonly currentMonthName = computed(() => this._dateService.getMonthName(this.previewDate(), this.locale()));

	public readonly currentYear = computed(() => this._dateService.getYear(this.previewDate()));

	/**
	 * Updaters
	 */

	public updateDaysOfTheWeek(daysOfTheWeek: string[]): void {
		this.state.update((state) => ({
			...state,
			daysOfTheWeek,
		}));
	}

	public updateView(view: CalendarView): void {
		this.state.update((state) => ({
			...state,
			view,
		}));
	}

	public updateYears(years: number[][]): void {
		this.state.update((state) => ({
			...state,
			years,
		}));
	}

	public updateSelectedDate(selectedDate: Date): void {
		this.state.update((state) => ({
			...state,
			previewDate: selectedDate,
			selectedDate: selectedDate,
		}));
	}

	public updateSelectedMonth(monthIndex: number): void {
		this.state.update((state) => ({
			...state,
			previewDate: new Date(state.previewDate.getFullYear(), monthIndex, 1),
			view: 'days',
		}));
	}

	public updateCalendarWeeks(calendarWeeks: { date: Date | null; number: number | null; disabled: boolean }[][]): void {
		this.state.update((state) => ({ ...state, calendarWeeks }));
	}

	public updatePreviewDateYear(selectedYear: number): void {
		// Mat lib defaults to emitting month and year selections with
		// the current selected date. if null assumes first day of year
		this.state.update((state) => ({
			...state,
			previewDate: new Date(selectedYear, state.previewDate.getMonth(), 1),
			view: 'months',
		}));
	}

	private updateMonths(months: { name: string; index: number; disabled: boolean }[][]): void {
		this.state.update((state) => ({
			...state,
			months,
		}));
	}

	private updatePreviewDate(previewDate: Date): void {
		this.state.update((state) => ({
			...state,
			previewDate,
		}));
	}

	/**
	 * Methods
	 */

	public generateDaysOfWeek() {
		const formatter = new Intl.DateTimeFormat(this.locale() ?? undefined, { weekday: 'short' });
		const baseDate = new Date(Date.UTC(2021, 5, 7)); // A Sunday
		const daysOfTheWeek = [];
		for (let i = 0; i < 7; i++) {
			const date = new Date(baseDate);
			date.setDate(baseDate.getDate() + i);
			daysOfTheWeek.push(formatter.format(date));
		}
		this.updateDaysOfTheWeek(daysOfTheWeek);
	}

	public generateCalendar(): void {
		const firstDayOfMonth = new Date(this.previewDate().getFullYear(), this.previewDate().getMonth(), 1);
		const firstDayWeekday = firstDayOfMonth.getDay();
		const daysInMonth = this.days$().length;
		const calendarWeeks = [];

		let currentWeek: { number: number | null; date: Date | null; disabled: boolean }[] = [];

		for (let i = 0; i < firstDayWeekday; i++) {
			currentWeek.push({ number: null, date: null, disabled: true });
		}

		for (let day = 1; day <= daysInMonth; day++) {
			const date = new Date(this.previewDate().getFullYear(), this.previewDate().getMonth(), day);
			const disabled = this.isDateDisabled(date);
			currentWeek.push({ number: day, date, disabled });

			if (currentWeek.length === 7) {
				calendarWeeks.push(currentWeek);
				currentWeek = [];
			}
		}

		if (currentWeek.length > 0) {
			while (currentWeek.length < 7) {
				currentWeek.push({ number: null, date: null, disabled: true });
			}
			calendarWeeks.push(currentWeek);
		}
		this.updateCalendarWeeks(calendarWeeks);
	}

	public isDateDisabled(date: Date): boolean {
		return this.disabledDates().some(
			(disabledDate) =>
				disabledDate.getFullYear() === date.getFullYear() &&
				disabledDate.getMonth() === date.getMonth() &&
				disabledDate.getDate() === date.getDate(),
		);
	}

	public generateMonthsArray(): void {
		const months = this.months$();
		const monthRows = [];
		let row: { name: string; index: number; disabled: boolean }[] = [];

		months.forEach((month, index) => {
			row.push({ name: month, index, disabled: false });
			if (row.length === 3) {
				monthRows.push(row);
				row = [];
			}
		});

		if (row.length > 0) {
			monthRows.push(row);
		}
		this.updateMonths(monthRows);
	}

	// TODO: Maybe move this to cell directive
	public updateSelection(value: any): void {
		if (this.isView('months')) {
			this.updateSelectedMonth(value);
		} else if (this.isView('years')) {
			this.updatePreviewDateYear(value);
		} else {
			this.updateSelectedDate(value);
		}
	}

	/**
	 * Method to navigate the calendar apprpriately depending on the current view
	 * @param direction - NavigationDirection either 'next' or 'previous'
	 */
	public navigate(direction: NavigationDirection): void {
		const currentMonthYear = this.previewDate();
		const increment = direction === 'next' ? 1 : -1;

		if (this.isView('days') && currentMonthYear) {
			const newMonthDate = this._dateService.adjustMonth(currentMonthYear, 1 * increment);
			this.updatePreviewDate(newMonthDate);
		} else if (this.isView('months') && currentMonthYear) {
			const newYearDate = this._dateService.addCalendarMonths(currentMonthYear, 12 * increment);
			this.updatePreviewDate(newYearDate);
		} else if (this.isView('years') && currentMonthYear) {
			const newYearDate = this._dateService.addCalendarYears(currentMonthYear, this.yearsPerPage * increment);
			this.updatePreviewDate(newYearDate);
		}
	}

	public generateYears(): void {
		const monthYear = this.previewDate();
		if (monthYear && this._dateService.isDate(monthYear)) {
			// // We want a range years such that we maximize the number of
			// // enabled dates visible at once. This prevents issues where the minimum year
			// // is the last item of a page OR the maximum year is the first item of a page.
			// // The offset from the active year to the "slot" for the starting year is the
			// // *actual* first rendered year in the multi-year view.
			const years = [];
			const activeYear = this._dateService.getYear(monthYear);
			const minYearOfPage = activeYear - this.getActiveOffset(monthYear, this.minDate(), this.maxDate());
			for (let i = 0, row: number[] = []; i < this.yearsPerPage; i++) {
				row.push(minYearOfPage + i);
				if (row.length === this.yearsPerRow) {
					// years.push(row.map((year) => new Date(year, 0)));
					years.push(row.map((year) => year));
					row = [];
				}
			}
			this.updateYears(years);
		}
	}

	public switchView(): void {
		this.updateView(this.view() === 'years' ? 'months' : 'years');
	}

	public areDatesEqual(date1: Date | null, date2: Date | null): boolean {
		if (!date1 || !date2) {
			return false;
		}
		return (
			date1.getFullYear() === date2.getFullYear() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getDate() === date2.getDate()
		);
	}

	public isView(view: CalendarView): boolean {
		return this.view() === view;
	}

	/**
	 * When the multi-year view is first opened, the active year will be in view.
	 * So we compute how many years are between the active year and the *slot* where our
	 * "startingYear" will render when paged into view.
	 */
	private getActiveOffset(activeDate: Date, minDate: Date | null, maxDate: Date | null): number {
		if (activeDate && this._dateService.isDate(activeDate)) {
			const activeYear = this._dateService.getYear(activeDate);
			return this.euclideanModulo(activeYear - this.getStartingYear(minDate, maxDate), this.yearsPerPage);
		}
		return 0;
	}

	/**
	 * We pick a "starting" year such that either the maximum year would be at the end
	 * or the minimum year would be at the beginning of a page.
	 */
	private getStartingYear(minDate: Date | null, maxDate: Date | null): number {
		let startingYear = 0;
		if (maxDate) {
			const maxYear = this._dateService.getYear(maxDate);
			startingYear = maxYear - this.yearsPerPage + 1;
		} else if (minDate) {
			startingYear = this._dateService.getYear(minDate);
		}
		return startingYear;
	}

	/** Gets remainder that is non-negative, even if first number is negative */
	private euclideanModulo(a: number, b: number): number {
		return ((a % b) + b) % b;
	}
}
