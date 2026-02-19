import { Directive } from '@angular/core';

/**
 * Token used by BrnTimePickerColumn to access the parent picker.
 */
export const BRN_TIME_PICKER = 'BrnTimePicker';

/**
 * Brain directive for the time picker popover grid container.
 * Handles ArrowLeft/ArrowRight navigation between columns.
 *
 * Usage:
 * ```html
 * <div brnTimePicker>
 *   <div brnTimePickerColumn>...</div>
 *   <div brnTimePickerColumn>...</div>
 * </div>
 * ```
 */
@Directive({selector: '[brnTimePicker]',
exportAs: 'brnTimePicker',
providers: [{ provide: BRN_TIME_PICKER, useExisting: BrnTimePicker }],
host: {
		role: 'listbox',
		'(keydown.arrowRight)': 'focusAdjacentColumn($event, "next")',
		'(keydown.arrowLeft)': 'focusAdjacentColumn($event, "previous")',
	}})
export class BrnTimePicker {
	/**
	 * Moves focus from the current column to the next or previous column.
	 * Focuses the currently-selected item in the target column, or the first item if none is selected.
	 */
	focusAdjacentColumn(event: Event, direction: 'next' | 'previous'): void {
		const target = event.target;
		if (!(target instanceof HTMLElement)) return;

		const column = target.closest('[brnTimePickerColumn]');
		if (!column) return;

		event.preventDefault();

		const sibling =
			direction === 'next'
				? column.nextElementSibling
				: column.previousElementSibling;

		if (!sibling?.hasAttribute('brnTimePickerColumn')) return;

		const selectedBtn =
			sibling.querySelector<HTMLElement>('button[data-selected="true"]') ??
			sibling.querySelector<HTMLElement>('button');
		selectedBtn?.focus();
		selectedBtn?.scrollIntoView({ block: 'nearest' });
	}
}
