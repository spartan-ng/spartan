import { Directive } from '@angular/core';

@Directive({
	selector: '[hlmNativeSelectOptGroup]',
	host: {
		'data-slot': 'native-select-optgroup',
	},
})
export class HlmNativeSelectOptGroup {}
