import { Directive } from '@angular/core';
import { BrnSheetTitle } from '@spartan-ng/brain/sheet';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmSheetTitle]',
	hostDirectives: [BrnSheetTitle],
	host: {
		'data-slot': 'sheet-title',
	},
})
export class HlmSheetTitle {
	constructor() {
		classes(() => 'text-foreground font-semibold');
	}
}
