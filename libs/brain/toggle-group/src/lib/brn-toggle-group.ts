import type { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, computed, Directive, forwardRef, input, linkedSignal, model, output } from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { provideBrnToggleGroup } from './brn-toggle-group.token';
import type { BrnToggleGroupItem } from './brn-toggle-item';

export const BRN_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => BrnToggleGroup),
	multi: true,
};

export class BrnButtonToggleChange<T = unknown> {
	constructor(
		public source: BrnToggleGroupItem<T>,
		public value: ToggleValue<T>,
	) {}
}

@Directive({
	selector: '[brnToggleGroup],brn-toggle-group',
	exportAs: 'brnToggleGroup',
	providers: [provideBrnToggleGroup(BrnToggleGroup), BRN_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR],
	host: {
		role: 'group',
		'[attr.aria-disabled]': 'disabledState()',
		'[attr.data-disabled]': 'disabledState()',
		'(focusout)': 'onTouched()',
	},
})
export class BrnToggleGroup<T = unknown> implements ControlValueAccessor {
	/** The type of the toggle group. */
	public readonly type = input<ToggleType>('single');

	/** Whether the toggle group allows multiple selections. */
	protected readonly _multiple = computed(() => this.type() === 'multiple');

	/** Value of the toggle group. */
	public readonly value = model<ToggleValue<T>>(undefined);

	/** Emits when the value changes. */
	public readonly valueChange = output<ToggleValue<T>>();

	/** Whether no button toggles need to be selected. */
	public readonly nullable = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** Whether the button toggle group is disabled. */
	public readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** The disabled state. */
	public readonly disabledState = linkedSignal(this.disabled);

	/** Emit event when the group value changes. */
	public readonly change = output<BrnButtonToggleChange<T>>();

	/**
	 * The method to be called in order to update ngModel.
	 */
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	private _onChange: (value: ToggleValue<T>) => void = () => {};

	/** onTouch function registered via registerOnTouch (ControlValueAccessor). */
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	protected onTouched: () => void = () => {};

	writeValue(value: ToggleValue<T>): void {
		this.value.set(value);
	}

	registerOnChange(fn: (value: ToggleValue<T>) => void) {
		this._onChange = fn;
	}

	registerOnTouched(fn: () => void) {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabledState.set(isDisabled);
	}

	/**
	 * @internal
	 * Determines whether a value can be set on the group.
	 */
	canDeselect(value: ToggleValue<T>): boolean {
		// if null values are allowed, the group can always be nullable
		if (this.nullable()) return true;

		const currentValue = this.value();

		if (this._multiple() && Array.isArray(currentValue)) {
			return !(currentValue.length === 1 && currentValue[0] === value);
		}

		return currentValue !== value;
	}

	/**
	 * @internal
	 * Selects a value.
	 */
	select(value: T, source: BrnToggleGroupItem<T>): void {
		if (this.disabledState() || this.isSelected(value)) {
			return;
		}

		const currentValue = this.value();

		// emit the valueChange event here as we should only emit based on user interaction
		if (this._multiple()) {
			this.emitSelectionChange([...((currentValue ?? []) as T[]), value], source);
		} else {
			this.emitSelectionChange(value, source);
		}

		this._onChange(this.value());
		this.change.emit(new BrnButtonToggleChange<T>(source, this.value()));
	}

	/**
	 * @internal
	 * Deselects a value.
	 */
	deselect(value: T, source: BrnToggleGroupItem<T>): void {
		if (this.disabledState() || !this.isSelected(value) || !this.canDeselect(value)) {
			return;
		}

		const currentValue = this.value();

		if (this._multiple()) {
			this.emitSelectionChange(
				((currentValue ?? []) as T[]).filter((v) => v !== value),
				source,
			);
		} else if (currentValue === value) {
			this.emitSelectionChange(null, source);
		}
	}

	/**
	 * @internal
	 * Determines whether a value is selected.
	 */
	isSelected(value: T): boolean {
		const currentValue = this.value();

		if (
			currentValue == null ||
			currentValue === undefined ||
			(Array.isArray(currentValue) && currentValue.length === 0)
		) {
			return false;
		}

		if (this._multiple()) {
			return (currentValue as T[])?.includes(value);
		}
		return currentValue === value;
	}

	/** Update the value of the group */
	private emitSelectionChange(value: ToggleValue<T>, source: BrnToggleGroupItem<T>): void {
		this.value.set(value);
		this.valueChange.emit(value);
		this._onChange(value);
		this.change.emit(new BrnButtonToggleChange<T>(source, this.value()));
	}
}

export type ToggleValue<T> = T | T[] | null | undefined;
export type ToggleType = 'single' | 'multiple';
