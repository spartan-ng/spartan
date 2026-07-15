import type { BrnDateAdapter, BrnDateUnits, BrnDuration } from './date-adapter';
import { LunarDate } from './lunar-date';
import { LunarDateMath } from './lunar-date-math';

export class BrnLunarDateAdapter implements BrnDateAdapter<LunarDate> {
	create({ year, month, day }: BrnDateUnits): LunarDate {
		const now = this.now();
		const m = month !== undefined ? month + 1 : now.month;
		return this._constrain(year ?? now.year, m, day ?? now.day);
	}

	now(): LunarDate {
		const today = new Date();
		const [lunarYear, lunarMonth, lunarDay] = LunarDateMath.gregorianToLunar(
			today.getFullYear(),
			today.getMonth() + 1,
			today.getDate(),
		);
		return this._constrain(lunarYear, lunarMonth, lunarDay);
	}

	set(date: LunarDate, values: BrnDateUnits): LunarDate {
		const year = values.year ?? date.year;
		const month = values.month !== undefined ? values.month + 1 : date.month;
		const day = values.day ?? date.day;
		return this._constrain(year, month, day);
	}

	add(date: LunarDate, duration: BrnDuration): LunarDate {
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
			day = Math.min(day, LunarDateMath.getDaysInMonth(year, month));
		}

		if (duration.days) {
			const [gregorianYear, gregorianMonth, gregorianDay] = LunarDateMath.lunarToGregorian(year, month, day);
			const jsDate = new Date(gregorianYear, gregorianMonth - 1, gregorianDay);
			jsDate.setDate(jsDate.getDate() + duration.days);
			[year, month, day] = LunarDateMath.gregorianToLunar(
				jsDate.getFullYear(),
				jsDate.getMonth() + 1,
				jsDate.getDate(),
			);
		}

		return this._constrain(year, month, day);
	}

	subtract(date: LunarDate, duration: BrnDuration): LunarDate {
		return this.add(date, {
			years: duration.years ? -duration.years : undefined,
			months: duration.months ? -duration.months : undefined,
			days: duration.days ? -duration.days : undefined,
		});
	}

	compare(a: LunarDate, b: LunarDate): number {
		const diff = a.valueOf() - b.valueOf();
		return diff === 0 ? 0 : diff > 0 ? 1 : -1;
	}

	isEqual(a: LunarDate, b: LunarDate): boolean {
		return a.valueOf() === b.valueOf();
	}

	isBefore(a: LunarDate, b: LunarDate): boolean {
		return a.valueOf() < b.valueOf();
	}

	isAfter(a: LunarDate, b: LunarDate): boolean {
		return a.valueOf() > b.valueOf();
	}

	isSameDay(a: LunarDate, b: LunarDate): boolean {
		return a.year === b.year && a.month === b.month && a.day === b.day;
	}

	isSameMonth(a: LunarDate, b: LunarDate): boolean {
		return a.year === b.year && a.month === b.month;
	}

	isSameYear(a: LunarDate, b: LunarDate): boolean {
		return a.year === b.year;
	}

	getYear(date: LunarDate): number {
		return date.year;
	}

	getMonth(date: LunarDate): number {
		return date.month - 1;
	}

	getDate(date: LunarDate): number {
		return date.day;
	}

	getDay(date: LunarDate): number {
		const [gregorianYear, gregorianMonth, gregorianDay] = LunarDateMath.lunarToGregorian(
			date.year,
			date.month,
			date.day,
		);
		return new Date(gregorianYear, gregorianMonth - 1, gregorianDay).getDay();
	}

	getHours(_date: LunarDate): number {
		return 0;
	}

	getMinutes(_date: LunarDate): number {
		return 0;
	}

	getSeconds(_date: LunarDate): number {
		return 0;
	}

	getMilliseconds(_date: LunarDate): number {
		return 0;
	}

	getTime(date: LunarDate): number {
		return date.valueOf();
	}

	startOfMonth(date: LunarDate): LunarDate {
		return new LunarDate(date.year, date.month, 1);
	}

	endOfMonth(date: LunarDate): LunarDate {
		return new LunarDate(date.year, date.month, LunarDateMath.getDaysInMonth(date.year, date.month));
	}

	startOfDay(date: LunarDate): LunarDate {
		return date;
	}

	endOfDay(date: LunarDate): LunarDate {
		return date;
	}

	private _constrain(year: number, month: number, day: number): LunarDate {
		const maxDay = LunarDateMath.getDaysInMonth(year, month);
		return new LunarDate(year, month, Math.min(day, maxDay));
	}
}
