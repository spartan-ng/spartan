import { BooleanInput } from '@angular/cdk/coercion';
import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	forwardRef,
	input,
	linkedSignal,
	output,
	signal,
	untracked,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendar } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/brain/core';
import { BrnDialogState } from '@spartan-ng/brain/dialog';
import { type ChangeFn, type TouchFn } from '@spartan-ng/brain/forms';
import { BrnPopover, BrnPopoverContent, BrnPopoverTrigger } from '@spartan-ng/brain/popover';
import { HlmCalendarRange } from '@spartan-ng/helm/calendar';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmPopoverContent } from '@spartan-ng/helm/popover';
import type { ClassValue } from 'clsx';
import { injectHlmDateRangePickerConfig } from './hlm-date-range-picker.token';

export const HLM_DATE_RANGE_PICKER_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => HlmDateRangePicker),
	multi: true,
};

@Component({
	selector: 'hlm-date-range-picker',
	imports: [NgIcon, HlmIcon, BrnPopover, BrnPopoverTrigger, BrnPopoverContent, HlmPopoverContent, HlmCalendarRange],
	providers: [HLM_DATE_RANGE_PICKER_VALUE_ACCESSOR, provideIcons({ lucideCalendar })],
	template: `
		<brn-popover
			sideOffset="5"
			[state]="_popoverState()"
			(stateChanged)="_popoverState.set($event)"
			(closed)="_onClose()"
		>
			<button type="button" [class]="_computedClass()" [disabled]="_mutableDisabled()" brnPopoverTrigger>
				<ng-icon hlm size="sm" name="lucideCalendar" />

				<span class="truncate">
					@if (_formattedDate(); as formattedDate) {
						{{ formattedDate }}
					} @else {
						<ng-content />
					}
				</span>
			</button>

			<div hlmPopoverContent class="w-auto p-0" *brnPopoverContent="let ctx">
				<hlm-calendar-range
					calendarClass="border-0 rounded-none"
					[startDate]="_start()"
					[endDate]="_end()"
					[min]="min()"
					[max]="max()"
					[disabled]="_mutableDisabled()"
					(startDateChange)="_handleStartDayChange($event)"
					(endDateChange)="_handleEndDateChange($event)"
				/>
			</div>
		</brn-popover>
	`,
	host: {
		class: 'block',
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmDateRangePicker<T> implements ControlValueAccessor {
	private readonly _config = injectHlmDateRangePickerConfig<T>();

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-background transition-all border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-[280px] justify-start text-left font-normal',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
			'disabled:pointer-events-none disabled:opacity-50',
			'[&_ng-icon]:pointer-events-none [&_ng-icon]:shrink-0',
			!this._mutableDate() ? 'text-muted-foreground' : '',
			this.userClass(),
		),
	);

	/** The minimum date that can be selected.*/
	public readonly min = input<T>();

	/** The maximum date that can be selected. */
	public readonly max = input<T>();

	/** Determine if the date picker is disabled. */
	public readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** The selected value. */
	public readonly date = input<[T, T]>();

	protected readonly _mutableDate = linkedSignal(this.date);

	protected readonly _start = linkedSignal(() => this._mutableDate()?.[0]);
	protected readonly _end = linkedSignal(() => this._mutableDate()?.[1]);

	/** If true, the date picker will close when the end date is selected */
	public readonly autoCloseOnEndSelection = input<boolean, BooleanInput>(this._config.autoCloseOnEndSelection, {
		transform: booleanAttribute,
	});

	/** Defines how the date should be displayed in the UI.  */
	public readonly formatDates = input<(dates: [T | undefined, T | undefined]) => string>(this._config.formatDates);

	/** Defines how the date should be transformed before saving to model/form. */
	public readonly transformDates = input<(date: [T, T]) => [T, T]>(this._config.transformDates);

	protected readonly _popoverState = signal<BrnDialogState | null>(null);

	protected readonly _mutableDisabled = linkedSignal(this.disabled);

	protected readonly _formattedDate = computed(() => {
		const start = this._start();
		const end = this._end();
		return start || end ? this.formatDates()([start, end]) : undefined;
	});

	public readonly dateChange = output<[T, T] | null>();

	protected _onChange?: ChangeFn<[T, T] | null>;
	protected _onTouched?: TouchFn;

	protected _handleStartDayChange(value: T) {
		this._start.set(value);
	}

	protected _handleEndDateChange(value: T): void {
		this._end.set(value);
		if (this._mutableDisabled()) return;

		const start = this._start();
		if (start && value) {
			const transformedDates = this.transformDates()([start, value]);
			this._mutableDate.set(transformedDates);
			this.dateChange.emit(transformedDates);
			this._onChange?.(transformedDates);

			if (this.autoCloseOnEndSelection()) {
				this._popoverState.set('closed');
			}
		}
	}

	/** CONTROL VALUE ACCESSOR */
	public writeValue(value: [T, T] | null): void {
		untracked(() => {
			if (!value) {
				this._mutableDate.set(undefined);
			} else {
				this._mutableDate.set(this.transformDates()(value));
			}
		});
	}

	public registerOnChange(fn: ChangeFn<[T, T] | null>): void {
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

	protected _onClose(): void {
		const dates = this._mutableDate();
		if (this._start() && !this._end() && dates) {
			this._start.set(dates[0]);
			this._end.set(dates[1]);
		}
	}
}
