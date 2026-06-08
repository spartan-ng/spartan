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
export class HlmDatePickerInput<T> implements HlmDatePickerTriggerBase {
	private static _nextId = 0;
	private readonly _datePicker = injectHlmDatePicker<T>();
	private readonly _config = injectHlmDatePickerConfig<T>();

	protected readonly _popover = this._datePicker.popover;
	protected readonly _disabled = this._datePicker.disabledState;

	public readonly inputId = input(`hlm-date-picker-input-${HlmDatePickerInput._nextId++}`);

	public readonly placeholder = input('');

	public readonly inputValue = input<string>('');

	/**
	 * Parses input text into a date value. Return `undefined` for invalid
	 * input - the picker's date is cleared while the text is preserved so
	 * the user can fix it.
	 *
	 * Defaults to `parseDate` from `HlmDatePickerConfig`.
	 */
	public readonly parseDate = input<(value: string) => T | undefined>(this._config.parseDate);

	public readonly forceInvalid = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	/** Show a clear button that resets the input and picker date. Hidden when empty. */
	public readonly showClear = input<boolean, BooleanInput>(true, { transform: booleanAttribute });

	/** Open the popover on input click. */
	public readonly openOnClick = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	/** Accessible label for the clear button. */
	public readonly clearAriaLabel = input<string>('Clear date');

	/** Accessible label for the calendar trigger button. */
	public readonly calendarAriaLabel = input<string>('Open calendar');

	/** @internal Id used by the trigger contract for labeling. */
	public readonly triggerId = this.inputId;

	/**
	 * Text shown in the input. Mirrors the picker's `formattedDate` and the
	 * parent's `inputValue`, and accepts user writes via `_handleInputChange`.
	 * Commits only happen on blur / Enter, so in-progress text isn't clobbered.
	 */
	protected readonly _inputValue = linkedSignal<{ formatted: string | undefined; inputValue: string }, string>({
		source: () => ({
			formatted: this._datePicker.formattedDate(),
			inputValue: this.inputValue(),
		}),
		computation: (source, previous) => {
			// First render: prefer formatted, fall back to inputValue.
			if (previous === undefined) {
				return source.formatted ?? source.inputValue;
			}

			// Picker's formatted date changed - snap to canonical format.
			if (source.formatted !== previous.source.formatted) {
				if (source.formatted !== undefined) {
					return source.formatted;
				}
				// Cleared externally vs. user has invalid text in flight: only
				// mirror the clear when the displayed text was in sync.
				return previous.value === previous.source.formatted ? '' : previous.value;
			}

			// Parent updated inputValue - reflect it.
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

		// Invalid parse: clear the picker date, keep the text so the user can fix it.
		const parsed = this.parseDate()(value);
		this._datePicker.updateDate?.(parsed ?? undefined);
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
