import { BooleanInput } from '@angular/cdk/coercion';
import {
	AfterViewInit,
	Component,
	OnChanges,
	SimpleChanges,
	booleanAttribute,
	computed,
	contentChildren,
	forwardRef,
	input,
	model,
	output,
	signal,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { provideBrnToggleGroup } from './brn-toggle-group.token';
import { BrnToggleDirective } from './brn-toggle.directive';

export const BRN_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => BrnToggleGroupComponent),
	multi: true,
};

export class BrnButtonToggleChange<T = unknown> {
	constructor(
		public source: BrnToggleDirective<T>,
		public value: ToggleValue<T>,
	) {}
}

@Component({
	selector: 'brn-toggle-group',
	standalone: true,
	providers: [provideBrnToggleGroup(BrnToggleGroupComponent), BRN_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR],
	host: {
		role: 'group',
		class: 'brn-button-toggle-group',
		'[attr.aria-disabled]': 'state().disabled()',
		'[attr.data-disabled]': 'state().disabled()',
		'[attr.data-vertical]': 'vertical()',
		'(focusout)': 'onTouched()',
	},
	exportAs: 'brnToggleGroup',
	template: `
		<ng-content />
	`,
})
export class BrnToggleGroupComponent<T = unknown> implements ControlValueAccessor, OnChanges, AfterViewInit {
	/**
	 * The method to be called in order to update ngModel.
	 */
	private _onChange: (value: ToggleValue<T>) => void = () => {};

	/** onTouch function registered via registerOnTouch (ControlValueAccessor). */
	protected onTouched: () => void = () => {};

	/** Whether the button toggle group has a vertical orientation */
	readonly vertical = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** Value of the toggle group. */
	readonly value = model<ToggleValue<T>>(undefined);

	/** Whether no button toggles need to be selected. */
	readonly nullable = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** Whether multiple button toggles can be selected. */
	readonly multiple = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** Whether the button toggle group is disabled. */
	readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** The internal state of the component. This can be replaced with linkedSignal in the future. */
	readonly state = computed(() => ({
		disabled: signal(this.disabled()),
	}));

	/** Emit event when the group value changes. */
	readonly change = output<BrnButtonToggleChange<T>>();

	/** The toggles within the group. */
	private readonly _toggleButtons = contentChildren(BrnToggleDirective, { descendants: true });

	ngAfterViewInit() {
		// This is needed because we need access to our toggles through
		// contentChildren to sync initial values set in writeValue before they are available, e.g. default values in a form
		this.updateSelectionState();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if ('value' in changes) {
			this.updateSelectionState();
		}
	}

	writeValue(value: ToggleValue<T>): void {
		this.value.set(value);
		this.updateSelectionState();
	}

	registerOnChange(fn: (value: ToggleValue<T>) => void) {
		this._onChange = fn;
	}

	registerOnTouched(fn: () => void) {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.state().disabled.set(isDisabled);
	}

	/**
	 * @internal
	 * Determines whether a value can be set on the group.
	 */
	canDeselect(value: ToggleValue<T>): boolean {
		// if null values are allowed, the group can always be nullable
		if (this.nullable()) return true;

		const currentValue = this.value();

		if (this.multiple() && Array.isArray(currentValue)) {
			return !(currentValue.length === 1 && currentValue[0] === value);
		}

		return currentValue !== value;
	}

	/**
	 * @internal
	 * Selects a value.
	 */
	select(value: T, source: BrnToggleDirective<T>): void {
		if (this.state().disabled() || this.isSelected(value)) {
			return;
		}

		const currentValue = this.value();

		// emit the valueChange event here as we should only emit based on user interaction
		if (this.multiple()) {
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
	deselect(value: T, source: BrnToggleDirective<T>): void {
		if (this.state().disabled() || !this.isSelected(value)) {
			return;
		}

		const currentValue = this.value();

		if (this.multiple()) {
			this.emitSelectionChange(
				((currentValue ?? []) as T[]).filter((v) => v !== value),
				source,
			);
		} else if (currentValue === value && this.canDeselect(value)) {
			this.emitSelectionChange(null, source);
		}
	}

	/** Update the value of the group */
	private emitSelectionChange(value: ToggleValue<T>, source: BrnToggleDirective<T>): void {
		this.value.set(value);
		this._onChange(value);
		this.change.emit(new BrnButtonToggleChange<T>(source, this.value()));

		// propagate the change to the other toggles in the group
		this.updateSelectionState();
	}

	/** Update the selection state in the toggle buttons. */
	private updateSelectionState(): void {
		for (const toggle of this._toggleButtons()) {
			this.isSelected(toggle.value() as T) ? toggle.toggleOn() : toggle.toggleOff();
		}
	}

	/**
	 * @internal
	 * Determines whether a value is selected.
	 */
	private isSelected(value: T): boolean {
		const currentValue = this.value();

		if (
			currentValue == null ||
			currentValue === undefined ||
			(Array.isArray(currentValue) && currentValue.length === 0)
		) {
			return false;
		}

		if (this.multiple()) {
			return (currentValue as T[])?.includes(value);
		}
		return currentValue === value;
	}
}

type ToggleValue<T> = T | T[] | null | undefined;
