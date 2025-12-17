import { ChangeDetectionStrategy, Component, inject, Injectable, OnInit, signal } from '@angular/core';
import {
	BrnCalendarI18nService,
	injectBrnCalendarI18n,
	MonthLabels,
	provideBrnCalendarI18n,
} from '@spartan-ng/brain/calendar';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCalendar } from '@spartan-ng/helm/calendar';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSelectImports } from '@spartan-ng/helm/select';

const localizedStrings = {
	vi: {
		title: 'Đặt lịch hẹn',
		description: 'Vui lòng chọn ngày và giờ cho lịch hẹn',
	},

	de: {
		title: 'Termin buchen',
		description: 'Bitte wählen Sie ein Datum für Ihren Termin aus',
	},

	en: {
		title: 'Book an appointment',
		description: 'Select a date for your appointment',
	},
} as const;

const CALENDAR_I18N = {
	vi: {
		formatWeekdayName: (i: number) => ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][i],
		formatHeader: (month: number, year: number) => `${month + 1} / ${year}`,
		formatYear: (year: number) => `${year}`,
		formatMonth: (month: number) => `Th${month + 1}`,
		labelPrevious: () => 'Tháng trước',
		labelNext: () => 'Tháng sau',
		labelWeekday: (i: number) => ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'][i],
		months: () =>
			['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'] as MonthLabels,

		years: (startYear = 1925, endYear = new Date().getFullYear()) =>
			Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i),
		firstDayOfWeek: () => 1 as const,
	},

	en: {
		formatWeekdayName: (i: number) => ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][i],
		months: () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as MonthLabels,

		years: (startYear = 1925, endYear = new Date().getFullYear()) =>
			Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i),
		formatHeader: (month: number, year: number) =>
			new Date(year, month).toLocaleDateString('en', { month: 'long', year: 'numeric' }),
		formatMonth: (m: number) => new Date(2000, m).toLocaleDateString('en', { month: 'short' }),
		formatYear: (y: number) => `${y}`,
		labelPrevious: () => 'Previous month',
		labelNext: () => 'Next month',
		labelWeekday: (i: number) => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i],
		firstDayOfWeek: () => 0 as const,
	} as const,

	de: {
		formatWeekdayName: (i: number) => ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'][i],
		months: () => ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'] as MonthLabels,
		years: (startYear = 1925, endYear = new Date().getFullYear()) =>
			Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i),
		formatHeader: (month: number, year: number) =>
			new Date(year, month).toLocaleDateString('de', { month: 'long', year: 'numeric' }),
		formatMonth: (m: number) => new Date(2000, m).toLocaleDateString('de', { month: 'short' }),
		formatYear: (y: number) => `${y}`,
		labelPrevious: () => 'Vorheriger Monat',
		labelNext: () => 'Nächster Monat',
		labelWeekday: (i: number) => ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'][i],
		firstDayOfWeek: () => 1 as const,
	},
} as const;

const timeSlots: string[] = Array.from({ length: 37 }, (_, i) => {
	const totalMinutes = i * 15;
	const hour = Math.floor(totalMinutes / 60) + 9;
	const minute = totalMinutes % 60;

	return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
});

@Injectable({ providedIn: 'root' })
export class LanguageService {
	public language = signal<'en' | 'vi' | 'de'>('vi');

	setLanguage(lang: 'en' | 'vi' | 'de') {
		this.language.set(lang);
	}
}

@Component({
	selector: 'spartan-calendar-localized',
	imports: [HlmCalendar, BrnSelectImports, HlmSelectImports, HlmCardImports, HlmButtonImports],
	providers: [provideBrnCalendarI18n(CALENDAR_I18N.vi)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex justify-center items-start p-3 md:p-20 w-full h-auto md:h-[600px] bg-surface rounded-lg',
	},
	template: `
		<section class="w-full max-w-sm overflow-auto" hlmCard>
			<div hlmCardHeader>
				<h3 hlmCardTitle>{{ _strings[lang].title }}</h3>
				<p hlmCardDescription>{{ _strings[lang].description }}</p>

				<div hlmCardAction>
					<brn-select [value]="lang" (valueChange)="setLang($event)">
						<hlm-select-trigger>
							<hlm-select-value />
						</hlm-select-trigger>

						<hlm-select-content>
							@for (l of _supportedLanguages; track l) {
								<hlm-option [value]="l">{{ l }}</hlm-option>
							}
						</hlm-select-content>
					</brn-select>
				</div>
			</div>

			<div hlmCardContent class="flex flex-row gap-3 px-6">
				<hlm-calendar class="h-80" />

				<div class="no-scrollbar flex h-80 scroll-pb-6 flex-col gap-2 overflow-y-auto">
					@for (time of _timeSlots; track time) {
						<button hlmBtn class="w-full shadow-none">
							{{ time }}
						</button>
					}
				</div>
			</div>
		</section>
	`,
})
export class CalendarLocalizedComponent implements OnInit {
	protected readonly _timeSlots = timeSlots;
	protected readonly _languageService = inject(LanguageService);
	protected readonly _strings = localizedStrings;
	protected readonly _supportedLanguages = ['vi', 'de', 'en'] as const;
	protected readonly _i18nService =
		inject(BrnCalendarI18nService, { optional: true, self: true }) ?? injectBrnCalendarI18n();

	ngOnInit() {
		const lang = this._languageService.language();
		this._i18nService.use(CALENDAR_I18N[lang]);
	}

	public get lang() {
		return this._languageService.language();
	}

	setLang(lang: unknown) {
		const val = Array.isArray(lang) ? lang[0] : lang;

		if (isLang(val)) {
			this._languageService.setLanguage(val);
			this._i18nService.use(CALENDAR_I18N[val]);
		}
	}
}

function isLang(value: unknown): value is 'vi' | 'en' | 'de' {
	return value === 'vi' || value === 'en' || value === 'de';
}
