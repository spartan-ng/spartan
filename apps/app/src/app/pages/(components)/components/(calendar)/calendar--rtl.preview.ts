import { ChangeDetectionStrategy, Component, computed, effect, inject, untracked } from '@angular/core';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { injectBrnCalendarI18n, provideBrnCalendarI18n } from '@spartan-ng/brain/calendar';
import { HlmCalendar } from '@spartan-ng/helm/calendar';
import { HlmCard, HlmCardImports } from '@spartan-ng/helm/card';
import { DateTime } from 'luxon';
import { CALENDAR_I18N } from '../(date-picker)/date-picker--rtl.preview';

@Component({
	selector: 'spartan-calendar-rtl',
	imports: [HlmCalendar, HlmCardImports],
	providers: [provideBrnCalendarI18n()],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [HlmCard],
	host: {
		'[dir]': '_dir()',
		class: 'p-0 w-fit mx-auto',
	},
	template: `
		<div hlmCardContent class="p-0">
			<hlm-calendar [(date)]="selectedDate" [min]="minDate" [max]="maxDate" captionLayout="dropdown" />
		</div>
	`,
})
export class CalendarRtl {
	/** The selected date */
	public selectedDate = new Date();

	/** The minimum date */
	public minDate = new Date(new Date().setMonth(new Date().getMonth() - 2));

	/** The maximum date */
	public maxDate = new Date(new Date().setMonth(new Date().getMonth() + 2));

	private readonly _language = inject(TranslateService).language;
	private readonly _calendarI18n = injectBrnCalendarI18n();

	constructor() {
		effect(() => {
			const language = this._language();
			untracked(() => this._calendarI18n.use(CALENDAR_I18N[language]));
		});
	}

	protected readonly _formatDate = computed(() => {
		const locale = this._language();
		return (date: Date) => DateTime.fromJSDate(date).setLocale(locale).toLocaleString(DateTime.DATE_FULL);
	});

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {},
		},
		ar: {
			dir: 'rtl',
			values: {},
		},
		he: {
			dir: 'rtl',
			values: {},
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
}
