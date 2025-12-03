import { Directive } from '@angular/core';
import { BrnPopover } from '@spartan-ng/brain/popover';

@Directive({
	selector: '[hlmPopover],hlm-popover',
	hostDirectives: [{ directive: BrnPopover, inputs: ['align', 'sideOffset', 'offsetX'] }],
})
export class HlmPopover {}
