import { Directive } from '@angular/core';
import { BrnTooltip } from '@spartan-ng/brain/tooltip';

@Directive({
	selector: '[hlmTooltip],hlm-tooltip',
	hostDirectives: [BrnTooltip],
	host: {
		'data-slot': 'tooltip',
		'[style]': '{display: "contents"}',
	},
})
export class HlmTooltip {}
