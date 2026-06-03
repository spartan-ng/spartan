import { Directive } from '@angular/core';
import { BrnSelectLabel } from '@spartan-ng/brain/select';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmSelectLabel],hlm-select-label',
	hostDirectives: [{ directive: BrnSelectLabel, inputs: ['id'] }],
	host: { 'data-slot': 'select-label' },
})
export class HlmSelectLabel {
	constructor() {
		classes(() => 'spartan-select-label flex');
	}
}
