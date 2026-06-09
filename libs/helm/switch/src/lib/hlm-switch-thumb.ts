import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'brn-switch-thumb[hlm],[hlmSwitchThumb]',
})
export class HlmSwitchThumb {
	constructor() {
		classes(() => 'spartan-switch-thumb pointer-events-none block ring-0 transition-transform');
	}
}
