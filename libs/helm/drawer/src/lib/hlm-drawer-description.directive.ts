import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmDrawerDescription]',
	host: {
		'data-slot': 'drawer-description',
	},
})
export class HlmDrawerDescription {
	constructor() {
		classes(() => 'text-muted-foreground text-sm');
	}
}
