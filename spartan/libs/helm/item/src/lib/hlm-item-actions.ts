import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmItemActions],hlm-item-actions',
	host: {
		'data-slot': 'item-actions',
		'[class]': '_computedClass()',
	},
})
export class HlmItemActions {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('flex items-center gap-2', this.userClass()));
}
