import type { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	forwardRef,
	input,
	linkedSignal,
	numberAttribute,
	output,
	signal,
	viewChild,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { BrnDialogState } from '@spartan-ng/brain/dialog';
import type { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';
import { BrnPopover } from '@spartan-ng/brain/popover';
import { HlmCalendarMulti } from '@spartan-ng/helm/calendar';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { injectHlmDatePickerMultiConfig } from './hlm-date-picker-multi.token';
import { type HlmDatePickerBase, provideHlmDatePicker } from './hlm-date-picker.token';

export const HLM_DATE_PICKER_MUTLI_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => HlmDatePickerMulti),
	multi: true,
};

@Component({
	selector: 'hlm-date-picker-multi',
	imports: [HlmPopoverImports, HlmCalendarMulti],
	providers: [HLM_DATE_PICKER_MUTLI_VALUE_ACCESSOR, provideHlmDatePicker(HlmDatePickerMulti)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	template: `
		<hlm-popover sideOffset="5" [state]="_popoverState()" (stateChanged)="_popoverState.set($event)">
			<ng-content />

			<hlm-popover-content class="w-fit p-0" *hlmPopoverPortal="let ctx">
				<hlm-calendar-multi
					calendarClass="border-0 rounded-none"
					[date]="_mutableDate()"
					[captionLayout]="captionLayout()"
					[min]="min()"
					[max]="max()"
					[minSelection]="minSelection()"
					[maxSelection]="maxSelection()"
					[disabled]="_disabled()"
					(dateChange)="_handleChange($event)"
				/>
			</hlm-popover-content>
		</hlm-popover>
	`,
})
export class HlmDatePickerMulti<T> implements HlmDatePickerBase, ControlValueAccessor {
	private readonly _config = injectHlmDatePickerMultiConfig<T>();

	public readonly popover = viewChild.required(BrnPopover);

	/** Show dropdowns to navigate between months or years. */
	public readonly captionLayout = input<'dropdown' | 'label' | 'dropdown-months' | 'dropdown-years'>('label');

	/** The minimum date that can be selected.*/
	public readonly min = input<T>();

	/** The maximum date that can be selected. */
	public readonly max = input<T>();

	/** The minimum selectable dates.  */
	public readonly minSelection = input<number, NumberInput>(undefined, {
		transform: numberAttribute,
	});

	/** The maximum selectable dates.  */
	public readonly maxSelection = input<number, NumberInput>(undefined, {
		transform: numberAttribute,
	});

	/** Determine if the date picker is disabled. */
	public readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** The selected value. */
	public readonly date = input<T[]>();

	protected readonly _mutableDate = linkedSignal(this.date);

	/** If true, the date picker will close when the max selection of dates is reached. */
	public readonly autoCloseOnMaxSelection = input<boolean, BooleanInput>(this._config.autoCloseOnMaxSelection, {
		transform: booleanAttribute,
	});

	/** Defines how the date should be displayed in the UI.  */
	public readonly formatDates = input<(date: T[]) => string>(this._config.formatDates);

	/** Defines how the date should be transformed before saving to model/form. */
	public readonly transformDates = input<(date: T[]) => T[]>(this._config.transformDates);

	protected readonly _popoverState = signal<BrnDialogState | null>(null);

	protected readonly _disabled = linkedSignal(this.disabled);

	/** @internal The disabled state as a readonly signal */
	public readonly disabledState = this._disabled.asReadonly();

	public readonly formattedDate = computed(() => {
		const dates = this._mutableDate();
		return dates ? this.formatDates()(dates) : undefined;
	});

	public readonly dateChange = output<T[]>();

	protected _onChange?: ChangeFn<T[]>;
	protected _onTouched?: TouchFn;

	protected _handleChange(value: T[] | undefined) {
		if (value === undefined) return;

		if (this._disabled()) return;
		const transformedDate = value !== undefined ? this.transformDates()(value) : value;

		this._mutableDate.set(transformedDate);
		this._onChange?.(transformedDate);
		this.dateChange.emit(transformedDate);

		if (this.autoCloseOnMaxSelection() && this._mutableDate()?.length === this.maxSelection()) {
			this._popoverState.set('closed');
		}
	}

	/** CONTROL VALUE ACCESSOR */
	public writeValue(value: T[] | null): void {
		this._mutableDate.set(value ? this.transformDates()(value) : undefined);
	}

	public registerOnChange(fn: ChangeFn<T[]>): void {
		this._onChange = fn;
	}

	public registerOnTouched(fn: TouchFn): void {
		this._onTouched = fn;
	}

	public setDisabledState(isDisabled: boolean): void {
		this._disabled.set(isDisabled);
	}

	public open() {
		this._popoverState.set('open');
	}

	public close() {
		this._popoverState.set('closed');
	}
}
