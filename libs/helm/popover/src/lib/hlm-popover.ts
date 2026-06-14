import { Directive } from '@angular/core';
import { BrnPopover } from '@spartan-ng/brain/popover';

@Directive({
	selector: '[hlmPopover],hlm-popover',
	host: { 'data-slot': 'popover' },
	hostDirectives: [
		{
			directive: BrnPopover,
			inputs: [
				'align',
				'autoFocus',
				'attachTo',
				'closeDelay',
				'closeOnOutsidePointerEvents',
				'offsetX',
				'restoreFocus',
				'sideOffset',
				'state',
			],
			outputs: ['stateChanged', 'closed'],
		},
	],
})
export class HlmPopover {}
