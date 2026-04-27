import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmItemTitle],hlm-item-title',
	host: { 'data-slot': 'item-title' },
})
export class HlmItemTitle {
	constructor() {
		classes(() => 'spartan-item-title line-clamp-1 flex w-fit items-center');
	}
}
