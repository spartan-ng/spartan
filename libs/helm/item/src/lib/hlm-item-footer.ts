import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmItemFooter],hlm-item-footer',
	host: {
		'data-slot': 'item-footer',
	},
})
export class HlmItemFooter {
	constructor() {
		classes(() => 'flex basis-full items-center justify-between gap-2');
	}
}
