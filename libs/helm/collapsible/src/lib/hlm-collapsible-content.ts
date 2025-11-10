import { Directive } from '@angular/core';
import { BrnCollapsibleContent } from '@spartan-ng/brain/collapsible';

@Directive({
	selector: '[hlmCollapsibleContent],hlm-collapsible-content',
	hostDirectives: [{ directive: BrnCollapsibleContent, inputs: ['id'] }],
	host: {
		'data-slot': 'collapsible-content',
		style: '--tw-animation-duration: 300ms;',
		class:
			'data-[state=open]:animate-in fill-mode-backwards data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
	},
})
export class HlmCollapsibleContent {}
