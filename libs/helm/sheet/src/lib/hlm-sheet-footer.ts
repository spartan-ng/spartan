import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmSheetFooter],hlm-sheet-footer',
	host: { 'data-slot': 'sheet-footer' },
})
export class HlmSheetFooter {
	constructor() {
		classes(() => 'spartan-sheet-footer mt-auto flex flex-col');
	}
}
