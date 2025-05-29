import { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	forwardRef,
	input,
	model,
	numberAttribute,
	output,
	signal,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendar } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/brain/core';
import { BrnDialogState } from '@spartan-ng/brain/dialog';
import { type ChangeFn, type TouchFn } from '@spartan-ng/brain/forms';
import { BrnPopoverComponent, BrnPopoverContentDirective, BrnPopoverTriggerDirective } from '@spartan-ng/brain/popover';
import { HlmCalendarMultiComponent } from '@spartan-ng/helm/calendar';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import { HlmPopoverContentDirective } from '@spartan-ng/helm/popover';
import type { ClassValue } from 'clsx';
import { injectHlmDatePickerMultiConfig } from './hlm-date-picker-multi.token';

export const HLM_DATE_PICKER_MUTLI_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => HlmDatePickerMultiComponent),
	multi: true,
};

@Component({
	selector: 'hlm-date-picker-multi',
	imports: [
		NgIcon,
		HlmIconDirective,
		BrnPopoverComponent,
		BrnPopoverTriggerDirective,
		BrnPopoverContentDirective,
		HlmPopoverContentDirective,
		HlmCalendarMultiComponent,
	],
	providers: [HLM_DATE_PICKER_MUTLI_VALUE_ACCESSOR, provideIcons({ lucideCalendar })],
	template: `
		<brn-popover sideOffset="5" [state]="popoverState()" (stateChanged)="popoverState.set($event)">
			<button type="button" [class]="_computedClass()" [disabled]="state().disabled()" brnPopoverTrigger>
				<ng-icon hlm size="sm" name="lucideCalendar" />

				<span class="truncate">
					@if (formattedDate(); as formattedDate) {
						{{ formattedDate }}
					} @else {
						<ng-content />
					}
				</span>
			</button>

			<div hlmPopoverContent class="w-auto p-0" *brnPopoverContent="let ctx">
				<hlm-calendar-multi
					calendarClass="border-0 rounded-none"
					[date]="date()"
					[min]="min()"
					[max]="max()"
					[minSelection]="minSelection()"
					[maxSelection]="maxSelection()"
					[disabled]="state().disabled()"
					(dateChange)="_handleChange($event)"
				/>
			</div>
		</brn-popover>
	`,
	host: {
		class: 'block',
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmDatePickerMultiComponent<T> {
	private readonly _config = injectHlmDatePickerMultiConfig<T>();

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-[280px] justify-start text-left font-normal',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
			'disabled:pointer-events-none disabled:opacity-50',
			'[&_ng-icon]:pointer-events-none [&_ng-icon]:shrink-0',
			!this.date() ? 'text-muted-foreground' : '',
			this.userClass(),
		),
	);

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
	public readonly date = model<T[]>();

	/** If true, the date picker will close when the max selection of dates is reached.. */
	public readonly autoCloseOnMaxSelection = input<boolean, BooleanInput>(this._config.autoCloseOnMaxSelection, {
		transform: booleanAttribute,
	});

	/** Defines how the date should be displayed in the UI.  */
	public readonly formatDates = input<(date: T[]) => string>(this._config.formatDates);

	/** Defines how the date should be transformed before saving to model/form. */
	public readonly transformDates = input<(date: T[]) => T[]>(this._config.transformDates);

	protected readonly popoverState = signal<BrnDialogState | null>(null);

	protected readonly state = computed(() => ({
		disabled: signal(this.disabled()),
	}));

	protected readonly formattedDate = computed(() => {
		const dates = this.date();
		return dates ? this.formatDates()(dates) : undefined;
	});

	public readonly changed = output<T[]>();

	protected _onChange?: ChangeFn<T[]>;
	protected _onTouched?: TouchFn;

	protected _handleChange(value: T[] | undefined) {
		if (value === undefined) return;

		if (this.state().disabled()) return;
		const transformedDate = this.transformDates()(value);

		this.date.set(transformedDate);
		this._onChange?.(transformedDate);
		this.changed.emit(transformedDate);

		if (this.autoCloseOnMaxSelection() && this.date()?.length === this.maxSelection()) {
			this.popoverState.set('closed');
		}
	}

	/** CONROL VALUE ACCESSOR */
	writeValue(value: T[] | null): void {
		// optional FormControl is initialized with null value
		if (value === null) return;

		this.date.set(this.transformDates()(value));
	}

	registerOnChange(fn: ChangeFn<T[]>): void {
		this._onChange = fn;
	}

	registerOnTouched(fn: TouchFn): void {
		this._onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.state().disabled.set(isDisabled);
	}

	open() {
		this.popoverState.set('open');
	}

	close() {
		this.popoverState.set('closed');
	}
}
