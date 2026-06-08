export const PersianDate = {
	g_days_in_month: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
	j_days_in_month: [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29],

	jalaliToGregorian: function (j_y: number, j_m: number, j_d: number): [number, number, number] {
		j_y = parseInt(j_y.toString());
		j_m = parseInt(j_m.toString());
		j_d = parseInt(j_d.toString());

		const jy = j_y - 979;
		const jm = j_m - 1;
		const jd = j_d - 1;

		let jDayNo = 365 * jy + Math.floor(jy / 33) * 8 + Math.floor(((jy % 33) + 3) / 4);
		for (let i = 0; i < jm; ++i) jDayNo += this.j_days_in_month[i];

		jDayNo += jd;

		let gDayNo = jDayNo + 79;

		let gy = 1600 + 400 * Math.floor(gDayNo / 146097);
		gDayNo = gDayNo % 146097;

		let leap = true;
		if (gDayNo >= 36525) {
			gDayNo--;
			gy += 100 * Math.floor(gDayNo / 36524);
			gDayNo = gDayNo % 36524;

			if (gDayNo >= 365) gDayNo++;
			else leap = false;
		}

		gy += 4 * Math.floor(gDayNo / 1461);
		gDayNo %= 1461;

		if (gDayNo >= 366) {
			leap = false;
			gDayNo--;
			gy += Math.floor(gDayNo / 365);
			gDayNo = gDayNo % 365;
		}

		let i = 0;
		for (; gDayNo >= this.g_days_in_month[i] + (i === 1 && leap ? 1 : 0); i++) {
			gDayNo -= this.g_days_in_month[i] + (i === 1 && leap ? 1 : 0);
		}

		const gm = i + 1;
		const gd = gDayNo + 1;

		return [gy, gm, gd];
	},

	gregorianToJalali: function (g_y: number, g_m: number, g_d: number): [number, number, number] {
		g_y = parseInt(g_y.toString());
		g_m = parseInt(g_m.toString());
		g_d = parseInt(g_d.toString());

		const gy = g_y - 1600;
		const gm = g_m - 1;
		const gd = g_d - 1;

		let gDayNo = 365 * gy + Math.floor((gy + 3) / 4) - Math.floor((gy + 99) / 100) + Math.floor((gy + 399) / 400);

		for (let i = 0; i < gm; ++i) gDayNo += this.g_days_in_month[i];

		if (gm > 1 && ((gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0)) gDayNo++;

		gDayNo += gd;

		let jDayNo = gDayNo - 79;
		const jNp = Math.floor(jDayNo / 12053);
		jDayNo = jDayNo % 12053;

		let jy = 979 + 33 * jNp + 4 * Math.floor(jDayNo / 1461);

		jDayNo %= 1461;

		if (jDayNo >= 366) {
			jy += Math.floor((jDayNo - 1) / 365);
			jDayNo = (jDayNo - 1) % 365;
		}

		let i = 0;
		for (; i < 11 && jDayNo >= this.j_days_in_month[i]; ++i) {
			jDayNo -= this.j_days_in_month[i];
		}

		const jm = i + 1;
		const jd = jDayNo + 1;

		return [jy, jm, jd];
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

	getMonthName: function (month: number): string {
		const monthNames = [
			'فروردین',
			'اردیبهشت',
			'خرداد',
			'تیر',
			'مرداد',
			'شهریور',
			'مهر',
			'آبان',
			'آذر',
			'دی',
			'بهمن',
			'اسفند',
		];
		return monthNames[month - 1];
	},

	getDayOfWeek: function (jYear: number, jMonth: number, jDay: number): number {
		const gdate = this.jalaliToGregorian(jYear, jMonth, jDay);
		const date = new Date(gdate[0], gdate[1] - 1, gdate[2]);
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
