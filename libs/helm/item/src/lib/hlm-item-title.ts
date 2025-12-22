import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmItemTitle],hlm-item-title',
	host: {
		'data-slot': 'item-title',
	},
})
export class HlmItemTitle {
	constructor() {
		classes(() => 'flex w-fit items-center gap-2 text-sm leading-snug font-medium');
	}
}
