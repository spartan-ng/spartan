import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmItemHeader],hlm-item-header',
	host: {
		'data-slot': 'item-header',
		'[class]': '_computedClass()',
	},
})
export class HlmItemHeader {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('flex basis-full items-center justify-between gap-2', this.userClass()),
	);
}
