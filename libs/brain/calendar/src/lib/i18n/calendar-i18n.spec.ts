import { BrnCalendarI18nService } from './calendar-i18n';

describe('BrnCalendarI18nService', () => {
	afterEach(() => vi.restoreAllMocks());

	describe('defaultCalendarI18n', () => {
		it('should set years to 100 years in the past and 10 years in the future relative to the current date', () => {
			vi.spyOn(Date.prototype, 'getFullYear').mockReturnValueOnce(2025).mockReturnValueOnce(2026);

			const years = new BrnCalendarI18nService().config().years();

			expect(years).toHaveLength(111);
			expect(years[0]).toBe(1925);
			expect(years.at(-1)).toBe(2035);
		});
	});
});
