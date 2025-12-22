import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmItemHeader],hlm-item-header',
	host: {
		'data-slot': 'item-header',
	},
})
export class HlmItemHeader {
	constructor() {
		classes(() => 'flex basis-full items-center justify-between gap-2');
	}
}
