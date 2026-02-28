import { Directive } from '@angular/core';

/**
 * Brain directive for a single column in the time picker popover.
 * Handles ArrowUp/ArrowDown navigation within the column with wrapping.
 *
 * Usage:
 * ```html
 * <div brnTimePickerColumn role="group" aria-label="Hours">
 *   <button>01</button>
 *   <button>02</button>
 * </div>
 * ```
 */
@Directive({
	selector: '[brnTimePickerColumn]',
	exportAs: 'brnTimePickerColumn',
	host: {
		role: 'group',
		'(keydown.arrowDown)': 'focusNext($event)',
		'(keydown.arrowUp)': 'focusPrevious($event)',
	},
})
export class BrnTimePickerColumn {
	/** Moves focus to the next button in the column, wrapping to the first. */
	focusNext(event: Event): void {
		this._moveFocus(event, 1);
	}

	/** Moves focus to the previous button in the column, wrapping to the last. */
	focusPrevious(event: Event): void {
		this._moveFocus(event, -1);
	}

	private _moveFocus(event: Event, offset: number): void {
		const target = event.target;
		if (!(target instanceof HTMLButtonElement)) return;

		event.preventDefault();

		const buttons = Array.from(
			(target.closest('[brnTimePickerColumn]') ?? target.parentElement)!.querySelectorAll<HTMLButtonElement>('button'),
		);
		const index = buttons.indexOf(target);
		if (index === -1) return;

		const next = buttons[(index + offset + buttons.length) % buttons.length];
		next.focus();
		next.scrollIntoView({ block: 'nearest' });
	}
}
