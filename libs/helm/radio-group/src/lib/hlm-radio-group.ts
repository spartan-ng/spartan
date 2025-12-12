import { Directive } from '@angular/core';
import { BrnRadioGroup } from '@spartan-ng/brain/radio-group';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmRadioGroup],hlm-radio-group',
	hostDirectives: [
		{
			directive: BrnRadioGroup,
			inputs: ['name', 'value', 'disabled', 'required', 'direction'],
			outputs: ['valueChange'],
		},
	],
	host: {
		'data-slot': 'radio-group',
	},
})
export class HlmRadioGroup {
	constructor() {
		classes(() => 'grid gap-3');
	}
}
