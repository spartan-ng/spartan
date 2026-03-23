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
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BrnFieldControl, provideBrnLabelable } from '@spartan-ng/brain/field';
import { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';
import { BrnPopover } from '@spartan-ng/brain/popover';
import { BrnAutocompleteInput } from './brn-autocomplete-input';
import { BrnAutocompleteInputWrapper } from './brn-autocomplete-input-wrapper';
import { BrnAutocompleteItem } from './brn-autocomplete-item';
import { BrnAutocompleteItemToken } from './brn-autocomplete-item.token';
import {
	AutocompleteItemEqualToValue,
	AutocompleteItemToString,
	BrnAutocompleteBase,
	injectBrnAutocompleteConfig,
	provideBrnAutocompleteBase,
} from './brn-autocomplete.token';

export const BRN_AUTOCOMPLETE_CONTROL_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => BrnAutocomplete),
	multi: true,
};

@Directive({
	selector: '[brnAutocomplete]',
	providers: [
		BRN_AUTOCOMPLETE_CONTROL_VALUE_ACCESSOR,
		provideBrnAutocompleteBase(BrnAutocomplete),
		provideBrnLabelable(BrnAutocomplete),
	],
	hostDirectives: [BrnFieldControl],
	host: {
		'(focusout)': '_onFocusOut($event)',
	},
})
export class BrnAutocomplete<T> implements BrnAutocompleteBase<T>, ControlValueAccessor {
	private readonly _injector = inject(Injector);
	private readonly _fieldControl = inject(BrnFieldControl, { optional: true });
	private readonly _config = injectBrnAutocompleteConfig<T>();

	/** Access the popover if present */
	private readonly _brnPopover = inject(BrnPopover, { optional: true });

	/** Whether the autocomplete is disabled */
	public readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	protected readonly _disabled = linkedSignal(this.disabled);

	/** @internal The disabled state as a readonly signal */
	public readonly disabledState = this._disabled.asReadonly();

	/** A function to compare an item with the selected value. */
	public readonly isItemEqualToValue = input<AutocompleteItemEqualToValue<T>>(this._config.isItemEqualToValue);

	/** A function to convert an item to a string for display. */
	public readonly itemToString = input<AutocompleteItemToString<T> | undefined>(this._config.itemToString);

	/** Whether to auto-highlight the first matching item. */
	public readonly autoHighlight = input<boolean, BooleanInput>(this._config.autoHighlight, {
		transform: booleanAttribute,
	});

	/** The selected value of the autocomplete. */
	public readonly value = model<T | null>(null);

	/** The current search query. */
	public readonly search = model<string>('');

	private readonly _searchInputWrapper = contentChild(BrnAutocompleteInputWrapper, {
		read: ElementRef,
	});

	/** @internal The width of the search input wrapper */
	public readonly searchInputWrapperWidth = computed<number | null>(() => {
		const inputElement = this._searchInputWrapper()?.nativeElement;
		if (!inputElement) return null;
		return inputElement.getBoundingClientRect().width || inputElement.offsetWidth;
	});

	/** @internal Access all the items within the autocomplete */
	public readonly items = contentChildren<BrnAutocompleteItem<T>>(BrnAutocompleteItemToken, {
		descendants: true,
	});

	/** Determine if the autocomplete has any visible items */
	public readonly visibleItems = computed(() => this.items().length > 0);

	/** @internal The key manager for managing active descendant */
	public readonly keyManager = new ActiveDescendantKeyManager(this.items, this._injector);

	/** @internal Whether the autocomplete is expanded */
	public readonly isExpanded = computed(() => this._brnPopover?.stateComputed() === 'open');

	private readonly _autocompleteInput = signal<BrnAutocompleteInput<T> | undefined>(undefined);

	protected _onChange?: ChangeFn<T | null>;
	protected _onTouched?: TouchFn;

	public readonly labelableId = computed(() => this._autocompleteInput()?.id());

	public readonly controlState = this._fieldControl?.controlState;

	constructor() {
		this.keyManager
			.withVerticalOrientation()
			.withHomeAndEnd()
			.withWrap()
			.skipPredicate((item) => item.disabled);

		this._brnPopover?.closed.subscribe(() => {
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

	public registerAutocompleteInput(input: BrnAutocompleteInput<T>): void {
		return this._autocompleteInput.set(input);
	}

	updateSearch(value: string) {
		this.search.set(value);
		this.open();

		if (value === '') {
			this.resetValue();
		}
	}

	isSelected(itemValue: T): boolean {
		return this.isItemEqualToValue()(itemValue, this.value());
	}

	select(itemValue: T) {
		this.value.set(itemValue);
		this._onChange?.(itemValue);
		this.close();
	}

	/** Select the active item with Enter key. */
	selectActiveItem() {
		if (!this.isExpanded()) return;

		const value = this.keyManager.activeItem?.value();

		if (value) {
			this.select(value);
		} else {
			this.close();
		}
	}

	resetValue() {
		this.value.set(null);
		this.search.set('');
		this._onChange?.(null);
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

	/** CONTROL VALUE ACCESSOR */
	writeValue(value: T | null): void {
		this.value.set(value);
	}

	registerOnChange(fn: ChangeFn<T | null>): void {
		this._onChange = fn;
	}

	registerOnTouched(fn: TouchFn): void {
		this._onTouched = fn;
	}

	setDisabledState(isDisabled: boolean) {
		this._disabled.set(isDisabled);
	}

	protected _onFocusOut(event: FocusEvent): void {
		const currentTarget = event.currentTarget as HTMLElement;
		const focusedEl = event.relatedTarget as HTMLElement | null;

		if (!currentTarget.contains(focusedEl)) {
			this._onTouched?.();
		}
	}
}
