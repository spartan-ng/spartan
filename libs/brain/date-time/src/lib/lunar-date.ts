import { LunarDateMath } from './lunar-date-math';

export class LunarDate {
	constructor(
		public readonly year: number,
		public readonly month: number,
		public readonly day: number,
	) {
		if (!LunarDateMath.isValidDate(year, month, day)) {
			throw new Error(`Invalid LunarDate: ${year}/${month}/${day}`);
		}
	}

	valueOf(): number {
		const [gregorianYear, gregorianMonth, gregorianDay] = LunarDateMath.lunarToGregorian(
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
