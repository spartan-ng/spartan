import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import type { BooleanInput } from '@angular/cdk/coercion';
import {
	afterNextRender,
	booleanAttribute,
	computed,
	contentChild,
	contentChildren,
	Directive,
	effect,
	ElementRef,
	forwardRef,
	inject,
	Injector,
	input,
	linkedSignal,
	model,
	signal,
	untracked,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';
import type { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';
import { BrnPopover } from '@spartan-ng/brain/popover';
import type { BrnComboboxInput } from './brn-combobox-input';
import { BrnComboboxInputWrapper } from './brn-combobox-input-wrapper';
import { type BrnComboboxItem } from './brn-combobox-item';
import { BrnComboboxItemToken } from './brn-combobox-item.token';
import {
	ComboboxInputMode,
	injectBrnComboboxConfig,
	provideBrnComboboxBase,
	type BrnComboboxBase,
	type ComboboxFilter,
	type ComboboxFilterOptions,
	type ComboboxItemEqualToValue,
	type ComboboxItemToString,
} from './brn-combobox.token';

export const BRN_COMBOBOX_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => BrnCombobox),
	multi: true,
};

@Directive({
	selector: '[brnCombobox]',
	providers: [provideBrnComboboxBase(BrnCombobox), BRN_COMBOBOX_VALUE_ACCESSOR],
})
export class BrnCombobox<T> implements BrnComboboxBase<T>, ControlValueAccessor {
	private readonly _injector = inject(Injector);

	private readonly _config = injectBrnComboboxConfig<T>();

	/** Access the popover if present */
	private readonly _brnPopover = inject(BrnPopover, { optional: true });

	/** Whether the combobox is disabled */
	public readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	/** Placeholder text shown when no value is selected */
	public readonly placeholder = input<string>('');

	/**
	 * Enable multiple selection.
	 * Note: for full multiple-selection combobox behaviour, use BrnComboboxMultiple instead.
	 * In the select context this delegates to BrnComboboxMultiple via DI provider swap.
	 */
	public readonly multiple = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	protected readonly _disabled = linkedSignal(this.disabled);

	/** @internal The disabled state as a readonly signal */
	public readonly disabledState = this._disabled.asReadonly();

	/** Options for filtering the combobox items */
	public readonly filterOptions = input<ComboboxFilterOptions>({});

	/** @internal The collator used for string comparison */
	public readonly collator = computed(() => {
		const options = this.filterOptions();
		const mergedOptions = { ...this._config.filterOptions, ...options };
		return new Intl.Collator(options.locale, mergedOptions);
	});

	/** A function to compare an item with the selected value. */
	public readonly isItemEqualToValue = input<ComboboxItemEqualToValue<T>>(this._config.isItemEqualToValue);

	/** A function to convert an item to a string for display. */
	public readonly itemToString = input<ComboboxItemToString<T> | undefined>(this._config.itemToString);

	/** A custom filter function to use when searching. */
	public readonly filter = input<ComboboxFilter<T>>(this._config.filter);

	/** Whether to auto-highlight the first matching item. */
	public readonly autoHighlight = input<boolean, BooleanInput>(this._config.autoHighlight, {
		transform: booleanAttribute,
	});

	/** The selected value of the combobox. */
	public readonly value = model<T | null>(null);

	/** The current search query. */
	public readonly search = model<string>('');

	private readonly _searchInputWrapper = contentChild(BrnComboboxInputWrapper, {
		read: ElementRef,
	});

	/** @internal The width of the search input wrapper */
	public readonly searchInputWrapperWidth = computed<number | null>(() => {
		const inputElement = this._searchInputWrapper()?.nativeElement;
		return inputElement ? (inputElement.offsetWidth as number) : null;
	});

	/** @internal Access all the items within the combobox */
	public readonly items = contentChildren<BrnComboboxItem<T>>(BrnComboboxItemToken, {
		descendants: true,
	});

	/** Determine if the combobox has any visible items */
	public readonly visibleItems = computed(() => this.items().some((item) => item.visible()));

	/** @internal The key manager for managing active descendant */
	public readonly keyManager = new ActiveDescendantKeyManager(this.items, this._injector);

	/** @internal Whether the combobox is expanded */
	public readonly isExpanded = computed(() => this._brnPopover?.stateComputed() === 'open');

	private readonly _comboboxInput = signal<BrnComboboxInput<T> | undefined>(undefined);

	public readonly mode = computed<ComboboxInputMode>(() => this._comboboxInput()?.mode() || 'combobox');

	protected _onChange?: ChangeFn<T | null>;
	protected _onTouched?: TouchFn;

	constructor() {
		this.keyManager
			.withVerticalOrientation()
			.withHomeAndEnd()
			.withWrap()
			.skipPredicate((item) => item.disabled || !item.visible());

		this._brnPopover?.closed.subscribe(() => {
			this.search.set('');
			this.keyManager.setActiveItem(-1);
		});

		afterNextRender(() => {
			effect(
				() => {
					if (!this.autoHighlight() || !this.isExpanded() || !this.search()) return;

					const hasVisibleItems = this.visibleItems();

					untracked(() => {
						if (hasVisibleItems) {
							this.keyManager.setFirstItemActive();
						} else {
							this.keyManager.setActiveItem(-1);
						}
					});
				},
				{ injector: this._injector },
			);
		});
	}

	public registerComboboxInput(input: BrnComboboxInput<T>): void {
		this._comboboxInput.set(input);
	}

	public isSelected(itemValue: T): boolean {
		return this.isItemEqualToValue()(itemValue, this.value());
	}

	public select(itemValue: T): void {
		this.value.set(itemValue);
		this._onChange?.(itemValue);
		this.close();
	}

	/** Select the active item with Enter key. */
	public selectActiveItem(): void {
		if (!this.isExpanded()) return;

		const value = this.keyManager.activeItem?.value();

		if (value) {
			this.select(value);
		} else {
			this.close();
		}
	}

	public resetValue(): void {
		this.value.set(null);
		this._onChange?.(null);
	}

	public resetSearch(): void {
		this.search.set('');
	}

	public removeValue(_: T): void {
		console.warn('BrnComboboxChipRemove only works with multiple selection comboboxes.');
	}

	public removeLastSelectedItem(): void {
		console.warn('BrnComboboxChipInput only works with multiple selection comboboxes.');
	}

	public open(): void {
		if (this._disabled() || this.isExpanded()) return;

		this._brnPopover?.open();
	}

	public close(): void {
		if (this._disabled() || !this.isExpanded()) return;

		this._brnPopover?.close();
	}

	/** CONTROL VALUE ACCESSOR */
	public writeValue(value: T | null): void {
		this.value.set(value);
	}

	public registerOnChange(fn: ChangeFn<T | null>): void {
		this._onChange = fn;
	}

	public registerOnTouched(fn: TouchFn): void {
		this._onTouched = fn;
	}

	public setDisabledState(isDisabled: boolean): void {
		this._disabled.set(isDisabled);
	}
}
