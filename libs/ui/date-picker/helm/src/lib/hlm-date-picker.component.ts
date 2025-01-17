import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, Component, computed, forwardRef, input, model, output, signal } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendar } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/brain/core';
import { type ChangeFn, type TouchFn } from '@spartan-ng/brain/forms';
import { BrnPopoverComponent, BrnPopoverContentDirective, BrnPopoverTriggerDirective } from '@spartan-ng/brain/popover';
import { HlmCalendarComponent } from '@spartan-ng/ui-calendar-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmPopoverContentDirective } from '@spartan-ng/ui-popover-helm';
import type { ClassValue } from 'clsx';

export const HLM_DATE_PICKER_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => HlmDatePickerComponent),
	multi: true,
};

// TODO make date picker work with forms
@Component({
	selector: 'hlm-date-picker',
	standalone: true,
	imports: [
		NgIcon,
		HlmIconDirective,
		BrnPopoverComponent,
		BrnPopoverTriggerDirective,
		BrnPopoverContentDirective,
		HlmPopoverContentDirective,
		HlmCalendarComponent,
	],
	providers: [HLM_DATE_PICKER_VALUE_ACCESSOR, provideIcons({ lucideCalendar })],
	template: `
		<brn-popover sideOffset="5" closeDelay="100">
			<button type="button" [class]="_computedClass()" [disabled]="state().disabled()" brnPopoverTrigger>
				<ng-icon hlm size="sm" name="lucideCalendar" />

				@if (formattedDate(); as formattedDate) {
					{{ formattedDate }}
				} @else {
					<ng-content />
				}
			</button>

			<div hlmPopoverContent class="w-auto p-0" *brnPopoverContent="let ctx">
				<hlm-calendar
					[date]="date()"
					[min]="min()"
					[max]="max()"
					[disabled]="state().disabled()"
					(dateChange)="_handleChange($event)"
				/>
			</div>
		</brn-popover>
	`,
	host: {
		class: 'block',
	},
})
export class HlmDatePickerComponent<T> {
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

	/* * The maximum date that can be selected. */
	public readonly max = input<T>();

	/** Determine if the date picker is disabled. */
	public readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** The selected value. */
	public readonly date = model<T>();

	protected readonly state = computed(() => ({
		disabled: signal(this.disabled()),
	}));

	public readonly dateFormat = input<(date: T) => string>((date) =>
		date instanceof Date ? date.toDateString() : `${date}`,
	);

	protected readonly formattedDate = computed(() => {
		const date = this.date();

		if (!date) {
			return undefined;
		}

		return this.dateFormat()(date);
	});

	public readonly changed = output<T>();

	protected _onChange?: ChangeFn<T>;
	protected _onTouched?: TouchFn;

	protected _handleChange(value: T) {
		if (this.state().disabled()) return;

		this.date.set(value);
		this._onChange?.(value);
		this.changed.emit(value);
	}

	/** CONROL VALUE ACCESSOR */
	writeValue(value: T): void {
		this.date.set(value);
	}

	registerOnChange(fn: ChangeFn<T>): void {
		this._onChange = fn;
	}

	registerOnTouched(fn: TouchFn): void {
		this._onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.state().disabled.set(isDisabled);
	}
}
