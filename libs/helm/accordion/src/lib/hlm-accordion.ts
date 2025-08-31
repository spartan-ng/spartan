import { Directive, computed, inject, input } from '@angular/core';
import { BrnAccordion } from '@spartan-ng/brain/accordion';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmAccordion], hlm-accordion',
	host: {
		'[class]': '_computedClass()',
	},
	hostDirectives: [{ directive: BrnAccordion, inputs: ['type', 'dir', 'orientation'] }],
})
export class HlmAccordion {
	private readonly _brn = inject(BrnAccordion);

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('flex', this._brn.orientation() === 'horizontal' ? 'flex-row' : 'flex-col', this.userClass()),
	);
}
