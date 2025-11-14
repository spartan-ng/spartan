import { Directive, computed, input } from '@angular/core';
import { BrnAccordionTrigger } from '@spartan-ng/brain/accordion';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmAccordionTrigger]',
	hostDirectives: [BrnAccordionTrigger],
	host: {
		'[style.--tw-ring-offset-shadow]': '"0 0 #000"',
		'[class]': '_computedClass()',
	},
})
export class HlmAccordionTrigger {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>[hlmAccIcon]]:rotate-180',
			this.userClass(),
		),
	);
}
