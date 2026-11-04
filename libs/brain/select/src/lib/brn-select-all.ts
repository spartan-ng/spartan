import type { BooleanInput } from '@angular/cdk/coercion';
import { isPlatformBrowser } from '@angular/common';
import { booleanAttribute, computed, Directive, ElementRef, inject, input, PLATFORM_ID, signal } from '@angular/core';
import { type BrnSelectOption, provideBrnSelectItem } from './brn-select-item.token';
import { BrnSelectMultiple } from './brn-select-multiple';

@Directive({
	selector: '[brnSelectAll]',
	providers: [provideBrnSelectItem(BrnSelectAll)],
	host: {
		role: 'option',
		'[id]': 'id()',
		'[attr.data-highlighted]': '_highlighted() ? "" : null',
		'[attr.aria-selected]': 'allSelected()',
		'[attr.aria-disabled]': '_disabledState()',
		'[attr.data-disabled]': '_disabledState() ? "" : null',
		'[attr.data-state]': '_state()',
		'(click)': 'select()',
		'(mouseenter)': 'activate()',
		'(mousedown)': 'onMouseDown($event)',
	},
})
export class BrnSelectAll implements BrnSelectOption<unknown> {
	private static _id = 0;

	private readonly _platform = inject(PLATFORM_ID);

	private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

	/** Access the multiple select if present - select-all only applies to it */
	private readonly _selectMultiple = inject(BrnSelectMultiple, { optional: true });

	/** A unique id for the select-all row */
	public readonly id = input<string>(`brn-select-all-${++BrnSelectAll._id}`);

	// eslint-disable-next-line @typescript-eslint/naming-convention
	public readonly _disabled = input<boolean, BooleanInput>(false, {
		alias: 'disabled',
		transform: booleanAttribute,
	});

	/** @internal The select-all row does not represent a value */
	public readonly value = computed(() => undefined);

	protected readonly _disabledState = computed(() => this._disabled() || !this._selectMultiple);

	/** Expose disabled as a value - used by the Highlightable interface */
	public get disabled() {
		return this._disabledState();
	}

	/** Whether every enabled item is selected. */
	public readonly allSelected = computed(() => this._selectMultiple?.allSelected() ?? false);

	/** Whether some but not all enabled items are selected. */
	public readonly partiallySelected = computed(() => this._selectMultiple?.partiallySelected() ?? false);

	protected readonly _state = computed(() =>
		this.allSelected() ? 'checked' : this.partiallySelected() ? 'indeterminate' : 'unchecked',
	);

	protected readonly _highlighted = signal(false);

	constructor() {
		if (!this._selectMultiple) {
			console.warn('BrnSelectAll only works with multiple selection selects.');
		}
	}

	public setActiveStyles(): void {
		this._highlighted.set(true);

		// ensure the item is in view
		if (isPlatformBrowser(this._platform)) {
			this._elementRef.nativeElement.scrollIntoView({ block: 'nearest' });
		}
	}

	public setInactiveStyles(): void {
		this._highlighted.set(false);
	}

	public getLabel(): string {
		return this._elementRef.nativeElement.textContent?.trim() ?? '';
	}

	public select(): void {
		const select = this._selectMultiple;

		if (!select || this._disabled()) {
			return;
		}

		select.keyManager.setActiveItem(this);
		select.toggleAll();
	}

	protected activate(): void {
		const select = this._selectMultiple;

		if (!select || this._disabled()) {
			return;
		}

		select.keyManager.setActiveItem(this);
	}

	/** Prevent the press from moving DOM focus off the trigger (aria-activedescendant model). */
	protected onMouseDown(event: MouseEvent): void {
		event.preventDefault();
	}
}
