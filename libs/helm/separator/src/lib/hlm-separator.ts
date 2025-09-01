import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

export type HlmSeparatorOrientation = 'horizontal' | 'vertical';
@Directive({
	selector: '[hlmSeparator],brn-separator[hlm]',
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmSeparator {
	public readonly orientation = input<HlmSeparatorOrientation>('horizontal');
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm(
			'bg-border inline-flex shrink-0 border-0',
			this.orientation() === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
			this.userClass(),
		),
	);
}
