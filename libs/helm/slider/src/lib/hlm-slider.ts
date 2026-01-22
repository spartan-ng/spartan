import { Directive } from '@angular/core';
import {
	BrnSlider,
} from '@spartan-ng/brain/slider';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'hlm-slider, brn-slider [hlm]',
	hostDirectives: [
		{
			directive: BrnSlider,
			inputs: ['value', 'disabled', 'min', 'max', 'step', 'showTicks'],
			outputs: ['valueChange'],
		},
	],
})
export class HlmSlider {
	constructor() {
		classes(() => 'relative flex w-full touch-none items-center select-none');
	}
}
