import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendar } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmDatePickerAnchor } from './hlm-date-picker-anchor';
import { injectHlmDatePicker } from './hlm-date-picker.token';

@Component({
	selector: 'hlm-date-picker-input',
	imports: [HlmInputGroupImports, HlmButtonImports, HlmDatePickerAnchor, NgIcon],
	providers: [provideIcons({ lucideCalendar })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-input-group hlmDatePickerAnchor [hlmDatePickerAnchorFor]="_popover()">
			<input
				[value]="_value()"
				hlmInputGroupInput
				[id]="inputId()"
				[placeholder]="placeholder()"
				[disabled]="_disabled()"
				(keydown.arrowDown)="_open()"
				(input)="_handleInputChange($event)"
				(blur)="_touched()"
			/>
			<hlm-input-group-addon align="inline-end">
				<button hlmInputGroupButton size="icon-xs" (click)="_popover().open()" [disabled]="_disabled()">
					<ng-icon name="lucideCalendar" />
				</button>
			</hlm-input-group-addon>
		</hlm-input-group>
	`,
})
export class HlmDatePickerInput {
	private readonly _datePicker = injectHlmDatePicker();
	private static _nextId = 0;

	protected readonly _popover = this._datePicker.popover;
	protected readonly _disabled = this._datePicker.disabledState;

	public readonly inputId = input(`hlm-date-picker-input-${HlmDatePickerInput._nextId++}`);

	public readonly placeholder = input('');

	protected readonly _value = computed(() => this._datePicker.formattedDate() ?? '');

	protected _handleInputChange(event: Event) {
		const value = (event.target as HTMLInputElement).value;

		// TODO maybe parse with date adatper from calendar?
		const date = new Date(value);

		if (this._isValidDate(date)) {
			// TODO how to update date picker date value?
		}
	}

	private _isValidDate(date: Date | undefined) {
		if (!date) {
			return false;
		}
		return !isNaN(date.getTime());
	}

	protected _open() {
		this._popover().open();
	}

	protected _touched() {
		this._datePicker.touched?.();
	}
}
