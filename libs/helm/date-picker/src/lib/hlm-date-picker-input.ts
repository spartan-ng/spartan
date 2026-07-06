import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendar, lucideX } from '@ng-icons/lucide';
import {
	BrnDateInput,
	type BrnDatePickerTriggerBase,
	provideBrnDatePickerTrigger,
} from '@spartan-ng/brain/date-picker';
import { HlmInputGroup, HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { injectHlmDatePickerConfig } from './hlm-date-picker.token';

@Component({
	selector: 'hlm-date-picker-input',
	imports: [HlmInputGroupImports, NgIcon],
	providers: [provideIcons({ lucideCalendar, lucideX }), provideBrnDatePickerTrigger(HlmDatePickerInput)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [HlmInputGroup],
	template: `
		<input
			#input
			hlmInputGroupInput
			[value]="_inputValue()"
			[id]="inputId()"
			[placeholder]="placeholder()"
			[disabled]="_disabled()"
			[forceInvalid]="forceInvalid()"
			(click)="_handleClick()"
			(keydown.arrowDown)="_open()"
			(keydown.enter)="_handleEnter($event)"
			(input)="_handleInputChange($event)"
			(focus)="_handleFocus()"
			(blur)="_handleBlur()"
		/>
		<hlm-input-group-addon align="inline-end">
			@if (_showClearButton()) {
				<button
					hlmInputGroupButton
					size="icon-xs"
					variant="ghost"
					[attr.aria-label]="clearAriaLabel()"
					(click)="_clear()"
					[disabled]="_disabled()"
				>
					<ng-icon name="lucideX" />
				</button>
			}
			<button
				hlmInputGroupButton
				size="icon-xs"
				[attr.aria-label]="calendarAriaLabel()"
				(click)="_popover().open()"
				[disabled]="_disabled()"
			>
				<ng-icon name="lucideCalendar" />
			</button>
		</hlm-input-group-addon>
	`,
})
export class HlmDatePickerInput<T> extends BrnDateInput<T> implements BrnDatePickerTriggerBase {
	private static _nextId = 0;
	private readonly _config = injectHlmDatePickerConfig<T>();

	public readonly inputId = input(`hlm-date-picker-input-${HlmDatePickerInput._nextId++}`);

	public readonly placeholder = input('');

	/**
	 * Parses input text into a date value. Return `undefined` for invalid
	 * input - the picker's date is cleared while the text is preserved so
	 * the user can fix it.
	 *
	 * Defaults to `parseDate` from `HlmDatePickerConfig`.
	 */
	public readonly parseDate = input<(value: string) => T | undefined>(this._config.parseDate);

	/**
	 * Formats the current date into the input/edit format shown while the
	 * input is focused. On blur the picker's display format is restored.
	 *
	 * Defaults to `formatInputDate` from `HlmDatePickerConfig`.
	 */
	public readonly formatInputDate = input<(date: T) => string>(this._config.formatInputDate);

	public readonly forceInvalid = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	/** Accessible label for the clear button. */
	public readonly clearAriaLabel = input<string>('Clear date');

	/** Accessible label for the calendar trigger button. */
	public readonly calendarAriaLabel = input<string>('Open calendar');

	/** @internal Id used by the trigger contract for labeling. */
	public readonly triggerId = this.inputId;

	protected parseValue(value: string): T | undefined {
		return this.parseDate()(value);
	}

	protected formatInputValue(value: T): string {
		return this.formatInputDate()(value);
	}
}
