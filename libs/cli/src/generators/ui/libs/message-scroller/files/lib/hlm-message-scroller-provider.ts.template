import { Directive } from '@angular/core';
import { BrnMessageScrollerProvider } from '@spartan-ng/brain/message-scroller';

@Directive({
	selector: '[hlmMessageScrollerProvider]',
	hostDirectives: [
		{
			directive: BrnMessageScrollerProvider,
			inputs: ['autoScroll', 'defaultScrollPosition', 'scrollEdgeThreshold', 'scrollPreviousItemPeek', 'scrollMargin'],
		},
	],
	host: {
		// Match React's Provider (no layout box) so height:100% on the scroller
		// resolves against the real parent (e.g. card content), not this wrapper.
		// Inline style — don't depend on a Tailwind `contents` utility being generated.
		style: 'display: contents',
	},
})
export class HlmMessageScrollerProvider {}
