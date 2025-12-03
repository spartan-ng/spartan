import { Directive } from '@angular/core';
import { BrnPopover } from '@spartan-ng/brain/popover';

@Directive({
	selector: '[hlmPopover],hlm-popover',
	hostDirectives: [
		{
			directive: BrnPopover,
			inputs: ['align', 'autoFocus', 'closeDelay', 'closeOnOutsidePointerEvents', 'sideOffset', 'state', 'offsetX'],
			outputs: ['stateChanged', 'closed'],
		},
	],
})
export class HlmPopover {}
