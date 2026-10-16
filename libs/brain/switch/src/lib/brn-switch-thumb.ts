import { Directive, inject } from '@angular/core';
import { BrnSwitch } from './brn-switch';

@Directive({
	selector: '[brnSwitchThumb],brn-switch-thumb',
	exportAs: 'brnSwitchThumb',
	host: {
		role: 'presentation',
		'[attr.data-state]': "_switch.checked() ? 'checked' : 'unchecked'",
		'(click)': '$event.preventDefault()',
	},
})
export class BrnSwitchThumb {
	protected readonly _switch = inject(BrnSwitch);
}
