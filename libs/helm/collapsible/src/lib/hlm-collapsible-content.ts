import { Directive } from '@angular/core';
import { BrnCollapsibleContent } from '@spartan-ng/brain/collapsible';

@Directive({
	selector: '[hlmCollapsibleContent],hlm-collapsible-content',
	hostDirectives: [{ directive: BrnCollapsibleContent, inputs: ['id'] }],
	host: {
		'data-slot': 'collapsible-content',
	},
})
export class HlmCollapsibleContent {}
