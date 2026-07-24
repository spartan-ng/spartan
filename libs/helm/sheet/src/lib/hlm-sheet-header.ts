import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmSheetHeader],hlm-sheet-header',
	host: { 'data-slot': 'sheet-header' },
})
export class HlmSheetHeader {
	constructor() {
		classes(() => 'spartan-sheet-header flex flex-col');
	}
}
