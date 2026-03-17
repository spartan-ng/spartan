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
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';
import { BrnPopover } from '@spartan-ng/brain/popover';
import { BrnSelectItem } from './brn-select-item';
import { BrnSelectItemToken } from './brn-select-item.token';
import { BrnSelectTriggerWrapper } from './brn-select-trigger-wrapper';
import {
	BrnSelectBase,
	injectBrnSelectConfig,
	provideBrnSelectBase,
	SelectItemEqualToValue,
	SelectItemToString,
} from './brn-select.token';

export const BRN_SELECT_MULTIPLE_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => BrnSelectMultiple),
	multi: true,
};

@Directive({
	selector: '[brnSelectMultiple]',
	providers: [provideBrnSelectBase(BrnSelectMultiple), BRN_SELECT_MULTIPLE_VALUE_ACCESSOR],
})
export class BrnSelectMultiple<T> implements BrnSelectBase<T>, ControlValueAccessor {
	private readonly _injector = inject(Injector);

	private readonly _config = injectBrnSelectConfig<T>();

	/** Access the popover if present */
	private readonly _brnPopover = inject(BrnPopover, { optional: true });

	/** Whether the combobox is disabled */
	public readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	protected readonly _disabled = linkedSignal(this.disabled);

	/** @internal The disabled state as a readonly signal */
	public readonly disabledState = this._disabled.asReadonly();

	/** The selected value of the select. */
	public readonly value = model<T[] | null>(null);

	/** A function to compare an item with the selected value. */
	public readonly isItemEqualToValue = input<SelectItemEqualToValue<T>>(this._config.isItemEqualToValue);

	/** A function to convert an item to a string for display. */
	public readonly itemToString = input<SelectItemToString<T> | undefined>(this._config.itemToString);

	private readonly _triggerWrapper = contentChild(BrnSelectTriggerWrapper, {
		read: ElementRef,
	});

	/** @internal The width of the trigger wrapper */
	public readonly triggerWidth = computed<number | null>(() => {
		const element = this._triggerWrapper()?.nativeElement;
		if (!element) return null;
		return element.getBoundingClientRect().width || element.offsetWidth;
	});

	/** @internal Access all the items within the select */
	public readonly items = contentChildren<BrnSelectItem<T>>(BrnSelectItemToken, {
		descendants: true,
	});

	/** @internal The key manager for managing active descendant */
	public readonly keyManager = new ActiveDescendantKeyManager(this.items, this._injector);

	/** @internal Whether the select is expanded */
	public readonly isExpanded = computed(() => this._brnPopover?.stateComputed() === 'open');

	protected _onChange?: ChangeFn<T[] | null>;
	protected _onTouched?: TouchFn;

	constructor() {
		this.keyManager
			.withVerticalOrientation()
			.withHomeAndEnd()
			.withTypeAhead()
			.withWrap()
			.skipPredicate((item) => item.disabled);

		this._brnPopover?.closed.subscribe(() => {
			this._onTouched?.();
			this.keyManager.setActiveItem(-1);
		});
	}

	public isSelected(itemValue: T): boolean {
		return this.value()?.some((v) => this.isItemEqualToValue()(itemValue, v)) ?? false;
	}

	public select(itemValue: T): void {
		const selected = this.value() ?? [];

		if (this.isSelected(itemValue)) {
			this.value.set(selected.filter((d) => !this.isItemEqualToValue()(d, itemValue)) ?? []);
		} else {
			this.value.set([...selected, itemValue]);
		}

		this._onChange?.(this.value() ?? []);
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

	private close(): void {
		if (this._disabled() || !this.isExpanded()) return;

		this._brnPopover?.close();
	}

	/** CONTROL VALUE ACCESSOR */
	public writeValue(value: T[] | null): void {
		this.value.set(value);
	}

	public registerOnChange(fn: ChangeFn<T[] | null>): void {
		this._onChange = fn;
	}

	public registerOnTouched(fn: TouchFn): void {
		this._onTouched = fn;
	}

	public setDisabledState(isDisabled: boolean): void {
		this._disabled.set(isDisabled);
	}
}
