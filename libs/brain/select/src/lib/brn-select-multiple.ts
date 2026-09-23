import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import type { BooleanInput } from '@angular/cdk/coercion';
import {
	afterNextRender,
	booleanAttribute,
	computed,
	contentChildren,
	Directive,
	effect,
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
import type { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';
import { BrnPopover } from '@spartan-ng/brain/popover';
import { type BrnSelectOption, BrnSelectItemToken } from './brn-select-item.token';
import type { BrnSelectList } from './brn-select-list';
import { BrnSelectTrigger } from './brn-select-trigger';
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
	providers: [
		provideBrnSelectBase(BrnSelectMultiple),
		BRN_SELECT_MULTIPLE_VALUE_ACCESSOR,
		provideBrnLabelable(BrnSelectMultiple),
	],
	hostDirectives: [BrnFieldControl],
})
export class BrnSelectMultiple<T> implements BrnSelectBase<T>, ControlValueAccessor {
	private readonly _injector = inject(Injector);
	private readonly _fieldControl = inject(BrnFieldControl, { optional: true });

	private readonly _config = injectBrnSelectConfig<T>();

	public readonly controlState = this._fieldControl?.controlState;

	/** Access the popover if present */
	private readonly _brnPopover = inject(BrnPopover, { optional: true });

	/** Whether the combobox is disabled */
	public readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	protected readonly _disabled = linkedSignal(this.disabled);

	/** @internal The disabled state as a readonly signal */
	public readonly disabledState = this._disabled.asReadonly();

	/** The selected value of the select. */
	public readonly value = model<T[] | undefined | null>(null);

	public readonly hasValue = computed(() => {
		const value = this.value();
		if (value === null || value === undefined) return false;
		return value.length > 0;
	});

	/** A function to compare an item with the selected value. */
	public readonly isItemEqualToValue = input<SelectItemEqualToValue<T>>(this._config.isItemEqualToValue);

	/** A function to convert an item to a string for display. */
	public readonly itemToString = input<SelectItemToString<T> | undefined>(this._config.itemToString);

	private readonly _triggerWidth = signal<number | null>(null);

	/** @internal The width of the trigger wrapper */
	public readonly triggerWidth = this._triggerWidth.asReadonly();

	/** @internal Access all the items within the select */
	public readonly items = contentChildren<BrnSelectOption<T>>(BrnSelectItemToken, {
		descendants: true,
	});

	/** @internal The values of all enabled items; the select-all row and valueless items are excluded. */
	private readonly _enabledItemValues = computed(() =>
		this.items().flatMap((item) => {
			if (item.disabled) return [];

			const itemValue = item.value();
			return itemValue === undefined ? [] : [itemValue];
		}),
	);

	/**
	 * Whether every enabled item is selected. Always `false` while the panel is closed,
	 * as items are only rendered while it is open.
	 */
	public readonly allSelected = computed(() => {
		const values = this._enabledItemValues();
		return values.length > 0 && values.every((v) => this.isSelected(v));
	});

	/**
	 * Whether some but not all enabled items are selected.
	 * Surfaced on the select-all row as `data-state="indeterminate"`, matching the checkbox vocabulary.
	 */
	public readonly partiallySelected = computed(
		() => !this.allSelected() && this._enabledItemValues().some((v) => this.isSelected(v)),
	);

	/** @internal The key manager for managing active descendant */
	public readonly keyManager = new ActiveDescendantKeyManager(this.items, this._injector);

	/** @internal Whether the select is expanded */
	public readonly isExpanded = computed(() => this._brnPopover?.stateComputed() === 'open');

	private readonly _selectTrigger = signal<BrnSelectTrigger | undefined>(undefined);

	public readonly labelableId = computed(() => this._selectTrigger()?.id());

	private readonly _selectList = signal<BrnSelectList | undefined>(undefined);

	/** @internal The id of the select list, registered by BrnSelectList. Used by the trigger for aria-controls. */
	public readonly listId = computed(() => this._selectList()?.id());

	protected _onChange?: ChangeFn<T[] | undefined | null>;
	protected _onTouched?: TouchFn;

