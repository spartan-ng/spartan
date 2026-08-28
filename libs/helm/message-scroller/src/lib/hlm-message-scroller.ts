import { Directive } from '@angular/core';
import { BrnMessageScrollerRoot } from '@spartan-ng/brain/message-scroller';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmMessageScroller],hlm-message-scroller',
	hostDirectives: [{ directive: BrnMessageScrollerRoot }],
	host: {
		'data-slot': 'message-scroller',
	},
})
export class HlmMessageScroller {
	constructor() {
		classes(
			() => 'spartan-message-scroller group/message-scroller relative flex size-full min-h-0 flex-col overflow-hidden',
		);
	}
}
