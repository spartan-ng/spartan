import { Directive } from '@angular/core';
import { BrnCollapsibleContent } from '@spartan-ng/brain/collapsible';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmCollapsibleContent],hlm-collapsible-content',
	hostDirectives: [{ directive: BrnCollapsibleContent, inputs: ['id'] }],
	host: {
		'data-slot': 'collapsible-content',
	},
})
export class HlmCollapsibleContent {
	constructor() {
		// Render as a block so height/overflow based animations work. Hiding the closed content is
		// handled by the brain (`BrnCollapsibleContent`), which only removes non-animated content from
		// the layout so CSS transitions/animations are free to run.
		classes(() => 'block');
	}
}
