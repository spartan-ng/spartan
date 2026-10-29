import { Directive } from '@angular/core';
import { BrnPopover } from '@spartan-ng/brain/popover';

@Directive({
	selector: '[hlmPopover],hlm-popover',
	exportAs: 'hlmPopover',
	hostDirectives: [
		{
			directive: BrnPopover,
			inputs: [
				'align',
				'aria-modal',
				'attachTo',
				'autoFocus',
				'closeOnOutsidePointerEvents',
				'offsetX',
				'scrollStrategy',
				'sideOffset',
				'state',
			],
			outputs: ['stateChanged', 'closed'],
		},
	],
	host: { 'data-slot': 'popover' },
})
export class HlmPopover {}
