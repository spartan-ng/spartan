import { Directive } from '@angular/core';
import { BrnMessageScrollerContent } from '@spartan-ng/brain/message-scroller';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmMessageScrollerContent],hlm-message-scroller-content',
	hostDirectives: [
		{
			directive: BrnMessageScrollerContent,
			inputs: ['aria-relevant', 'spacerClassName'],
		},
	],
	host: {
		'data-slot': 'message-scroller-content',
	},
})
export class HlmMessageScrollerContent {
	constructor() {
		classes(() => 'spartan-message-scroller-content');
	}
}
