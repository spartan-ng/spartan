import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmItemTitle],hlm-item-title',
	host: {
		'data-slot': 'item-title',
		'[class]': '_computedClass()',
	},
})
export class HlmItemTitle {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('flex w-fit items-center gap-2 text-sm leading-snug font-medium', this.userClass()),
	);
}
