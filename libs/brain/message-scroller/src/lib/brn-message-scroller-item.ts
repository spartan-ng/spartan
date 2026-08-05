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
	private readonly _scroller = injectBrnMessageScroller();
	private readonly _elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);
	private readonly _destroyRef = inject(DestroyRef);
	private _registeredMessageId: string | undefined;
	private _registeredElement: HTMLElement | null = null;

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
		effect(() => {
			const messageId = this.messageId();
			const element = this._elementRef.nativeElement;

			untracked(() => {
				if (this._registeredMessageId && this._registeredElement) {
					this._scroller.registerMessage(this._registeredMessageId, null, this._registeredElement);
					this._registeredMessageId = undefined;
					this._registeredElement = null;
				}

				if (messageId) {
					this._scroller.registerMessage(messageId, element);
					this._registeredMessageId = messageId;
					this._registeredElement = element;
				}
			});
		});

		this._destroyRef.onDestroy(() => {
			if (this._registeredMessageId && this._registeredElement) {
				this._scroller.registerMessage(this._registeredMessageId, null, this._registeredElement);
			}
		});
	}
}
