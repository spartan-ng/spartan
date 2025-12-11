import type { Highlightable } from '@angular/cdk/a11y';
import type { BooleanInput } from '@angular/cdk/coercion';
import { isPlatformBrowser } from '@angular/common';
import { booleanAttribute, Directive, ElementRef, inject, input, output, PLATFORM_ID, signal } from '@angular/core';
import { provideBrnAutocompleteItem } from './brn-autocomplete-item.token';
import { injectBrnAutocomplete } from './brn-autocomplete.token';

@Directive({
	selector: 'button[brnAutocompleteItem]',
	providers: [provideBrnAutocompleteItem(BrnAutocompleteItem)],
	host: {
		type: 'button',
		role: 'option',
		tabIndex: '-1',
		'[id]': 'id()',
		'[attr.disabled]': '_disabled() ? true : null',
		'[attr.data-disabled]': '_disabled() ? "" : null',
		'[attr.data-value]': 'value()',
		'[attr.aria-selected]': '_active()',
		'[attr.data-selected]': "_active() ? '' : null",
		'(click)': 'onClick()',
		'(mouseenter)': 'activate()',
	},
})
export class BrnAutocompleteItem<T> implements Highlightable {
	private static _id = 0;

	private readonly _platform = inject(PLATFORM_ID);

	private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

	/** Access the autocomplete component */
	private readonly _autocomplete = injectBrnAutocomplete<T>();

	/** A unique id for the item */
	public readonly id = input<string>(`brn-autocomplete-item-${++BrnAutocompleteItem._id}`);

	/** The value this item represents. */
	public readonly value = input.required<T>();

	/** Whether the item is disabled. */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public readonly _disabled = input<boolean, BooleanInput>(false, {
		alias: 'disabled',
		transform: booleanAttribute,
	});

	/** Expose disabled as a value - used by the Highlightable interface */
	public get disabled() {
		return this._disabled();
	}

	/** Whether the item is selected. */
	protected readonly _active = signal(false);

	/** Emits when the item is selected. */
	public readonly selected = output<void>();

	/** @internal Get the display value */
	public getLabel(): string {
		return this._elementRef.nativeElement.textContent?.trim() ?? '';
	}

	/** @internal */
	setActiveStyles(): void {
		this._active.set(true);

		// ensure the item is in view
		if (isPlatformBrowser(this._platform)) {
			this._elementRef.nativeElement.scrollIntoView({ block: 'nearest' });
		}
	}

	/** @internal */
	setInactiveStyles(): void {
		this._active.set(false);
	}

	protected onClick(): void {
		this._autocomplete.keyManager.setActiveItem(this);
		this.selected.emit();
	}

	protected activate(): void {
		if (this._disabled()) {
			return;
		}

		this._autocomplete.keyManager.setActiveItem(this);
	}
}
