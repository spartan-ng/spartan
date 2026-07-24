import { Highlightable } from '@angular/cdk/a11y';
import { BooleanInput } from '@angular/cdk/coercion';
import { isPlatformBrowser } from '@angular/common';
import { booleanAttribute, computed, Directive, ElementRef, inject, input, PLATFORM_ID, signal } from '@angular/core';
import { stringifyAsLabel } from '@spartan-ng/brain/core';
import { provideBrnSelectItem } from './brn-select-item.token';
import { injectBrnSelectBase } from './brn-select.token';

@Directive({
	selector: '[brnSelectItem]',
	providers: [provideBrnSelectItem(BrnSelectItem)],
	host: {
		role: 'option',
		'[id]': 'id()',
		'[attr.data-highlighted]': '_highlighted() ? "" : null',
		'[attr.data-value]': 'value()',
		'[attr.aria-selected]': 'active()',
		'[attr.aria-disabled]': '_disabled()',
		'[attr.data-disabled]': '_disabled() ? "" : null',
		'(click)': 'select()',
		'(mouseenter)': 'activate()',
	},
})
export class BrnSelectItem<T> implements Highlightable {
	private static _id = 0;

	private readonly _platform = inject(PLATFORM_ID);

	private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

	/** Access the select component */
	private readonly _select = injectBrnSelectBase<T>();

	/** A unique id for the item */
	public readonly id = input<string>(`brn-select-item-${++BrnSelectItem._id}`);

	/** The value this item represents. */
	public readonly value = input.required<T>();
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
	public readonly active = computed(() => this._select.isSelected(this.value()));

	protected readonly _highlighted = signal(false);

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
		return stringifyAsLabel(this.value(), this._select.itemToString());
	}

	protected select(): void {
		if (this._disabled()) {
			return;
		}

		this._select.keyManager.setActiveItem(this);
		this._select.select(this.value());
	}

	protected activate(): void {
		if (this._disabled()) {
			return;
		}

		this._select.keyManager.setActiveItem(this);
	}
}
