import { Directive } from '@angular/core';
import { BrnDrawerTitle } from '@spartan-ng/brain/drawer';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmDrawerTitle]',
	hostDirectives: [BrnDrawerTitle],
	host: { 'data-slot': 'drawer-title' },
})
export class HlmDrawerTitle {
	constructor() {
		classes(() => 'spartan-drawer-title');
	}
}
