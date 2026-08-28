import { Directive } from '@angular/core';
import { BrnMessageScrollerItem } from '@spartan-ng/brain/message-scroller';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmMessageScrollerItem],hlm-message-scroller-item',
	hostDirectives: [
		{
			directive: BrnMessageScrollerItem,
			inputs: ['messageId', 'scrollAnchor'],
		},
	],
	host: {
		'data-slot': 'message-scroller-item',
	},
})
export class HlmMessageScrollerItem {
	constructor() {
		classes(() => 'spartan-message-scroller-item min-w-0 shrink-0');
	}
}
