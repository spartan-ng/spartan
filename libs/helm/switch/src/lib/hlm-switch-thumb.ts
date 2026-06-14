import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'brn-switch-thumb[hlm],[hlmSwitchThumb]',
	host: { 'data-slot': 'switch-thumb' },
})
export class HlmSwitchThumb {
	constructor() {
		classes(() => 'spartan-switch-thumb pointer-events-none block ring-0 transition-transform');
	}
}
