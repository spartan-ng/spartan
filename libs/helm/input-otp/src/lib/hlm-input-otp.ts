import type { BooleanInput } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BrnInputOtp, BrnInputOtpInput, type InputMode } from '@spartan-ng/brain/input-otp';
import { classes, hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'cn';

@Component({
	selector: 'hlm-input-otp',
	exportAs: 'hlmInputOtp',
	imports: [BrnInputOtpInput],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [
		{
			directive: BrnInputOtp,
			inputs: [
				'length',
				'value',
				'disabled',
				'inputId',
				'hostStyles',
				'autofocus',
				'transformPaste',
				'mask',
				'maskChar',
				'slotPattern',
				'forceInvalid',
			],
			outputs: ['valueChange', 'completed'],
		},
	],
	host: {
		'data-slot': 'input-otp',
		'[attr.aria-invalid]': 'null',
		'[attr.aria-describedby]': 'null',
	},
	template: `
		<ng-content />
		<input
			brnInputOtpInput
			[autocomplete]="inputAutocomplete()"
			[inputMode]="inputMode()"
			[class]="_inputClass()"
			[inputStyles]="inputStyles()"
			[aria-invalid]="ariaInvalidInput()"
			[aria-describedby]="ariaDescribedBy()"
		/>
	`,
})
export class HlmInputOtp {
	/** Custom autocomplete attribute applied to the input element */
	public readonly inputAutocomplete = input<'one-time-code' | 'off'>('one-time-code');

	/** Virtual keyboard appearance on mobile */
	public readonly inputMode = input<InputMode>('numeric');

	/** Classes applied to the input element. */
	public readonly inputClass = input<ClassValue>('');

	/** Overrides the default styles applied to the input element. */
	public readonly inputStyles = input<string | undefined>(undefined);

	/** Overrides the invalid state announced for the input. */
	public readonly ariaInvalidInput = input<BooleanInput>(undefined, { alias: 'aria-invalid' });

	/** Additional IDs describing the input. */
	public readonly ariaDescribedBy = input<string | null>(null, { alias: 'aria-describedby' });

	protected readonly _inputClass = computed(() => hlm('disabled:cursor-not-allowed', this.inputClass()));

	constructor() {
		classes(() => 'spartan-input-otp flex items-center has-disabled:opacity-50');
	}
}
