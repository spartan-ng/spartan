export const PersianDate = {
	gregorianDaysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
	jalaliDaysInMonth: [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29],

	jalaliToGregorian: function (jalaliYear: number, jalaliMonth: number, jalaliDay: number): [number, number, number] {
		const jalaliYearDelta = jalaliYear - 979;
		const jalaliMonthIdx = jalaliMonth - 1;
		const jalaliDayIdx = jalaliDay - 1;

		let jalaliDayNo =
			365 * jalaliYearDelta + Math.floor(jalaliYearDelta / 33) * 8 + Math.floor(((jalaliYearDelta % 33) + 3) / 4);
		for (let i = 0; i < jalaliMonthIdx; ++i) jalaliDayNo += this.jalaliDaysInMonth[i];

		jalaliDayNo += jalaliDayIdx;

		let gregorianDayNo = jalaliDayNo + 79;

		let gregorianYear = 1600 + 400 * Math.floor(gregorianDayNo / 146097);
		gregorianDayNo = gregorianDayNo % 146097;

		let leap = true;
		if (gregorianDayNo >= 36525) {
			gregorianDayNo--;
			gregorianYear += 100 * Math.floor(gregorianDayNo / 36524);
			gregorianDayNo = gregorianDayNo % 36524;

			if (gregorianDayNo >= 365) gregorianDayNo++;
			else leap = false;
		}

		gregorianYear += 4 * Math.floor(gregorianDayNo / 1461);
		gregorianDayNo %= 1461;

		if (gregorianDayNo >= 366) {
			leap = false;
			gregorianDayNo--;
			gregorianYear += Math.floor(gregorianDayNo / 365);
			gregorianDayNo = gregorianDayNo % 365;
		}

		let i = 0;
		for (; gregorianDayNo >= this.gregorianDaysInMonth[i] + (i === 1 && leap ? 1 : 0); i++) {
			gregorianDayNo -= this.gregorianDaysInMonth[i] + (i === 1 && leap ? 1 : 0);
		}

		const gregorianMonth = i + 1;
		const gregorianDay = gregorianDayNo + 1;

		return [gregorianYear, gregorianMonth, gregorianDay];
	},

	gregorianToJalali: function (
		gregorianYear: number,
		gregorianMonth: number,
		gregorianDay: number,
	): [number, number, number] {
		const gregorianYearDelta = gregorianYear - 1600;
		const gregorianMonthIdx = gregorianMonth - 1;
		const gregorianDayIdx = gregorianDay - 1;

		let gregorianDayNo =
			365 * gregorianYearDelta +
			Math.floor((gregorianYearDelta + 3) / 4) -
			Math.floor((gregorianYearDelta + 99) / 100) +
			Math.floor((gregorianYearDelta + 399) / 400);

		for (let i = 0; i < gregorianMonthIdx; ++i) gregorianDayNo += this.gregorianDaysInMonth[i];

		if (
			gregorianMonthIdx > 1 &&
			((gregorianYearDelta % 4 === 0 && gregorianYearDelta % 100 !== 0) || gregorianYearDelta % 400 === 0)
		)
			gregorianDayNo++;

		gregorianDayNo += gregorianDayIdx;

		let jalaliDayNo = gregorianDayNo - 79;
		const jalaliCycleCount = Math.floor(jalaliDayNo / 12053);
		jalaliDayNo = jalaliDayNo % 12053;

		let jalaliYear = 979 + 33 * jalaliCycleCount + 4 * Math.floor(jalaliDayNo / 1461);

		jalaliDayNo %= 1461;

		if (jalaliDayNo >= 366) {
			jalaliYear += Math.floor((jalaliDayNo - 1) / 365);
			jalaliDayNo = (jalaliDayNo - 1) % 365;
		}

		let i = 0;
		for (; i < 11 && jalaliDayNo >= this.jalaliDaysInMonth[i]; ++i) {
			jalaliDayNo -= this.jalaliDaysInMonth[i];
		}

		const jalaliMonth = i + 1;
		const jalaliDay = jalaliDayNo + 1;

		return [jalaliYear, jalaliMonth, jalaliDay];
	},

	isLeapJalaliYear: function (year: number): boolean {
		const breaks = [1, 5, 9, 13, 17, 22, 26, 30];
		return breaks.includes(year % 33);
	},

	getDaysInMonth: function (year: number, month: number): number {
		if (month < 1 || month > 12) return 0;
		if (month <= 6) return 31;
		if (month <= 11) return 30;
		return this.isLeapJalaliYear(year) ? 30 : 29;
	},

	getDayOfWeek: function (jalaliYear: number, jalaliMonth: number, jalaliDay: number): number {
		const [gregorianYear, gregorianMonth, gregorianDay] = this.jalaliToGregorian(jalaliYear, jalaliMonth, jalaliDay);
		const date = new Date(gregorianYear, gregorianMonth - 1, gregorianDay);
		return date.getDay();
	},

	getDaysInYear: function (year: number): number {
		return this.isLeapJalaliYear(year) ? 366 : 365;
	},

	isValidDate: function (year: number, month: number, day: number): boolean {
		if (year < 0 || month < 1 || month > 12 || day < 1) return false;
		return day <= this.getDaysInMonth(year, month);
	},
};
