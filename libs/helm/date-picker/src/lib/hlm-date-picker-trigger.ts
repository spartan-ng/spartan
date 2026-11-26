import type { BooleanInput } from '@angular/cdk/coercion';
import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	ElementRef,
	inject,
	input,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import {
	type BrnDatePickerTriggerBase,
	injectBrnDatePicker,
	provideBrnDatePickerTrigger,
} from '@spartan-ng/brain/date-picker';
import { BrnFieldControl, BrnFieldControlDescribedBy } from '@spartan-ng/brain/field';
import { HlmButton, provideBrnButtonConfig } from '@spartan-ng/helm/button';
import { classes } from '@spartan-ng/helm/utils';

@Component({
	selector: 'button[hlm-date-picker-trigger],button[hlmDatePickerTrigger]',
	exportAs: 'hlmDatePickerTrigger',
	imports: [NgIcon],
	providers: [
		provideIcons({ lucideChevronDown }),
		provideBrnDatePickerTrigger(HlmDatePickerTrigger),
		provideBrnButtonConfig({ variant: 'outline' }),
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [
		{ directive: BrnFieldControlDescribedBy, inputs: ['aria-describedby'] },
		{ directive: HlmButton, inputs: ['variant'] },
	],
	host: {
		'data-slot': 'date-picker-trigger',
		type: 'button',
		'aria-haspopup': 'dialog',
		'[id]': 'buttonId()',
		'[disabled]': '_disabled()',
		'[attr.aria-expanded]': '_state() === "open" ? "true" : "false"',
		'[attr.aria-controls]': '_popover().id()',
		'[attr.data-state]': '_state()',
		'[attr.aria-invalid]': '_ariaInvalid()',
		'[attr.data-invalid]': '_ariaInvalid()',
		'[attr.data-touched]': '_touched?.() ? "true" : null',
		'[attr.data-dirty]': '_dirty?.() ? "true" : null',
		'[attr.data-matches-spartan-invalid]': '_spartanInvalid() ? "true" : null',
		'[attr.data-placeholder]': '_isPlaceholder() ? "" : null',
		'(click)': '_toggle()',
	},
	template: `
		<span class="truncate">
			@if (_formattedDate(); as formattedDate) {
				{{ formattedDate }}
			} @else {
				<ng-content />
			}
		</span>

		@if (showTrigger()) {
			<ng-icon name="lucideChevronDown" />
		}
	`,
})
export class HlmDatePickerTrigger implements BrnDatePickerTriggerBase {
	private static _nextId = 0;

	private readonly _host = inject<ElementRef<HTMLButtonElement>>(ElementRef);
	private readonly _fieldControl = inject(BrnFieldControl, { optional: true });
	private readonly _datePicker = injectBrnDatePicker();

	private readonly _invalid = this._fieldControl?.invalid;
	protected readonly _spartanInvalid = computed(() => this.forceInvalid() || this._fieldControl?.spartanInvalid());
	protected readonly _dirty = this._fieldControl?.dirty;
	protected readonly _touched = this._fieldControl?.touched;

	protected readonly _ariaInvalid = computed(() => (this._invalid?.() ? 'true' : null));

	protected readonly _isPlaceholder = computed(() => !this._datePicker.hasDate());

	/** The id of the button that opens the date picker. */
	public readonly buttonId = input<string>(`hlm-date-picker-${++HlmDatePickerTrigger._nextId}`);

	/** @internal The id of the button that opens the date picker, used for labeling. */
	public readonly triggerId = this.buttonId;

	/** Forces the invalid state visually, regardless of form control state. */
	public readonly forceInvalid = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	public readonly showTrigger = input<boolean, BooleanInput>(true, { transform: booleanAttribute });

	protected readonly _popover = this._datePicker.popover;
	protected readonly _state = computed(() => this._popover().stateComputed());
	protected readonly _disabled = this._datePicker.disabledState;
	protected readonly _formattedDate = this._datePicker.formattedDate;

	constructor() {
		classes(() => 'spartan-date-picker-trigger justify-between');
	}

	protected _toggle(): void {
		const popover = this._popover();
		popover.setOrigin(this._host.nativeElement);
		popover.toggle();
	}
}
