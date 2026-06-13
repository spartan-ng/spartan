import { Directive } from '@angular/core';
import { BrnDrawerDescription } from '@spartan-ng/brain/drawer';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmDrawerDescription]',
	hostDirectives: [BrnDrawerDescription],
	host: { 'data-slot': 'drawer-description' },
})
export class HlmDrawerDescription {
	constructor() {
		classes(() => 'spartan-drawer-description');
	}
}
