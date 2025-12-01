import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { BrnRadioGroup } from '@spartan-ng/brain/radio-group';
import { HlmFieldControlDescribedBy } from '@spartan-ng/helm/field';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-radio-group',
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [
		{
			directive: BrnRadioGroup,
			inputs: ['name', 'value', 'disabled', 'required', 'direction'],
			outputs: ['valueChange'],
		},
		HlmFieldControlDescribedBy,
	],
	host: {
		'data-slot': 'radio-group',
		'[class]': '_computedClass()',
		'[attr.data-invalid]': '_errorState() ? "true" : null',
		'[attr.aria-invalid]': '_errorState() ? "true" : null',
	},
	template: '<ng-content />',
})
export class HlmRadioGroup {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	private readonly _brnRadioGroup = inject(BrnRadioGroup);
	protected readonly _errorState = computed(() => this._brnRadioGroup.errorState());
	protected readonly _computedClass = computed(() =>
		hlm('grid gap-3', this.userClass(), this._errorState() ? 'data-[invalid=true]:text-destructive' : ''),
	);
}
