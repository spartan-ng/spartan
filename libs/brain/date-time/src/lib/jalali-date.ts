import { PersianDate } from './persian-date';

export class JalaliDate {
	constructor(
		public readonly year: number,
		public readonly month: number,
		public readonly day: number,
	) {}

	valueOf(): number {
		const [gregorianYear, gregorianMonth, gregorianDay] = PersianDate.jalaliToGregorian(
			this.year,
			this.month,
			this.day,
		);
		return new Date(gregorianYear, gregorianMonth - 1, gregorianDay).getTime();
	}

	toString(): string {
		return `${this.year}/${String(this.month).padStart(2, '0')}/${String(this.day).padStart(2, '0')}`;
	}
}
