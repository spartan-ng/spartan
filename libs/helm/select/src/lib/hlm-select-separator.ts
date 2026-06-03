import { Directive } from '@angular/core';
import { BrnSelectSeparator } from '@spartan-ng/brain/select';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmSelectSeparator],hlm-select-separator',
	hostDirectives: [{ directive: BrnSelectSeparator, inputs: ['orientation'] }],
	host: { 'data-slot': 'select-separator' },
})
export class HlmSelectSeparator {
	constructor() {
		classes(() => 'spartan-select-separator pointer-events-none');
	}
}
