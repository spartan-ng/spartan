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
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import type { BrnDialogState } from '@spartan-ng/brain/dialog';
import type { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';
import { BrnPopoverImports } from '@spartan-ng/brain/popover';
import { HlmCalendarMulti } from '@spartan-ng/helm/calendar';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';
import { injectHlmDatePickerMultiConfig } from './hlm-date-picker-multi.token';

export const HLM_DATE_PICKER_MUTLI_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => HlmDatePickerMulti),
	multi: true,
};

let nextId = 0;

@Component({
	selector: 'hlm-date-picker-multi',
	imports: [HlmIconImports, BrnPopoverImports, HlmPopoverImports, HlmCalendarMulti],
	providers: [HLM_DATE_PICKER_MUTLI_VALUE_ACCESSOR, provideIcons({ lucideChevronDown })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	template: `
		<hlm-popover sideOffset="5" [state]="_popoverState()" (stateChanged)="_popoverState.set($event)">
			<button
				[id]="buttonId()"
				type="button"
				[class]="_computedClass()"
				[disabled]="_mutableDisabled()"
				hlmPopoverTrigger
			>
				<span class="truncate">
					@if (_formattedDate(); as formattedDate) {
						{{ formattedDate }}
					} @else {
						<ng-content />
					}
				</span>

				<ng-icon hlm size="sm" name="lucideChevronDown" />
			</button>

			<div hlmPopoverContent class="w-auto p-0" *brnPopoverContent="let ctx">
				<hlm-calendar-multi
					calendarClass="border-0 rounded-none"
					[date]="_mutableDate()"
					[captionLayout]="captionLayout()"
					[min]="min()"
					[max]="max()"
					[minSelection]="minSelection()"
					[maxSelection]="maxSelection()"
					[disabled]="_mutableDisabled()"
					(dateChange)="_handleChange($event)"
				/>
			</div>
		</hlm-popover>
	`,
})
export class HlmDatePickerMulti<T> implements ControlValueAccessor {
	private readonly _config = injectHlmDatePickerMultiConfig<T>();

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'ring-offset-background border-input bg-background hover:bg-accent dark:bg-input/30 dark:hover:bg-input/50 hover:text-accent-foreground inline-flex h-9 w-[280px] cursor-default items-center justify-between gap-2 rounded-md border px-3 py-2 text-left text-sm font-normal whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50',
			'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
			'disabled:pointer-events-none disabled:opacity-50',
			'[&_ng-icon]:pointer-events-none [&_ng-icon]:shrink-0',
			this.userClass(),
		),
	);

	/** The id of the button that opens the date picker. */
	public readonly buttonId = input<string>(`hlm-date-picker-multi-${++nextId}`);

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

	protected readonly _mutableDisabled = linkedSignal(this.disabled);

	protected readonly _formattedDate = computed(() => {
		const dates = this._mutableDate();
		return dates ? this.formatDates()(dates) : undefined;
	});

	public readonly dateChange = output<T[]>();

	protected _onChange?: ChangeFn<T[]>;
	protected _onTouched?: TouchFn;

	protected _handleChange(value: T[] | undefined) {
		if (value === undefined) return;

		if (this._mutableDisabled()) return;
		const transformedDate = this.transformDates()(value);

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
		this._mutableDisabled.set(isDisabled);
	}

	public open() {
		this._popoverState.set('open');
	}

	public close() {
		this._popoverState.set('closed');
	}
}
