import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmCardAction]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmCardActionDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('col-start-2 row-span-2 row-start-1 self-start justify-self-end', this.userClass()),
	);
}
