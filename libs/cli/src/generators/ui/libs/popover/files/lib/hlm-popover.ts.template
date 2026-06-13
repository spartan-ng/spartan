import { Directive } from '@angular/core';
import { BrnPopover } from '@spartan-ng/brain/popover';

@Directive({
	selector: '[hlmPopover],hlm-popover',
	hostDirectives: [
		{
			directive: BrnPopover,
			inputs: [
				'align',
				'attachTo',
				'closeOnOutsidePointerEvents',
				'offsetX',
				'sideOffset',
				'state',
			],
			outputs: ['stateChanged', 'closed'],
		},
	],
})
export class HlmPopover {}
