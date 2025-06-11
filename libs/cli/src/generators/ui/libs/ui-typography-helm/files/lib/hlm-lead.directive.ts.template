import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';

export const hlmLead = 'text-xl text-muted-foreground';

@Directive({
	selector: '[hlmLead]',
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmLeadDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() => hlm(hlmLead, this.userClass()));
}
