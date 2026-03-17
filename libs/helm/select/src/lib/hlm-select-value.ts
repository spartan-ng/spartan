import { Directive } from '@angular/core';
import { BrnSelectValue } from '@spartan-ng/brain/select';

@Directive({
	selector: '[hlmSelectValue]',
	hostDirectives: [BrnSelectValue],
	host: {
		'data-slot': 'select-value',
	},
})
export class HlmSelectValue {}
