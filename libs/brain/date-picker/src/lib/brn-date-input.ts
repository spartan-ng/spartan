import { BooleanInput } from '@angular/cdk/coercion';
import { DOCUMENT } from '@angular/common';
import {
	afterEveryRender,
	booleanAttribute,
	computed,
	Directive,
	effect,
	ElementRef,
	inject,
	input,
	linkedSignal,
	viewChild,
} from '@angular/core';
import { injectBrnDatePicker } from './brn-date-picker.token';

/**
 * Headless behavior shared by every date picker text input (single, multi,
 * range, month-year). Owns the editable text mirror, cursor preservation and
 * the commit/parse lifecycle; styled subclasses provide the template, styling
 * and the parse/format strategy.
 *
 * `V` is the value type held by the associated date picker (e.g. `Date`,
 * `Date[]` or `[Date, Date]`).
 */
@Directive()
export abstract class BrnDateInput<V> {
	private static _nextId = 0;

	public readonly inputId = input<string>(`hlm-date-picker-input-${BrnDateInput._nextId++}`);

	private readonly _document = inject(DOCUMENT);
	private readonly _host = inject(ElementRef);
	private readonly _inputElement = viewChild.required<ElementRef<HTMLInputElement>>('input');
	private _pendingSelection: { start: number | null; end: number | null } | null = null;
	protected readonly _datePicker = injectBrnDatePicker<V>();

	protected readonly _popover = this._datePicker.popover;
	protected readonly _disabled = this._datePicker.disabledState;

	/** Initial text shown in the input. Mirrored by the picker once a date is committed. */
	public readonly inputValue = input<string>('');

	/** Show a clear button that resets the input and picker value. Hidden when empty. */
	public readonly showClear = input<boolean, BooleanInput>(true, { transform: booleanAttribute });

	/** Open the popover on input click. */
	public readonly openOnClick = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	/** Forces the invalid state visually, regardless of form control state. */
	public readonly forceInvalid = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	/** Accessible label for the clear button. */
	public readonly clearAriaLabel = input<string>('Clear date');

	/** Accessible label for the calendar trigger button. */
	public readonly calendarAriaLabel = input<string>('Open calendar');

	/** @internal Id used by the trigger contract for labeling. */
	public readonly triggerId = computed(() => this.inputId());

	public readonly placeholder = input<string>('');

	/**
	 * Parse user-entered text into the picker value. Return `null` for
	 * invalid input - the picker's value is cleared while the text is preserved
	 * so the user can fix it.
	 */
	protected abstract parseValue(value: string): V | null;

	/**
	 * Format the committed value into the input/edit format shown while the
	 * input is focused. On blur the picker's display format is restored.
	 */
	protected abstract formatInputValue(value: V): string;

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

	protected readonly _showClearButton = computed(() => this.showClear() && this._inputValue().length > 0);

	constructor() {
		effect(() => this._popover()?.setOrigin(this._host.nativeElement));

		// Re-applying `[value]` on each keystroke moves the caret to the end. Restore the caret to
		// where the user was typing after Angular has written the value back to the DOM.
		afterEveryRender(() => {
			const selection = this._pendingSelection;
			if (!selection) return;
			this._pendingSelection = null;

			const element = this._inputElement().nativeElement;
			if (this._document.activeElement === element && selection.start !== null && selection.end !== null) {
				element.setSelectionRange(selection.start, selection.end);
			}
		});
	}

	protected _handleInputChange(event: Event) {
		const target = event.target as HTMLInputElement;
		this._pendingSelection = { start: target.selectionStart, end: target.selectionEnd };
		this._inputValue.set(target.value);
	}

	protected _clear() {
		this._inputValue.set('');
		this._datePicker.updateDate?.(null);
		this._datePicker.touched?.();
	}

	protected _handleEnter(event: Event) {
		event.preventDefault();
		this._commitDate();
		this._popover().close();
		// The field keeps focus after Enter, so restore the edit format the
		// commit snapped away from - otherwise a later blur would re-parse the
		// display format and clear the value.
		this._handleFocus();
	}

	/** On focus, reformat the committed value into the input/edit format. */
	protected _handleFocus() {
		const value = this._datePicker.value?.();
		if (value != null) {
			this._inputValue.set(this.formatInputValue(value));
		}
	}

	/** On blur, commit the input and snap back to the picker's display format. */
	protected _handleBlur() {
		this._commitDate();
		const formatted = this._datePicker.formattedDate();
		if (formatted !== undefined) {
			this._inputValue.set(formatted);
		}
	}

	protected _commitDate() {
		const value = this._inputValue();

		if (!value) {
			this._datePicker.updateDate?.(null);
			this._datePicker.touched?.();
			return;
		}

		// Invalid parse: clear the picker value, keep the text so the user can fix it.
		const parsed = this.parseValue(value);
		this._datePicker.updateDate?.(parsed);
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
