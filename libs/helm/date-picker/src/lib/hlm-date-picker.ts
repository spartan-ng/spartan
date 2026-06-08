import type { BooleanInput } from '@angular/cdk/coercion';
import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	contentChild,
	forwardRef,
	input,
	linkedSignal,
	output,
	signal,
	viewChild,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { BrnDialogState } from '@spartan-ng/brain/dialog';
import { BrnFieldControl, provideBrnLabelable } from '@spartan-ng/brain/field';
import type { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';
import { BrnPopover } from '@spartan-ng/brain/popover';
import { HlmCalendar } from '@spartan-ng/helm/calendar';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { HlmDatePickerTriggerToken } from './hlm-date-picker-trigger.token';
import { HlmDatePickerBase, injectHlmDatePickerConfig, provideHlmDatePicker } from './hlm-date-picker.token';

export const HLM_DATE_PICKER_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => HlmDatePicker),
	multi: true,
};

@Component({
	selector: 'hlm-date-picker',
	imports: [HlmPopoverImports, HlmCalendar],
	providers: [HLM_DATE_PICKER_VALUE_ACCESSOR, provideHlmDatePicker(HlmDatePicker), provideBrnLabelable(HlmDatePicker)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [BrnFieldControl],
	host: { class: 'block' },
	template: `
		<hlm-popover
			sideOffset="5"
			autoFocus="first-heading"
			[state]="_popoverState()"
			(stateChanged)="_popoverState.set($event)"
			(closed)="_onTouched?.()"
		>
			<ng-content />

			<hlm-popover-content class="w-fit p-0" *hlmPopoverPortal="let ctx">
				<ng-content select="[hlmDatePickerHeader]" />
				<hlm-calendar
					calendarClass="rounded-none border-0"
					[captionLayout]="captionLayout()"
					[date]="_mutableDate()"
					[defaultFocusedDate]="_mutableDate() ?? defaultFocusedDate()"
					[min]="min()"
					[max]="max()"
					[disabled]="_disabled()"
					(dateChange)="_handleChange($event)"
				/>
				<ng-content select="[hlmDatePickerFooter]" />
			</hlm-popover-content>
		</hlm-popover>
	`,
})
export class HlmDatePicker<T> implements HlmDatePickerBase<T>, ControlValueAccessor {
	private readonly _config = injectHlmDatePickerConfig<T>();

	public readonly popover = viewChild.required(BrnPopover);

	private readonly _trigger = contentChild(HlmDatePickerTriggerToken);

	/** Show dropdowns to navigate between months or years. */
	public readonly captionLayout = input<'dropdown' | 'label' | 'dropdown-months' | 'dropdown-years'>('label');

	/** The minimum date that can be selected.*/
	public readonly min = input<T>();

	/** The maximum date that can be selected. */
	public readonly max = input<T>();

	/** Determine if the date picker is disabled. */
	public readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** The selected value. */
	public readonly date = input<T>();

	/** The date the calendar focuses on first open when no date is selected. */
	public readonly defaultFocusedDate = input<T>();

	protected readonly _mutableDate = linkedSignal(this.date);

	/** If true, the date picker will close when a date is selected. */
	public readonly autoCloseOnSelect = input<boolean, BooleanInput>(this._config.autoCloseOnSelect, {
		transform: booleanAttribute,
	});

	/** Defines how the date should be displayed in the UI.  */
	public readonly formatDate = input<(date: T) => string>(this._config.formatDate);

	/** Defines how the date should be transformed before saving to model/form. */
	public readonly transformDate = input<(date: T) => T>(this._config.transformDate);

	protected readonly _popoverState = signal<BrnDialogState | null>(null);

	protected readonly _disabled = linkedSignal(this.disabled);

	/** @internal The disabled state as a readonly signal */
	public readonly disabledState = this._disabled.asReadonly();

	public readonly formattedDate = computed(() => {
		const date = this._mutableDate();
		return date ? this.formatDate()(date) : undefined;
	});

	public readonly dateChange = output<T>();

	public readonly labelableId = computed(() => this._trigger()?.triggerId());

	public readonly hasDate = computed(() => !!this._mutableDate());

	protected _onChange?: ChangeFn<T>;
	protected _onTouched?: TouchFn;

	protected _handleChange(value: T | undefined) {
		if (this._disabled()) return;
		this.updateDate(value);

		if (this.autoCloseOnSelect()) {
			this._popoverState.set('closed');
		}
	}

	/**
	 * Commit a date to the picker. Updates the internal model, notifies form
	 * controls, and emits `dateChange`. Unlike `_handleChange`, this does not
	 * close the popover - it's intended to be called from a text input that
	 * is parsing user-entered values while typing.
	 */
	public updateDate(value: T | undefined) {
		if (this._disabled()) return;
		const transformedDate = value !== undefined ? this.transformDate()(value) : undefined;

		this._mutableDate.set(transformedDate);
		this._onChange?.(transformedDate as T);
		this.dateChange.emit(transformedDate as T);
	}

	/** CONTROL VALUE ACCESSOR */
	public writeValue(value: T | null): void {
		this._mutableDate.set(value ? this.transformDate()(value) : undefined);
	}

	public registerOnChange(fn: ChangeFn<T>): void {
		this._onChange = fn;
	}

	public registerOnTouched(fn: TouchFn): void {
		this._onTouched = fn;
	}

	public touched(): void {
		this._onTouched?.();
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

	public reset() {
		this._mutableDate.set(undefined);
		this._onChange?.(undefined as T);
		this.dateChange.emit(undefined as T);
	}
}
