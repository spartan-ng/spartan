import { BooleanInput, type NumberInput } from '@angular/cdk/coercion';
import {
	booleanAttribute,
	computed,
	Directive,
	ElementRef,
	inject,
	input,
	numberAttribute,
	signal,
} from '@angular/core';
import { BrnResizableGroup } from './brn-resizable-group';

let nextId = 0;

@Directive({
	selector: 'brn-resizable-panel, [brnResizablePanel]',
	exportAs: 'brnResizablePanel',
	host: {
		'[attr.data-panel-group-id]': '_panelGroup.id()',
		'[attr.data-panel-id]': 'id()',
		'[attr.data-panel-size]': '_panelSize()',
		'[id]': 'id()',
		'[style.flex]': '_flex()',
		'[style.overflow]': '"hidden"',
		'data-panel': '',
		'data-slot': 'resizable-panel',
	},
})
export class BrnResizablePanel {
	/** Unique ID for the panel.   */
	public readonly id = input<string>(`brn-resizable-panel-${++nextId}`);

	/** Reference to the parent {@link BrnResizableGroup}. */
	protected readonly _panelGroup = inject(BrnResizableGroup);

	/** Host DOM element reference. */
	public readonly el = inject(ElementRef<HTMLElement>);

	/**
	 * The default size of the panel (percentage of container space).
	 * - `undefined` → group decides initial size.
	 * - Number → interpreted as percentage (0–100).
	 */
	public readonly defaultSize = input<number, NumberInput>(undefined, { transform: numberAttribute });

	/** The minimum size this panel can shrink to (percentage). */

	public readonly minSize = input<number, NumberInput>(0, { transform: numberAttribute });

	/**	 The maximum size this panel can grow to (percentage).   */
	public readonly maxSize = input<number, NumberInput>(100, { transform: numberAttribute });

	/** Whether this panel can be collapsed entirely. */
	public readonly collapsible = input<boolean, BooleanInput>(true, { transform: booleanAttribute });

	/** Reactive signal holding the current size of the panel. */
	protected readonly _panelSize = signal<number>(100);

	/**
	 * CSS flex style for this panel, derived from its current size.
	 * Format: `"flex-grow flex-shrink flex-basis"`.
	 *
	 * Example: `"25 1 0"` means 25% width (or height in vertical layout).
	 */
	protected readonly _flex = computed(() => `${this._panelSize()} 1 0`);

	/**
	 * Sets the size of the panel.
	 * @param size New size (percentage of container space).
	 */
	public setSize(size: number) {
		this._panelSize.set(size);
	}
}
