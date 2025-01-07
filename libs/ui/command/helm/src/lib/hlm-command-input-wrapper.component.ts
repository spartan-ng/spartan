import { Component, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-cmd-input-wrapper',
	standalone: true,
	template: '<ng-content/>',
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmCommandInputWrapperComponent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm('flex space-x-2 items-center border-b border-border px-3 [&_ng-icon]:h-5 [&_ng-icon]:w-5', this.userClass()),
	);
}
