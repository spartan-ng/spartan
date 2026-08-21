import { computed, Directive, input } from '@angular/core';
import { injectBrnMessageScroller } from './brn-message-scroller.token';
import type { BrnMessageScrollerButtonDirection } from './brn-message-scroller.types';

@Directive({
	selector: 'button[brnMessageScrollerButton]',
	exportAs: 'brnMessageScrollerButton',
	host: {
		type: 'button',
		'[attr.aria-label]': 'resolvedAriaLabel()',
		'[attr.data-active]': 'active() ? "true" : "false"',
		'[attr.inert]': 'active() ? null : ""',
		'[attr.tabindex]': 'active() ? null : -1',
		'(click)': 'onClick($event)',
	},
})
export class BrnMessageScrollerButton {
	private readonly _scroller = injectBrnMessageScroller();

	/**
	 * Transcript edge to scroll toward.
	 * @default 'end'
	 */
	public readonly direction = input<BrnMessageScrollerButtonDirection>('end');

	/**
	 * Native scroll behavior when clicked.
	 * @default 'smooth'
	 */
	public readonly behavior = input<ScrollBehavior>('smooth');

	/**
	 * Accessible name for the control.
	 * When omitted, defaults from `direction` (`Scroll to end` / `Scroll to start`).
	 */
	public readonly ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' });

	/** Whether overflow exists toward this button's direction. */
	public readonly active = computed(() => {
		const state = this._scroller.scrollable();
		return this.direction() === 'start' ? state.start : state.end;
	});

	/** Resolved accessible name (explicit `aria-label` or direction default). */
	public readonly resolvedAriaLabel = computed(
		() => this.ariaLabel() ?? (this.direction() === 'end' ? 'Scroll to end' : 'Scroll to start'),
	);

	protected onClick(event: MouseEvent): void {
		if (!this.active()) {
			return;
		}

		if (event.defaultPrevented) {
			return;
		}

		(event.currentTarget as HTMLElement | null)?.blur();

		if (this.direction() === 'start') {
			this._scroller.scrollToStart({ behavior: this.behavior() });
		} else {
			this._scroller.scrollToEnd({ behavior: this.behavior() });
		}
	}
}
