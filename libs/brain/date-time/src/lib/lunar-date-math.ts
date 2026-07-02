export const LunarDateMath = {
	EPOCH_JDN: 1948437,

	isLeapYear(year: number): boolean {
		return (year * 11 + 14) % 30 < 11;
	},

	getDaysInMonth(year: number, month: number): number {
		if (month < 1 || month > 12) return 0;
		if (month === 12) return this.isLeapYear(year) ? 30 : 29;
		return month % 2 === 1 ? 30 : 29;
	},

	yearDays(year: number): number {
		return this.isLeapYear(year) ? 355 : 354;
	},

	jdnToGregorian(jdn: number): [number, number, number] {
		const a = jdn + 32044;
		const b = Math.floor((4 * a + 3) / 146097);
		const c = a - Math.floor((146097 * b) / 4);
		const d = Math.floor((4 * c + 3) / 1461);
		const e = c - Math.floor((1461 * d) / 4);
		const m = Math.floor((5 * e + 2) / 153);
		const day = e - Math.floor((153 * m + 2) / 5) + 1;
		const month = m + 3 - 12 * Math.floor(m / 10);
		const year = 100 * b + d - 4800 + Math.floor(m / 10);
		return [year, month, day];
	},

	gregorianToJDN(year: number, month: number, day: number): number {
		const a = Math.floor((14 - month) / 12);
		const y = year + 4800 - a;
		const m = month + 12 * a - 3;
		return (
			day +
			Math.floor((153 * m + 2) / 5) +
			365 * y +
			Math.floor(y / 4) -
			Math.floor(y / 100) +
			Math.floor(y / 400) -
			32045
		);
	},

	lunarToJDN(year: number, month: number, day: number): number {
		const yearOffset = year - 1;
		const totalDays = yearOffset * 354 + Math.floor((yearOffset * 11 + 14) / 30);
		let monthDays = 0;
		for (let m = 1; m < month; m++) {
			monthDays += this.getDaysInMonth(year, m);
		}
		return this.EPOCH_JDN + totalDays + monthDays + day - 1;
	},

	lunarToGregorian(year: number, month: number, day: number): [number, number, number] {
		const jdn = this.lunarToJDN(year, month, day);
		return this.jdnToGregorian(jdn);
	},

	gregorianToLunar(year: number, month: number, day: number): [number, number, number] {
		const targetJDN = this.gregorianToJDN(year, month, day);
		const daysSinceEpoch = targetJDN - this.EPOCH_JDN;
		if (daysSinceEpoch < 0) {
			throw new RangeError(
				`Date ${year}-${month}-${day} is before the Hijri epoch (${this.jdnToGregorian(this.EPOCH_JDN).join('-')})`,
			);
		}

		const cycles = Math.floor(daysSinceEpoch / 10631);
		let remainingDays = daysSinceEpoch - cycles * 10631;
		let lunarYear = 1 + cycles * 30;

		for (let y = lunarYear; y < lunarYear + 30; y++) {
			const yd = this.yearDays(y);
			if (remainingDays < yd) {
				lunarYear = y;
				break;
			}
			remainingDays -= yd;
		}

		for (let m = 1; m <= 12; m++) {
			const md = this.getDaysInMonth(lunarYear, m);
			if (remainingDays < md) {
				return [lunarYear, m, remainingDays + 1];
			}
			remainingDays -= md;
		}

		return [lunarYear, 12, this.getDaysInMonth(lunarYear, 12)];
	},

	isValidDate(year: number, month: number, day: number): boolean {
		if (year < 1 || month < 1 || month > 12 || day < 1) return false;
		return day <= this.getDaysInMonth(year, month);
	},
};