	constructor() {
		this.keyManager
			.withVerticalOrientation()
			.withHomeAndEnd()
			.withPageUpDown()
			.withTypeAhead()
			.withWrap()
			.skipPredicate((item) => item.disabled);

		this._brnPopover?.closed.subscribe(() => {
			this._onTouched?.();
			this.keyManager.setActiveItem(-1);
		});

		afterNextRender(() => {
			effect(
				() => {
					if (!this.isExpanded()) return;

					const items = this.items();

					// value is read untracked: re-running on every selection would move the active item
					// to the last selected value while the user is navigating (e.g. off the select-all row).
					untracked(() => {
						const values = this.value();
						const lastValue = values ? values[values.length - 1] : null;

						const index =
							lastValue !== null && lastValue !== undefined
								? items.findIndex((item) => {
										const itemValue = item.value();
										return itemValue !== undefined && this.isItemEqualToValue()(itemValue, lastValue);
									})
								: -1;

						if (index !== -1) {
							this.keyManager.setActiveItem(index);
						} else if (items.length > 0) {
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

	public registerSelectTrigger(input: BrnSelectTrigger): void {
		return this._selectTrigger.set(input);
	}

	/** @internal Register the select list. Called by BrnSelectList in its constructor. */
	public registerSelectList(list: BrnSelectList): void {
		this._selectList.set(list);
	}

	public updateTriggerWidth(width: number | null): void {
		this._triggerWidth.set(width);
	}

	public isSelected(itemValue: T): boolean {
		return this._containsValue(this.value() ?? [], itemValue);
	}

	private _containsValue(values: T[], itemValue: T): boolean {
		return values.some((v) => this.isItemEqualToValue()(itemValue, v));
	}

	public select(itemValue: T): void {
		const selected = this.value() ?? [];

		if (this.isSelected(itemValue)) {
			this.value.set(selected.filter((d) => !this.isItemEqualToValue()(d, itemValue)) ?? []);
		} else {
			this.value.set([...selected, itemValue]);
		}

		this._onChange?.(this.value() ?? []);
	}

	/**
	 * Select all enabled items. Selected values without a matching item and the values
	 * of selected but disabled items are preserved.
	 *
	 * Operates on the rendered items, which only exist while the panel is open (items are portaled).
	 */
	public selectAll(): void {
		const current = this.value() ?? [];
		const next = [...current];

		for (const itemValue of this._enabledItemValues()) {
			if (!this._containsValue(next, itemValue)) {
				next.push(itemValue);
			}
		}

		if (next.length === current.length) return;

		this.value.set(next);
		this._onChange?.(next);
	}

	/**
	 * Deselect all enabled items. Selected values without a matching item and the values
	 * of selected but disabled items are preserved.
	 *
	 * Operates on the rendered items, which only exist while the panel is open (items are portaled).
	 */
	public deselectAll(): void {
		const current = this.value() ?? [];
		const enabled = this._enabledItemValues();
		const next = current.filter((v) => !enabled.some((e) => this.isItemEqualToValue()(e, v)));

		if (next.length === current.length) return;

		this.value.set(next);
		this._onChange?.(next);
	}

	/**
	 * Toggle between selecting and deselecting all enabled items.
	 *
	 * Operates on the rendered items, which only exist while the panel is open (items are portaled).
	 */
	public toggleAll(): void {
		this.allSelected() ? this.deselectAll() : this.selectAll();
	}

	/** Select the active item via keyboard (Enter or Space while expanded). */
	public selectActiveItem(): void {
		if (!this.isExpanded()) return;

		const activeItem = this.keyManager.activeItem;

		// setActiveItem() bypasses skipPredicate, so the active item may be disabled.
		if (activeItem?.disabled) return;

		if (activeItem) {
			activeItem.select();
		} else {
			this.close();
		}
	}

	public open(): void {
		if (this._disabled() || this.isExpanded()) return;

		this._brnPopover?.open();
	}

	public close(): void {
		if (this._disabled() || !this.isExpanded()) return;

		this._brnPopover?.close();
	}

	public toggle(): void {
		this.isExpanded() ? this.close() : this.open();
	}

	/** CONTROL VALUE ACCESSOR */
	public writeValue(value: T[] | undefined | null): void {
		this.value.set(value);
	}

	public registerOnChange(fn: ChangeFn<T[] | undefined | null>): void {
		this._onChange = fn;
	}

	public registerOnTouched(fn: TouchFn): void {
		this._onTouched = fn;
	}

	public setDisabledState(isDisabled: boolean): void {
		this._disabled.set(isDisabled);
	}
}
