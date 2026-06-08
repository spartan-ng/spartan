import { PersianDate } from './persian-date';

export class JalaliDate {
	constructor(
		public readonly year: number,
		public readonly month: number,
		public readonly day: number,
	) {}

	valueOf(): number {
		const g = PersianDate.jalaliToGregorian(this.year, this.month, this.day);
		return new Date(g[0], g[1] - 1, g[2]).getTime();
	}

	toString(): string {
		return `${this.year}/${String(this.month).padStart(2, '0')}/${String(this.day).padStart(2, '0')}`;
	}
}
