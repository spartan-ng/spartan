import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BrnSwitch } from './brn-switch';

@Component({
	selector: 'brn-switch-thumb',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		role: 'presentation',
		'[attr.data-state]': "_switch.checked() ? 'checked' : 'unchecked'",
		'(click)': '$event.preventDefault()',
	},
	template: '',
})
export class BrnSwitchThumb {
	protected readonly _switch = inject(BrnSwitch);
}
