import { Component, computed, input } from '@angular/core';
import { BrnRadioGroupDirective } from '@spartan-ng/brain/radio-group';
import { hlm } from '@spartan-ng/ui-core';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-radio-group',
	standalone: true,
	hostDirectives: [
		{
			directive: BrnRadioGroupDirective,
			inputs: ['name', 'value', 'disabled', 'required', 'direction'],
		},
	],
	host: {
		'[class]': '_computedClass()',
	},
	template: '<ng-content />',
})
export class HlmRadioGroupComponent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() => hlm('grid gap-2', this.userClass()));
}
