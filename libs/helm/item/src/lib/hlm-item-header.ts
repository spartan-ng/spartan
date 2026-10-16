import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmItemHeader],hlm-item-header',
	exportAs: 'hlmItemHeader',
	host: { 'data-slot': 'item-header' },
})
export class HlmItemHeader {
	constructor() {
		classes(() => 'spartan-item-header flex basis-full items-center justify-between');
	}
}
