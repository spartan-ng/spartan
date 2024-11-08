import { Injectable } from '@angular/core';

@Injectable()
export class DateService {
	today() {
		return new Date();
	}

	firstOfCurrentMonthYear() {
		const today = this.today();
		// Setting default time to 12 pm to avoid timezone issues
		return new Date(today.getFullYear(), today.getMonth(), 1);
	}

	getYear(date: Date): number {
		return date.getFullYear();
	}

	getMonth(date: Date): number {
		return date.getMonth();
	}

	getDate(date: Date): number {
		return date.getDate();
	}

	getMonthName(date: Date, locale: string, style: 'long' | 'short' | 'narrow' = 'long'): string {
		const formatter = new Intl.DateTimeFormat(locale, { month: style });
		return formatter.format(date);
	}

	isDate(date: unknown): boolean {
		return date instanceof Date;
	}

	// getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
	// 	const dtf = new Intl.DateTimeFormat(this.locale, { month: style, timeZone: 'utc' });
	// 	return range(12, (i) => this._format(dtf, new Date(2017, i, 1)));
	// }

	getDaysInMonth(date: Date): Date[] {
		const newDate = new Date(date);
		const month = newDate.getMonth();
		const days: Date[] = [];
		console.log(month);
		while (newDate.getMonth() === month) {
			days.push(new Date(newDate));
			newDate.setDate(newDate.getDate() + 1);
		}
		return days;
	}

	getLocale(): string {
		// Use navigator.language to get the user's preferred language
		return navigator.language || 'en-US';
	}

	adjustMonth(date: Date, increment: number): Date {
		const newDate = new Date(date); // Clone the original date
		newDate.setMonth(newDate.getMonth() + increment);

		// Handle end-of-month edge cases
		if (newDate.getDate() !== date.getDate()) {
			newDate.setDate(0);
		}

		return newDate;
	}

	/** Creates a date but allows the month and date to overflow. */
	private _createDateWithOverflow(year: number, month: number, date: number) {
		// Passing the year to the constructor causes year numbers <100 to be converted to 19xx.
		// To work around this we use `setFullYear` and `setHours` instead.
		const d = new Date();
		d.setFullYear(year, month, date);
		d.setHours(0, 0, 0, 0);
		return d;
	}

	addCalendarYears(date: Date, years: number): Date {
		return this.addCalendarMonths(date, years * 12);
	}

	addCalendarMonths(date: Date, months: number): Date {
		let newDate = this._createDateWithOverflow(this.getYear(date), this.getMonth(date) + months, this.getDate(date));

		// It's possible to wind up in the wrong month if the original month has more days than the new
		// month. In this case we want to go to the last day of the desired month.
		// Note: the additional + 12 % 12 ensures we end up with a positive number, since JS % doesn't
		// guarantee this.
		if (this.getMonth(newDate) !== (((this.getMonth(date) + months) % 12) + 12) % 12) {
			newDate = this._createDateWithOverflow(this.getYear(newDate), this.getMonth(newDate), 0);
		}

		return newDate;
	}

	addCalendarDays(date: Date, days: number): Date {
		return this._createDateWithOverflow(this.getYear(date), this.getMonth(date), this.getDate(date) + days);
	}
}
