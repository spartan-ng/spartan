import { BooleanInput } from '@angular/cdk/coercion';
import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	forwardRef,
	input,
	model,
	output,
	signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/brain/core';
import { BrnDialogState } from '@spartan-ng/brain/dialog';
import { type ChangeFn, type TouchFn } from '@spartan-ng/brain/forms';
import { BrnPopover, BrnPopoverContent, BrnPopoverTrigger } from '@spartan-ng/brain/popover';
import { HlmCalendar } from '@spartan-ng/helm/calendar';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmPopoverContent } from '@spartan-ng/helm/popover';
import type { ClassValue } from 'clsx';
import { injectHlmDatePickerConfig } from './hlm-date-picker.token';

export const HLM_DATE_PICKER_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => HlmDatePicker),
	multi: true,
};

@Component({
	selector: 'hlm-date-picker',
	imports: [NgIcon, HlmIcon, BrnPopover, BrnPopoverTrigger, BrnPopoverContent, HlmPopoverContent, HlmCalendar],
	providers: [HLM_DATE_PICKER_VALUE_ACCESSOR, provideIcons({ lucideChevronDown })],
	template: `
		<brn-popover sideOffset="5" [state]="_popoverState()" (stateChanged)="_popoverState.set($event)">
			<button type="button" [class]="_computedClass()" [disabled]="_state().disabled()" brnPopoverTrigger>
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
				<hlm-calendar
					calendarClass="border-0 rounded-none"
					[date]="date()"
					[min]="min()"
					[max]="max()"
					[disabled]="_state().disabled()"
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
export class HlmDatePicker<T> implements ControlValueAccessor {
	private readonly _config = injectHlmDatePickerConfig<T>();

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm transition-all disabled:pointer-events-none disabled:opacity-50 ring-offset-background transition-colors border border-input bg-background hover:bg-accent dark:bg-input/30 dark:hover:bg-input/50 hover:text-accent-foreground h-9 px-3 py-2 w-[280px] justify-start text-left font-normal cursor-default justify-between',
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

	/** Determine if the date picker is disabled. */
	public readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** The selected value. */
	public readonly date = model<T>();

	/** If true, the date picker will close when a date is selected. */
	public readonly autoCloseOnSelect = input<boolean, BooleanInput>(this._config.autoCloseOnSelect, {
		transform: booleanAttribute,
	});

	/** Defines how the date should be displayed in the UI.  */
	public readonly formatDate = input<(date: T) => string>(this._config.formatDate);

	/** Defines how the date should be transformed before saving to model/form. */
	public readonly transformDate = input<(date: T) => T>(this._config.transformDate);

	protected readonly _popoverState = signal<BrnDialogState | null>(null);

	protected readonly _state = computed(() => ({
		disabled: signal(this.disabled()),
	}));

	protected readonly _formattedDate = computed(() => {
		const date = this.date();
		return date ? this.formatDate()(date) : undefined;
	});

	public readonly changed = output<T>();

	protected _onChange?: ChangeFn<T>;
	protected _onTouched?: TouchFn;

	protected _handleChange(value: T) {
		if (this._state().disabled()) return;
		const transformedDate = this.transformDate()(value);

		this.date.set(transformedDate);
		this._onChange?.(transformedDate);
		this.changed.emit(transformedDate);

		if (this.autoCloseOnSelect()) {
			this._popoverState.set('closed');
		}
	}

	/** CONROL VALUE ACCESSOR */
	writeValue(value: T | null): void {
		// optional FormControl is initialized with null value
		if (value === null) return;

		this.date.set(this.transformDate()(value));
	}

	registerOnChange(fn: ChangeFn<T>): void {
		this._onChange = fn;
	}

	registerOnTouched(fn: TouchFn): void {
		this._onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this._state().disabled.set(isDisabled);
	}

	open() {
		this._popoverState.set('open');
	}

	close() {
		this._popoverState.set('closed');
	}
}
