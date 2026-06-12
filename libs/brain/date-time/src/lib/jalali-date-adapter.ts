import type { BrnDateAdapter, BrnDateUnits, BrnDuration } from './date-adapter';
import { JalaliDate } from './jalali-date';
import { PersianDate } from './persian-date';

export class BrnJalaliDateAdapter implements BrnDateAdapter<JalaliDate> {
	create({ year, month, day }: BrnDateUnits): JalaliDate {
		const now = this.now();
		const m = month !== undefined ? month + 1 : now.month;
		return new JalaliDate(year ?? now.year, m, day ?? now.day);
	}

	now(): JalaliDate {
		const d = new Date();
		const [y, m, day] = PersianDate.gregorianToJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
		return new JalaliDate(y, m, day);
	}

	set(date: JalaliDate, values: BrnDateUnits): JalaliDate {
		const y = values.year ?? date.year;
		const m = values.month !== undefined ? values.month + 1 : date.month;
		const d = values.day ?? date.day;
		return this._constrain(y, m, d);
	}

	add(date: JalaliDate, duration: BrnDuration): JalaliDate {
		let { year, month, day } = date;

		if (duration.years) {
			year += duration.years;
		}

		if (duration.months) {
			month += duration.months;
			if (month > 12) {
				year += Math.floor((month - 1) / 12);
				month = ((month - 1) % 12) + 1;
			} else if (month < 1) {
				year += Math.floor((month - 1) / 12);
				month = ((((month - 1) % 12) + 12) % 12) + 1;
			}
		}

		if (duration.days) {
			const g = PersianDate.jalaliToGregorian(year, month, day);
			const jsDate = new Date(g[0], g[1] - 1, g[2]);
			jsDate.setDate(jsDate.getDate() + duration.days);
			[year, month, day] = PersianDate.gregorianToJalali(jsDate.getFullYear(), jsDate.getMonth() + 1, jsDate.getDate());
		}

		return this._constrain(year, month, day);
	}

	subtract(date: JalaliDate, duration: BrnDuration): JalaliDate {
		return this.add(date, {
			years: duration.years ? -duration.years : undefined,
			months: duration.months ? -duration.months : undefined,
			days: duration.days ? -duration.days : undefined,
		});
	}

	compare(a: JalaliDate, b: JalaliDate): number {
		const diff = a.valueOf() - b.valueOf();
		return diff === 0 ? 0 : diff > 0 ? 1 : -1;
	}

	isEqual(a: JalaliDate, b: JalaliDate): boolean {
		return a.valueOf() === b.valueOf();
	}

	isBefore(a: JalaliDate, b: JalaliDate): boolean {
		return a.valueOf() < b.valueOf();
	}

	isAfter(a: JalaliDate, b: JalaliDate): boolean {
		return a.valueOf() > b.valueOf();
	}

	isSameDay(a: JalaliDate, b: JalaliDate): boolean {
		return a.year === b.year && a.month === b.month && a.day === b.day;
	}

	isSameMonth(a: JalaliDate, b: JalaliDate): boolean {
		return a.year === b.year && a.month === b.month;
	}

	isSameYear(a: JalaliDate, b: JalaliDate): boolean {
		return a.year === b.year;
	}

	getYear(date: JalaliDate): number {
		return date.year;
	}

	getMonth(date: JalaliDate): number {
		return date.month - 1;
	}

	getDate(date: JalaliDate): number {
		return date.day;
	}

	getDay(date: JalaliDate): number {
		const g = PersianDate.jalaliToGregorian(date.year, date.month, date.day);
		return new Date(g[0], g[1] - 1, g[2]).getDay();
	}

	getHours(_date: JalaliDate): number {
		return 0;
	}

	getMinutes(_date: JalaliDate): number {
		return 0;
	}

	getSeconds(_date: JalaliDate): number {
		return 0;
	}

	getMilliseconds(_date: JalaliDate): number {
		return 0;
	}

	getTime(date: JalaliDate): number {
		return date.valueOf();
	}

	startOfMonth(date: JalaliDate): JalaliDate {
		return new JalaliDate(date.year, date.month, 1);
	}

	endOfMonth(date: JalaliDate): JalaliDate {
		return new JalaliDate(date.year, date.month, PersianDate.getDaysInMonth(date.year, date.month));
	}

	startOfDay(date: JalaliDate): JalaliDate {
		return date;
	}

	endOfDay(date: JalaliDate): JalaliDate {
		return date;
	}

	private _constrain(year: number, month: number, day: number): JalaliDate {
		const maxDay = PersianDate.getDaysInMonth(year, month);
		return new JalaliDate(year, month, Math.min(day, maxDay));
	}
}
