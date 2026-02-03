import type { BooleanInput } from '@angular/cdk/coercion';
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
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import type { BrnDialogState } from '@spartan-ng/brain/dialog';
import type { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCalendar } from '@spartan-ng/helm/calendar';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';
import { injectDatePickerWithButtonConfig } from './date-picker-with-button.token';

export const HLM_DATE_PICKER_CLEAR_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => DatePickerWithButton),
	multi: true,
};

let nextId = 0;

@Component({
	selector: 'spartan-date-picker-with-button',
	imports: [NgIcon, HlmIcon, HlmPopoverImports, HlmCalendar, HlmButton],
	providers: [provideIcons({ lucideChevronDown })],
	changeDetection: ChangeDetectionStrategy.OnPush,
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

			<hlm-popover-content class="w-auto p-0" *hlmPopoverPortal="let ctx">
				<hlm-calendar
					calendarClass="border-0 rounded-none"
					[captionLayout]="captionLayout()"
					[date]="_mutableDate()"
					[min]="min()"
					[max]="max()"
					[disabled]="_mutableDisabled()"
					(dateChange)="_handleChange($event)"
				/>

				<div class="flex justify-end gap-2 p-2">
					<button hlmBtn (click)="close()" class="hover:cursor-pointer">Submit</button>
					<button hlmBtn (click)="onReset()" class="hover:cursor-pointer">Clear</button>
				</div>
			</hlm-popover-content>
		</hlm-popover>
	`,
})
export class DatePickerWithButton<T> {
	private readonly _config = injectDatePickerWithButtonConfig<T>();

	public readonly userClass = input<ClassValue>('');
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
	public readonly buttonId = input<string>(`date-picker-clear-${++nextId}`);

	/** Show dropdowns to navigate between months or years. */
	public readonly captionLayout = input<'dropdown' | 'label' | 'dropdown-months' | 'dropdown-years'>('label');

	/** The minimum date that can be selected.*/
	public readonly min = input<T>();

	/** The maximum date that can be selected. */
	public readonly max = input<T>();

	protected readonly _popoverState = signal<BrnDialogState | null>(null);

	/** Determine if the date picker is disabled. */
	public readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	protected readonly _mutableDisabled = linkedSignal(this.disabled);

	/** The selected value. */
	public readonly date = input<T>();

	protected readonly _mutableDate = linkedSignal(this.date);

	/** If true, the date picker will close when a date is selected. */
	public readonly autoCloseOnSelect = input<boolean, BooleanInput>(this._config.autoCloseOnSelect, {
		transform: booleanAttribute,
	});

	/** Defines how the date should be displayed in the UI. */
	public readonly formatDate = input<(date: T) => string>(this._config.formatDate);

	/** Defines how the date should be transformed before saving to model/form. */
	public readonly transformDate = input<(date: T) => T>(this._config.transformDate);

	protected readonly _formattedDate = computed(() => {
		const date = this._mutableDate();
		return date ? this.formatDate()(date) : undefined;
	});

	onReset() {
		this._mutableDate.set(undefined);
		this._onChange?.(undefined as T);
		this.dateChange.emit(undefined as T);
	}

	public readonly dateChange = output<T>();

	protected _onChange?: ChangeFn<T>;
	protected _onTouched?: TouchFn;

	protected _handleChange(value: T) {
		if (this._mutableDisabled()) return;
		const transformedDate = value !== undefined ? this.transformDate()(value) : value;

		this._mutableDate.set(transformedDate);
		this._onChange?.(transformedDate);
		this.dateChange.emit(transformedDate);

		if (this.autoCloseOnSelect()) {
			this._popoverState.set('closed');
		}
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
