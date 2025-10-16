import { Component } from '@angular/core';
import { HlmCalendarImports } from '@spartan-ng/helm/calendar';

@Component({
	selector: 'spartan-calendar-preview',
	imports: [HlmCalendarImports],
	template: `
		<hlm-calendar [(date)]="selectedDate" [min]="minDate" [max]="maxDate" />
	`,
})
export class CalendarPreview {
	/** The selected date */
	public selectedDate = new Date();

	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);
}

export const defaultImports = `
import { HlmCalendarImports } from '@spartan-ng/helm/calendar';
`;

export const i18nRuntimeChange = `
import { injectBrnCalendarI18n } from '@spartan-ng/brain/calendar';

@Component({...})
export class CalendarPage {
  private readonly _i18n = injectBrnCalendarI18n();

  switchToFrench() {
    this._i18n.use({
      ...,
      labelNext: () => 'Mois suivant',
      labelPrevious: () => 'Mois précédent',
      ...
    });
  }
}
`;

export const i18nProviders = `
import { bootstrapApplication } from '@angular/platform-browser';
import { provideBrnCalendarI18n } from '@spartan-ng/brain/calendar';
bootstrapApplication(App, {
	providers: [
		provideBrnCalendarI18n({
			formatWeekdayName: (i) => ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'][i],
			formatHeader: (m, y) =>
				new Date(y, m).toLocaleDateString('de-DE', {
					month: 'long',
					year: 'numeric',
				}),
			labelPrevious: () => 'Vorheriger Monat',
			labelNext: () => 'Nächster Monat',
			labelWeekday: (i) => ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'][i],
			firstDayOfWeek: () => 1,
		}),
	],
});
`;

export const defaultSkeleton = `
<hlm-calendar [(date)]="selectedDate" [min]="minDate" [max]="maxDate" />
`;
