import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmPopoverDescription]',
	exportAs: 'hlmPopoverDescription',
	host: { 'data-slot': 'popover-description' },
})
export class HlmPopoverDescription {
	constructor() {
		classes(() => 'spartan-popover-description');
	}
}
