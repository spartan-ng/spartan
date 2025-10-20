import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'kbd[hlmKbdGroup]',
	host: {
		'[class]': '_computedClass()',
		'data-slot': 'kbd-group',
	},
})
export class HlmKbdGroup {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('inline-flex items-center gap-1', this.userClass()));
}
