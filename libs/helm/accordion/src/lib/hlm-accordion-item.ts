import { Directive, computed, input } from '@angular/core';
import { BrnAccordionItem } from '@spartan-ng/brain/accordion';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmAccordionItem],brn-accordion-item[hlm],hlm-accordion-item',
	host: {
		'[class]': '_computedClass()',
	},
	hostDirectives: [
		{
			directive: BrnAccordionItem,
			inputs: ['isOpened'],
			outputs: ['openedChange'],
		},
	],
})
export class HlmAccordionItem {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('border-border flex flex-1 flex-col border-b', this.userClass()),
	);
}
