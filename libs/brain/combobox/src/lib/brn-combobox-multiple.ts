import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import type { BooleanInput } from '@angular/cdk/coercion';
import {
	booleanAttribute,
	computed,
	contentChild,
	contentChildren,
	Directive,
	ElementRef,
	forwardRef,
	inject,
	Injector,
	input,
	linkedSignal,
	model,
	signal,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';
import type { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';
import { BrnPopover } from '@spartan-ng/brain/popover';
import { BrnComboboxInputWrapper } from './brn-combobox-input-wrapper';
import { type BrnComboboxItem } from './brn-combobox-item';
import { BrnComboboxItemToken } from './brn-combobox-item.token';
import {
	injectBrnComboboxConfig,
	provideBrnComboboxBase,
	type BrnComboboxBase,
	type ComboboxFilter,
	type ComboboxFilterOptions,
	type ComboboxItemEqualToValue,
	type ComboboxItemToString,
} from './brn-combobox.token';

export const BRN_COMBOBOX_MULTIPLE_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => BrnComboboxMultiple),
	multi: true,
};

@Directive({
	selector: '[brnCombobox]',
	providers: [provideBrnComboboxBase(BrnComboboxMultiple), BRN_COMBOBOX_MULTIPLE_VALUE_ACCESSOR],
})
export class BrnComboboxMultiple<T> implements BrnComboboxBase<T>, ControlValueAccessor {
	private readonly _injector = inject(Injector);

	private readonly _config = injectBrnComboboxConfig<T>();

	/** Access the popover if present */
	private readonly _brnPopover = inject(BrnPopover, { optional: true });

	/** Whether the combobox is disabled */
	public readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

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
	public readonly itemToString = input<ComboboxItemToString<T> | undefined>(this._config.itemToStringLabel);

	/** A custom filter function to use when searching. */
	public readonly filter = input<ComboboxFilter<T>>(this._config.filter);

	/** The selected values of the combobox. */
	public readonly value = model<T[] | null>(null);

	/** The current search query. */
	public readonly search = signal<string>('');

	private readonly _searchInputWrapper = contentChild(BrnComboboxInputWrapper, {
		read: ElementRef,
	});

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

	/** @internal Whether the autocomplete is expanded */
	public readonly isExpanded = computed(() => this._brnPopover?.stateComputed() === 'open');

	protected _onChange?: ChangeFn<T[]>;
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
	}

	isSelected(itemValue: T): boolean {
		return this.value()?.some((v) => this.isItemEqualToValue()(itemValue, v)) ?? false;
	}

	select(itemValue: T): void {
		const selected = this.value() ?? [];
		if (this.isSelected(itemValue)) {
			this.value.set(selected.filter((d) => !this.isItemEqualToValue()(d, itemValue)) ?? []);
		} else {
			this.value.set([...selected, itemValue]);
		}

		if (this.search() !== '') {
			// reset search after selection and close popover
			this.search.set('');
			this.close();
		}

		this._onChange?.(this.value() ?? []);
	}

	/** Select the active item with Enter key. */
	selectActiveItem() {
		if (!this.isExpanded()) return;

		const value = this.keyManager.activeItem?.value();

		if (value === undefined) return;

		this.select(value);
	}

	resetValue() {
		this.value.set(null);
	}

	open() {
		if (this._disabled() || this.isExpanded()) return;

		this._brnPopover?.open();
	}

	close() {
		if (this._disabled() || !this.isExpanded()) return;

		this._brnPopover?.close();
	}

	toggle() {
		if (this._disabled()) return;

		this.isExpanded() ? this.close() : this.open();
	}

	removeValue(value: T) {
		const selected = this.value() ?? [];
		this.value.set(selected.filter((d) => d !== value) ?? []);
	}

	removeLastSelectedItem() {
		const selected = this.value() ?? [];
		if (selected.length === 0) return;

		selected.pop();
		this.value.set([...selected]);
	}

	/** CONTROL VALUE ACCESSOR */
	writeValue(value: T[] | null): void {
		this.value.set(value);
	}

	registerOnChange(fn: ChangeFn<T[]>): void {
		this._onChange = fn;
	}

	registerOnTouched(fn: TouchFn): void {
		this._onTouched = fn;
	}

	setDisabledState(isDisabled: boolean) {
		this._disabled.set(isDisabled);
	}
}
