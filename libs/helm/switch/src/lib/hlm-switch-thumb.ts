import { Directive } from '@angular/core';
import { BrnSwitchThumb } from '@spartan-ng/brain/switch';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmSwitchThumb],hlm-switch-thumb',
	hostDirectives: [BrnSwitchThumb],
	host: { 'data-slot': 'switch-thumb' },
})
export class HlmSwitchThumb {
	constructor() {
		classes(() => 'spartan-switch-thumb pointer-events-none block ring-0 transition-transform');
	}
}
