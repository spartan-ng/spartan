import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxHostPressedListener } from '@spartan-ng/ui-core';
import { BrnCalendarService } from './brn-calendar.service';

@Component({
	selector: 'brn-calendar-view-switcher',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	template: '<ng-content/>',
})
export class BrnCalendarViewSwitcherComponent {
	private readonly _hostPressedListener = rxHostPressedListener();
	private readonly _brnCalendarService = inject(BrnCalendarService);

	constructor() {
		this._hostPressedListener.subscribe(() => this._brnCalendarService.switchView());
	}
}
