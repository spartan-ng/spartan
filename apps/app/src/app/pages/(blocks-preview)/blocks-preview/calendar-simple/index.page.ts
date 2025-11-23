import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { HlmCalendar } from '@spartan-ng/helm/calendar';

@Component({
	selector: 'spartan-calendar-simple',
	imports: [HlmCalendar],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex justify-center pt-20',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<hlm-calendar />
	`,
})
export default class CalendarSimplePage {}
