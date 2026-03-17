import { Directive } from '@angular/core';
import { BrnSelectValue } from '@spartan-ng/brain/select';

@Directive({
	selector: '[hlmSelectValue]',
	hostDirectives: [{ directive: BrnSelectValue, inputs: ['placeholder'] }],
	host: {
		'data-slot': 'select-value',
	},
})
export class HlmSelectValue {}
