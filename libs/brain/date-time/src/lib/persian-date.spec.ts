import { PersianDate } from './persian-date';

describe('PersianDate', () => {
	describe('jalaliToGregorian', () => {
		test('should convert 1400-01-01 to 2021-03-21', () => {
			expect(PersianDate.jalaliToGregorian(1400, 1, 1)).toEqual([2021, 3, 21]);
		});

		test('should convert 1399-12-30 (leap year) to 2021-03-20', () => {
			expect(PersianDate.jalaliToGregorian(1399, 12, 30)).toEqual([2021, 3, 20]);
		});

		test('should convert 1400-12-29 (non-leap year) to 2022-03-20', () => {
			expect(PersianDate.jalaliToGregorian(1400, 12, 29)).toEqual([2022, 3, 20]);
		});

		test('should convert 1403-12-30 (leap year) to 2025-03-20', () => {
			expect(PersianDate.jalaliToGregorian(1403, 12, 30)).toEqual([2025, 3, 20]);
		});
	});

	describe('gregorianToJalali', () => {
		test('should convert 2021-03-21 to 1400-01-01', () => {
			expect(PersianDate.gregorianToJalali(2021, 3, 21)).toEqual([1400, 1, 1]);
		});

		test('should convert 2021-03-20 to 1399-12-30 (leap year)', () => {
			expect(PersianDate.gregorianToJalali(2021, 3, 20)).toEqual([1399, 12, 30]);
		});

		test('should convert 2022-03-20 to 1400-12-29 (non-leap year)', () => {
			expect(PersianDate.gregorianToJalali(2022, 3, 20)).toEqual([1400, 12, 29]);
		});

		test('should convert 2025-03-20 to 1403-12-30 (leap year)', () => {
			expect(PersianDate.gregorianToJalali(2025, 3, 20)).toEqual([1403, 12, 30]);
		});
	});

	describe('round-trip', () => {
		test('should return the original date when converting back and forth', () => {
			const testDates: [number, number, number][] = [
				[1400, 1, 1],
				[1400, 6, 31],
				[1400, 7, 1],
				[1400, 12, 29],
				[1399, 12, 30],
				[1403, 12, 30],
				[1378, 10, 11],
				[1300, 1, 1],
				[1500, 6, 15],
			];
			for (const [y, m, d] of testDates) {
				const [gy, gm, gd] = PersianDate.jalaliToGregorian(y, m, d);
				const [jy, jm, jd] = PersianDate.gregorianToJalali(gy, gm, gd);
				expect([jy, jm, jd]).toEqual([y, m, d]);
			}
		});
	});

	describe('isLeapJalaliYear', () => {
		test('should return true for leap years', () => {
			expect(PersianDate.isLeapJalaliYear(1399)).toBe(true);
			expect(PersianDate.isLeapJalaliYear(1403)).toBe(true);
			expect(PersianDate.isLeapJalaliYear(1)).toBe(true);
			expect(PersianDate.isLeapJalaliYear(5)).toBe(true);
		});

		test('should return false for non-leap years', () => {
			expect(PersianDate.isLeapJalaliYear(1400)).toBe(false);
			expect(PersianDate.isLeapJalaliYear(1401)).toBe(false);
			expect(PersianDate.isLeapJalaliYear(1402)).toBe(false);
			expect(PersianDate.isLeapJalaliYear(0)).toBe(false);
		});
	});

	describe('getDaysInMonth', () => {
		test('should return 31 for months 1-6', () => {
			for (let m = 1; m <= 6; m++) {
				expect(PersianDate.getDaysInMonth(1400, m)).toBe(31);
			}
		});

		test('should return 30 for months 7-11', () => {
			for (let m = 7; m <= 11; m++) {
				expect(PersianDate.getDaysInMonth(1400, m)).toBe(30);
			}
		});

		test('should return 29 for month 12 in non-leap year', () => {
			expect(PersianDate.getDaysInMonth(1400, 12)).toBe(29);
		});

		test('should return 30 for month 12 in leap year', () => {
			expect(PersianDate.getDaysInMonth(1399, 12)).toBe(30);
			expect(PersianDate.getDaysInMonth(1403, 12)).toBe(30);
		});

		test('should return 0 for invalid months', () => {
			expect(PersianDate.getDaysInMonth(1400, 0)).toBe(0);
			expect(PersianDate.getDaysInMonth(1400, 13)).toBe(0);
		});
	});

	describe('getDaysInYear', () => {
		test('should return 365 for non-leap year', () => {
			expect(PersianDate.getDaysInYear(1400)).toBe(365);
		});

		test('should return 366 for leap year', () => {
			expect(PersianDate.getDaysInYear(1399)).toBe(366);
			expect(PersianDate.getDaysInYear(1403)).toBe(366);
		});
	});

	describe('isValidDate', () => {
		test('should return true for valid dates', () => {
			expect(PersianDate.isValidDate(1400, 1, 1)).toBe(true);
			expect(PersianDate.isValidDate(1400, 6, 31)).toBe(true);
			expect(PersianDate.isValidDate(1400, 7, 30)).toBe(true);
			expect(PersianDate.isValidDate(1400, 12, 29)).toBe(true);
			expect(PersianDate.isValidDate(1399, 12, 30)).toBe(true);
		});

		test('should return false for invalid dates', () => {
			expect(PersianDate.isValidDate(1400, 0, 1)).toBe(false);
			expect(PersianDate.isValidDate(1400, 13, 1)).toBe(false);
			expect(PersianDate.isValidDate(1400, 1, 0)).toBe(false);
			expect(PersianDate.isValidDate(1400, 1, 32)).toBe(false);
			expect(PersianDate.isValidDate(1400, 7, 31)).toBe(false);
			expect(PersianDate.isValidDate(1400, 12, 30)).toBe(false);
			expect(PersianDate.isValidDate(-1, 1, 1)).toBe(false);
		});
	});

	describe('getDayOfWeek', () => {
		test('should return correct day of week', () => {
			expect(PersianDate.getDayOfWeek(1400, 1, 1)).toBe(0);
		});
	});
});
