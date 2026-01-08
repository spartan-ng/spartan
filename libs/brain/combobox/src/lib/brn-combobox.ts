import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { BooleanInput } from '@angular/cdk/coercion';
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
import { BrnComboboxItem } from './brn-combobox-item';
import { BrnComboboxItemToken } from './brn-combobox-item.token';
import {
	ComboboxFilter,
	ComboboxFilterOptions,
	ComboboxItemToString,
	injectBrnComboboxConfig,
	provideBrnCombobox,
} from './brn-combobox.token';

export const BRN_COMBOBOX_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => BrnCombobox),
	multi: true,
};

@Directive({
	selector: '[brnCombobox]',
	providers: [provideBrnCombobox(BrnCombobox), BRN_COMBOBOX_VALUE_ACCESSOR],
})
export class BrnCombobox<T> implements ControlValueAccessor {
	private readonly _injector = inject(Injector);

	private readonly _config = injectBrnComboboxConfig<T>();

	/** Access the popover if present */
	private readonly _brnPopover = inject(BrnPopover, { optional: true });

	public readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	public readonly _disabled = linkedSignal(this.disabled);

	public readonly filterOptions = input<ComboboxFilterOptions>({});

	public readonly collator = computed(() => {
		const options = this.filterOptions();
		const mergedOptions = { ...this._config.filterOptions, ...options };
		return new Intl.Collator(options.locale, mergedOptions);
	});

	public readonly itemToString = input<ComboboxItemToString<T> | undefined>(this._config.itemToStringLabel);

	/** A custom filter function to use when searching. */
	public readonly filter = input<ComboboxFilter<T>>(this._config.filter);

	public readonly value = model<T | null>(null);

	public readonly search = signal('');

	private readonly _searchInputWrapper = contentChild(BrnComboboxInputWrapper, {
		read: ElementRef,
	});

	public readonly searchInputWrapperWidth = computed(() => {
		const inputElement = this._searchInputWrapper()?.nativeElement;
		return inputElement ? inputElement.offsetWidth : null;
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

	protected _onChange?: ChangeFn<T>;
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

	select(value: T): void {
		this.value.set(value);
		this.close();
	}

	selectActiveItem() {
		if (this.isExpanded()) {
			const value = this.keyManager.activeItem?.value();
			if (value) {
				this.select(value);
			}
		}
	}

	resetValue() {
		this.value.set(null);
	}

	open() {
		if (this.disabled() || this.isExpanded()) return;

		this._brnPopover?.open();
	}

	close() {
		if (this.disabled() || !this.isExpanded()) return;

		this._brnPopover?.close();
	}

	toggle() {
		if (this.disabled()) return;

		this.isExpanded() ? this.close() : this.open();
	}

	/** CONTROL VALUE ACCESSOR */
	writeValue(value: T | null): void {
		this.value.set(value);
	}

	registerOnChange(fn: ChangeFn<T>): void {
		this._onChange = fn;
	}

	registerOnTouched(fn: TouchFn): void {
		this._onTouched = fn;
	}

	setDisabledState(isDisabled: boolean) {
		this._disabled.set(isDisabled);
	}
}
