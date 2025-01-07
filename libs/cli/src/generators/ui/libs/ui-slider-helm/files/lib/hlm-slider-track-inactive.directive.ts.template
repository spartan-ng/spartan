import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmSliderTrackInactive]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmSliderTrackInactiveDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm('w-full h-full bg-secondary rounded-full transition-all', this.userClass()),
	);
}
