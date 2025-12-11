import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmSkeleton],hlm-skeleton',
	host: {
		'data-slot': 'skeleton',
		'[class]': '_computedClass()',
	},
})
export class HlmSkeleton {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('bg-accent block rounded-md motion-safe:animate-pulse', this.userClass()),
	);
}
