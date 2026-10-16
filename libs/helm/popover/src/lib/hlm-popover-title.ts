import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmPopoverTitle]',
	exportAs: 'hlmPopoverTitle',
	host: { 'data-slot': 'popover-title' },
})
export class HlmPopoverTitle {
	constructor() {
		classes(() => 'spartan-popover-title');
	}
}
