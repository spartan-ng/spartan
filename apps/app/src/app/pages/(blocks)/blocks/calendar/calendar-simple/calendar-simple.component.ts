import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmCalendar } from '@spartan-ng/helm/calendar';

@Component({
	selector: 'spartan-calendar-simple',
	imports: [HlmCalendar],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex justify-center items-start p-3 md:p-20 w-full h-auto md:h-[600px] bg-surface rounded-lg overflow-auto',
	},
	template: `
		<hlm-calendar class="bg-background" />
	`,
})
export class CalendarSimpleComponent {}
