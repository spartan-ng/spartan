import { computed, Directive, input } from '@angular/core';
import { BrnCollapsibleContent } from '@spartan-ng/brain/collapsible';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmCollapsibleContent],hlm-collapsible-content',
	hostDirectives: [{ directive: BrnCollapsibleContent, inputs: ['id'] }],
	host: {
		'data-slot': 'collapsible-content',
		'[class]': '_computedClass()',
	},
})
export class HlmCollapsibleContent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() => hlm('data-[state=closed]:hidden', this.userClass()));
}
