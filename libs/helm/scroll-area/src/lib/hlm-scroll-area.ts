import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'ng-scrollbar[hlm],ng-scrollbar[hlmScrollbar]',
	host: {
		'data-slot': 'scroll-area',
		'[class]': '_computedClass()',
		'[style.--scrollbar-border-radius]': '100 + "px"',
		'[style.--scrollbar-offset]': '3',
		'[style.--scrollbar-thumb-color]': '"var(--border)"',
		'[style.--scrollbar-thumb-hover-color]': '"var(--border)"',
		'[style.--scrollbar-thickness]': '7',
	},
})
export class HlmScrollArea {
	protected readonly _computedClass = computed(() => hlm('block', this.userClass()));
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
}
