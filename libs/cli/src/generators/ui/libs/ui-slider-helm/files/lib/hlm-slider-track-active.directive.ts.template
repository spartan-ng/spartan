import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmSliderTrackActive]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmSliderTrackActiveDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm(
			'h-full w-full relative -top-2 pointer-events-none overflow-hidden rounded-full transition-all',
			this.userClass(),
		),
	);
}
