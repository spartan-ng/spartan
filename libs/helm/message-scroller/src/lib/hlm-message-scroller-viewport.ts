import { Directive } from '@angular/core';
import { BrnMessageScrollerViewport } from '@spartan-ng/brain/message-scroller';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmMessageScrollerViewport],hlm-message-scroller-viewport',
	hostDirectives: [
		{
			directive: BrnMessageScrollerViewport,
			inputs: ['preserveScrollOnPrepend', 'aria-label', 'tabindex'],
		},
	],
	host: {
		'data-slot': 'message-scroller-viewport',
	},
})
export class HlmMessageScrollerViewport {
	constructor() {
		classes(() => 'spartan-message-scroller-viewport');
	}
}
