import { Directive } from '@angular/core';
import { BrnCollapsibleTrigger } from '@spartan-ng/brain/collapsible';

@Directive({
	selector: 'button[hlmCollapsibleTrigger]',
	hostDirectives: [BrnCollapsibleTrigger],
	host: {
		'data-slot': 'collapsible-trigger',
	},
})
export class HlmCollapsibleTrigger {}
