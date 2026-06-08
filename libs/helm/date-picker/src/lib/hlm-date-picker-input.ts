import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, linkedSignal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendar, lucideX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmDatePickerAnchor } from './hlm-date-picker-anchor';
import { HlmDatePickerTriggerBase, provideHlmDatePickerTrigger } from './hlm-date-picker-trigger.token';
import { injectHlmDatePicker, injectHlmDatePickerConfig } from './hlm-date-picker.token';

@Component({
	selector: 'hlm-date-picker-input',
	imports: [HlmInputGroupImports, HlmButtonImports, HlmDatePickerAnchor, NgIcon],
	providers: [provideIcons({ lucideCalendar, lucideX }), provideHlmDatePickerTrigger(HlmDatePickerInput)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-input-group hlmDatePickerAnchor [hlmDatePickerAnchorFor]="_popover()">
			<input
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
				(blur)="_commitDate()"
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
		</hlm-input-group>
	`,
})
export class HlmDatePickerInput implements HlmDatePickerTriggerBase {
	private static _nextId = 0;
	private readonly _datePicker = injectHlmDatePicker();
	private readonly _config = injectHlmDatePickerConfig<unknown>();

	protected readonly _popover = this._datePicker.popover;
	protected readonly _disabled = this._datePicker.disabledState;

	public readonly inputId = input(`hlm-date-picker-input-${HlmDatePickerInput._nextId++}`);

	public readonly placeholder = input('');

	public readonly inputValue = input<string>('');

	/**
	 * Parses a string from the input into a date value. Return `undefined`
	 * when the string cannot be parsed - in that case the date picker's
	 * selected date is left unchanged on commit.
	 *
	 * Defaults to the `parseDate` from `HlmDatePickerConfig`. Override this
	 * input to use a different parser for a specific instance.
	 */
	public readonly parseDate = input<(value: string) => unknown | undefined>(this._config.parseDate);

	public readonly forceInvalid = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	/** Show a clear button that resets both the input text and the picker's date. Hidden when empty. */
	public readonly showClear = input<boolean, BooleanInput>(true, { transform: booleanAttribute });

	/** Open the calendar popover when the user clicks the input. */
	public readonly openOnClick = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	/** Accessible label for the clear button. */
	public readonly clearAriaLabel = input<string>('Clear date');

	/** Accessible label for the calendar trigger button. */
	public readonly calendarAriaLabel = input<string>('Open calendar');

	/** @internal The id of the input that focuses the input, used for labeling. */
	public readonly triggerId = this.inputId;

	/**
	 * Holds the text shown in the input. Stays in sync with the picker's
	 * `formattedDate` and the parent's `inputValue` reactively, and accepts
	 * user writes via `_handleInputChange` while typing.
	 *
	 * No focus tracking is needed because commits to the picker only happen
	 * on blur / Enter - so `formattedDate` doesn't change mid-keystroke and
	 * the user's in-progress text isn't overwritten.
	 */
	protected readonly _inputValue = linkedSignal<{ formatted: string | undefined; inputValue: string }, string>({
		source: () => ({
			formatted: this._datePicker.formattedDate(),
			inputValue: this.inputValue(),
		}),
		computation: (source, previous) => {
			// First render: prefer the picker's formatted date if available,
			// otherwise fall back to the parent-provided inputValue.
			if (previous === undefined) {
				return source.formatted ?? source.inputValue;
			}

			// If the picker's formatted date changed (e.g. the user picked a
			// date from the calendar, the form value was set, or we just
			// committed parsed input on blur/Enter) reflect it - this is what
			// snaps the field to the canonical format after commit.
			if (source.formatted !== previous.source.formatted) {
				return source.formatted ?? '';
			}

			// If the parent changed inputValue, reflect that. Behaves as a
			// controlled prop without overriding the picker's selection on
			// every reactive tick.
			if (source.inputValue !== previous.source.inputValue) {
				return source.inputValue;
			}

			return previous.value;
		},
	});

	protected _handleInputChange(event: Event) {
		const text = (event.target as HTMLInputElement).value;
		this._inputValue.set(text);
	}

	protected readonly _showClearButton = computed(() => this.showClear() && this._inputValue().length > 0);

	protected _clear() {
		this._inputValue.set('');
		this._datePicker.updateDate?.(undefined);
		this._datePicker.touched?.();
	}

	protected _handleEnter(event: Event) {
		event.preventDefault();
		this._commitDate();
		this._popover().close();
	}

	protected _commitDate() {
		const value = this._inputValue();

		if (!value) {
			this._datePicker.updateDate?.(undefined);
			this._datePicker.touched?.();
			return;
		}

		const parsed = this.parseDate()(value);
		if (parsed !== null && parsed !== undefined) {
			this._datePicker.updateDate?.(parsed);
		}

		this._datePicker.touched?.();
	}

	protected _open() {
		this._popover().open();
	}

	protected _handleClick() {
		if (this.openOnClick()) {
			this._open();
		}
	}
}
