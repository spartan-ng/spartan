import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

export const hlmCode = 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold';

@Directive({
	selector: '[hlmCode]',
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmCode {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm(hlmCode, this.userClass()));
}
