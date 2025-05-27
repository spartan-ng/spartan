import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';

export const hlmCode = 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold';

@Directive({
	selector: '[hlmCode]',
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmCodeDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() => hlm(hlmCode, this.userClass()));
}
