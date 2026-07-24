import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmItemContent],hlm-item-content',
	host: { 'data-slot': 'item-content' },
})
export class HlmItemContent {
	constructor() {
		classes(() => 'spartan-item-content flex flex-1 flex-col [&+[data-slot=item-content]]:flex-none');
	}
}
