import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendar, lucideX } from '@ng-icons/lucide';
import {
	BrnDateInput,
	type BrnDatePickerTriggerBase,
	provideBrnDatePickerTrigger,
} from '@spartan-ng/brain/date-picker';
import { HlmInputGroup, HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { injectHlmDateRangePickerConfig } from './hlm-date-range-picker.token';

@Component({
	selector: 'hlm-date-range-input',
	imports: [HlmInputGroupImports, NgIcon],
	providers: [provideIcons({ lucideCalendar, lucideX }), provideBrnDatePickerTrigger(HlmDateRangeInput)],
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
export class HlmDateRangeInput<T> extends BrnDateInput<[T, T]> implements BrnDatePickerTriggerBase {
	private readonly _config = injectHlmDateRangePickerConfig<T>();

	/**
	 * Parses input text into a date range. Return `null` for invalid
	 * input - the picker's range is cleared while the text is preserved so
	 * the user can fix it.
	 *
	 * Defaults to `parseDate` from `HlmDateRangePickerConfig`.
	 */
	public readonly parseDate = input<(value: string) => [T, T] | null>(this._config.parseDate);

	/**
	 * Formats the current range into the input/edit format shown while the
	 * input is focused. On blur the picker's display format is restored.
	 *
	 * Defaults to `formatInputDates` from `HlmDateRangePickerConfig`.
	 */
	public readonly formatInputDates = input<(dates: [T | null, T | null]) => string>(this._config.formatInputDates);

	protected override parseValue(value: string): [T, T] | null {
		return this.parseDate()(value);
	}

	protected override formatInputValue(value: [T, T]): string {
		return this.formatInputDates()(value);
	}
}
