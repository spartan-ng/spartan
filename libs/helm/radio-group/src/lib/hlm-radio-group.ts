import { computed, Directive, inject, input } from '@angular/core';
import { BrnRadioGroup } from '@spartan-ng/brain/radio-group';
import { HlmFieldControlDescribedBy } from '@spartan-ng/helm/field';
import { classes } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmRadioGroup],hlm-radio-group',
	hostDirectives: [
		{
			directive: BrnRadioGroup,
			inputs: ['name', 'value', 'disabled', 'required'],
			outputs: ['valueChange'],
		},
		HlmFieldControlDescribedBy,
	],
	host: {
		'data-slot': 'radio-group',
		'[attr.data-invalid]': '_errorState() ? "true" : null',
		'[attr.aria-invalid]': '_errorState() ? "true" : null',
	},
})
export class HlmRadioGroup {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	private readonly _brnRadioGroup = inject(BrnRadioGroup);
	protected readonly _errorState = computed(() => this._brnRadioGroup.errorState());

	constructor() {
		classes(() => ['grid gap-3', this.userClass(), this._errorState() ? 'data-[invalid=true]:text-destructive' : '']);
	}
}
