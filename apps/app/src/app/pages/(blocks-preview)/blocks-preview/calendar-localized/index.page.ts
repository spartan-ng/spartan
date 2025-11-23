import {
	ChangeDetectionStrategy,
	Component,
	effect,
	inject,
	Injectable,
	signal,
	ViewEncapsulation,
} from '@angular/core';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmCalendar } from '@spartan-ng/helm/calendar';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { BrnCalendarI18nService, injectBrnCalendarI18n, provideBrnCalendarI18n } from '@spartan-ng/brain/calendar';

const localizedStrings = {
	vi: {
		title: 'Đặt lịch hẹn',
		description: 'Vui lòng chọn ngày cho lịch hẹn',
	},

	de: {
		title: 'Termin buchen',
		description: 'Bitte wählen Sie die Termine für Ihren Termin aus',
	},

	en: {
		title: 'Book an appointment',
		description: 'Select the dates for your appointment',
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
			['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'] as [
				string,
				string,
				string,
				string,
				string,
				string,
				string,
				string,
				string,
				string,
				string,
				string,
			],

		years: (startYear = 1925, endYear = new Date().getFullYear()) =>
			Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i),
		firstDayOfWeek: () => 1 as 1,
	},

	en: {
		formatWeekdayName: (i: number) => ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][i],
		months: () =>
			['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as [
				string,
				string,
				string,
				string,
				string,
				string,
				string,
				string,
				string,
				string,
				string,
				string,
			],

		years: (startYear = 1925, endYear = new Date().getFullYear()) =>
			Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i),
		formatHeader: (month: number, year: number) =>
			new Date(year, month).toLocaleDateString('en', { month: 'long', year: 'numeric' }),
		formatMonth: (m: number) => new Date(2000, m).toLocaleDateString('en', { month: 'short' }),
		formatYear: (y: number) => `${y}`,
		labelPrevious: () => 'Previous month',
		labelNext: () => 'Next month',
		labelWeekday: (i: number) => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i],
		firstDayOfWeek: () => 0 as 0,
	},

	de: {
		formatWeekdayName: (i: number) => ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'][i],
		months: () =>
			['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'] as [
				string,
				string,
				string,
				string,
				string,
				string,
				string,
				string,
				string,
				string,
				string,
				string,
			],
		years: (startYear = 1925, endYear = new Date().getFullYear()) =>
			Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i),
		formatHeader: (month: number, year: number) =>
			new Date(year, month).toLocaleDateString('de', { month: 'long', year: 'numeric' }),
		formatMonth: (m: number) => new Date(2000, m).toLocaleDateString('de', { month: 'short' }),
		formatYear: (y: number) => `${y}`,
		labelPrevious: () => 'Vorheriger Monat',
		labelNext: () => 'Nächster Monat',
		labelWeekday: (i: number) => ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'][i],
		firstDayOfWeek: () => 1 as 1,
	},
} as const;

@Injectable({ providedIn: 'root' })
export class LanguageService {
	language = signal<'en' | 'vi' | 'de'>('vi');

	setLanguage(lang: 'en' | 'vi' | 'de') {
		this.language.set(lang);
	}
}

@Component({
	selector: 'spartan-calendar-localized',
	imports: [HlmCalendar, BrnSelectImports, HlmSelectImports, HlmCardImports],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [provideBrnCalendarI18n(CALENDAR_I18N.vi)],
	host: {
		class: 'flex pt-20 justify-center',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<section class="w-full max-w-sm" hlmCard>
			<div hlmCardHeader>
				<h3 hlmCardTitle>{{ strings[lang].title }}</h3>
				<p hlmCardDescription>{{ strings[lang].description }}</p>

				<div hlmCardAction>
					<brn-select class="inline-block" [value]="lang" (valueChange)="setLang($event)">
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

			<div hlmCardContent>
				<hlm-calendar />
			</div>
		</section>
	`,
})
export default class CalendarLocalizedPage {
	protected readonly languageService = inject(LanguageService);
	protected readonly strings = localizedStrings;
	readonly _supportedLanguages = ['vi', 'de', 'en'] as const;
	protected readonly i18nService =
		inject(BrnCalendarI18nService, { optional: true, self: true }) ?? injectBrnCalendarI18n();

	ngOnInit() {
		const lang = this.languageService.language();
		this.i18nService.use(CALENDAR_I18N[lang]);
	}

	get lang() {
		return this.languageService.language();
	}

	setLang(lang: unknown) {
		const val = Array.isArray(lang) ? lang[0] : lang;

		if (isLang(val)) {
			this.languageService.setLanguage(val);
			this.i18nService.use(CALENDAR_I18N[val]);
		}
	}
}


function isLang(value: any): value is 'vi' | 'en' | 'de' {
  return value === 'vi' || value === 'en' || value === 'de';
}

