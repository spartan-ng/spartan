import { Component, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-skeleton',
	standalone: true,
	template: '',
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmSkeletonComponent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() => hlm('block animate-pulse rounded-md bg-muted', this.userClass()));
}
