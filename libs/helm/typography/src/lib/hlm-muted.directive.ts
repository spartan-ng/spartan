import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';

export const hlmMuted = 'text-sm text-muted-foreground';

@Directive({
	selector: '[hlmMuted]',
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmMutedDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() => hlm(hlmMuted, this.userClass()));
}
