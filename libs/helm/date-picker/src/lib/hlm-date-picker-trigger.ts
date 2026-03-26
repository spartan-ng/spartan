import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmPopoverTrigger } from '@spartan-ng/helm/popover';
import { hlm } from '@spartan-ng/helm/utils';
import { ClassValue } from 'clsx';
import { injectHlmDatePicker } from './hlm-date-picker.token';

@Component({
	selector: 'hlm-date-picker-trigger',
	imports: [HlmButtonImports, HlmPopoverTrigger, NgIcon],
	providers: [provideIcons({ lucideChevronDown })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'data-slot': 'date-picker-trigger',
	},
	template: `
		<button
			hlmBtn
			variant="outline"
			type="button"
			[id]="buttonId()"
			[attr.data-empty]="!_formattedDate() ? 'true' : null"
			[disabled]="_disabled()"
			[class]="_computedClass()"
			hlmPopoverTrigger
			[hlmPopoverTriggerFor]="_popover()"
		>
			<span class="truncate">
				@if (_formattedDate(); as formattedDate) {
					{{ formattedDate }}
				} @else {
					<ng-content />
				}
			</span>

			<ng-icon name="lucideChevronDown" />
		</button>
	`,
})
export class HlmDatePickerTrigger {
	private static _nextId = 0;
	private readonly _datePicker = injectHlmDatePicker();

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('data-[empty=true]:text-muted-foreground w-[212px] justify-between text-left font-normal', this.userClass()),
	);

	/** The id of the button that opens the date picker. */
	public readonly buttonId = input<string>(`hlm-date-picker-${++HlmDatePickerTrigger._nextId}`);

	protected readonly _popover = this._datePicker.popover;
	protected readonly _disabled = this._datePicker.disabledState;

	protected readonly _formattedDate = this._datePicker.formattedDate;
}
