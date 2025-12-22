import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'ng-scrollbar[hlm],ng-scrollbar[hlmScrollbar]',
	host: {
		'data-slot': 'scroll-area',
		'[style.--scrollbar-border-radius]': '100 + "px"',
		'[style.--scrollbar-offset]': '3',
		'[style.--scrollbar-thumb-color]': '"var(--border)"',
		'[style.--scrollbar-thumb-hover-color]': '"var(--border)"',
		'[style.--scrollbar-thickness]': '7',
	},
})
export class HlmScrollArea {
	constructor() {
		classes(() => 'block');
	}
}
