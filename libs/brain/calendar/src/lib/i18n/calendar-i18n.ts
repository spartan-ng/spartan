import { inject, Injectable, InjectionToken, type Provider, signal } from '@angular/core';

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface BrnCalendarI18n {
	formatWeekdayName: (index: number) => string;
	formatHeader: (month: number, year: number) => string;
	formatYear: (year: number) => string;
	formatMonth: (month: number) => string;
	labelPrevious: () => string;
	labelNext: () => string;
	labelWeekday: (index: number) => string;
	months: () => [string, string, string, string, string, string, string, string, string, string, string, string];
	years: (startYear?: number, endYear?: number) => number[];
	firstDayOfWeek: () => Weekday;
}

export const BrnCalendarI18nToken = new InjectionToken<BrnCalendarI18nService>('BrnCalendarI18nToken');

/**
 * Provide the calendar i18n configuration.
 */
export function provideBrnCalendarI18n(configuration?: BrnCalendarI18n): Provider {
	return {
		provide: BrnCalendarI18nToken,
		useFactory: () => {
			const service = new BrnCalendarI18nService();
			service.use(configuration ?? defaultCalendarI18n);
			return service;
		},
	};
}

const defaultCalendarI18n: BrnCalendarI18n = {
	formatWeekdayName: (index: number) => {
		const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
		return weekdays[index];
	},
	months: () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	years: (startYear = 1925, endYear = new Date().getFullYear() + 1) =>
		Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i),
	formatHeader: (month: number, year: number) => {
		return new Date(year, month).toLocaleDateString(undefined, {
			month: 'long',
			year: 'numeric',
		});
	},
	formatMonth: (month: number) => {
		return new Date(2000, month).toLocaleDateString(undefined, {
			month: 'short',
		});
	},
	formatYear: (year: number): string => {
		return new Date(year, 0).toLocaleDateString(undefined, {
			year: 'numeric',
		});
	},
	labelPrevious: () => 'Go to the previous month',
	labelNext: () => 'Go to the next month',
	labelWeekday: (index: number) => {
		const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		return weekdays[index];
	},
	firstDayOfWeek: () => 0,
};

/**
 * Inject the calendar i18n configuration.
 */
export function injectBrnCalendarI18n(): BrnCalendarI18nService {
	return inject(BrnCalendarI18nToken, { optional: true }) ?? inject(BrnCalendarI18nService); // fallback
}

@Injectable({ providedIn: 'root' })
export class BrnCalendarI18nService {
	private readonly _config = signal<BrnCalendarI18n>(defaultCalendarI18n);

	public readonly config = this._config.asReadonly();

	public use(config: Partial<BrnCalendarI18n>) {
		this._config.set({ ...this.config(), ...config });
	}
}
