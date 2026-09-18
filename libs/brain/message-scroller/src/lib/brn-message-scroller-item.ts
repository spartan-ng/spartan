import type { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, DestroyRef, Directive, effect, ElementRef, inject, input, untracked } from '@angular/core';
import { injectBrnMessageScroller } from './brn-message-scroller.token';

@Directive({
	selector: '[brnMessageScrollerItem],brn-message-scroller-item',
	exportAs: 'brnMessageScrollerItem',
	host: {
		'[attr.data-message-id]': 'messageId() || null',
		'[attr.data-scroll-anchor]': 'scrollAnchor() ? "true" : "false"',
	},
})
export class BrnMessageScrollerItem {
	/**
	 * Stable row id for scrollToMessage, visibility, and prepend preservation.
	 */
	public readonly messageId = input<string | undefined>(undefined);

	/**
	 * Marks a turn boundary that newly appended anchors and last-anchor restore use.
	 * @default false
	 */
	public readonly scrollAnchor = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	constructor() {
		const scroller = injectBrnMessageScroller();
		const elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);
		let registeredMessageId: string | undefined;
		let registeredElement: HTMLElement | null = null;

		effect(() => {
			const messageId = this.messageId();
			const element = elementRef.nativeElement;

			untracked(() => {
				if (registeredMessageId && registeredElement) {
					scroller.registerMessage(registeredMessageId, null, registeredElement);
					registeredMessageId = undefined;
					registeredElement = null;
				}

				if (messageId) {
					scroller.registerMessage(messageId, element);
					registeredMessageId = messageId;
					registeredElement = element;
				}
			});
		});

		inject(DestroyRef).onDestroy(() => {
			if (registeredMessageId && registeredElement) {
				scroller.registerMessage(registeredMessageId, null, registeredElement);
			}
		});
	}
}
