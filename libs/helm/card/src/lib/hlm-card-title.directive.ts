import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

export const cardTitleVariants = cva('text-lg font-semibold leading-none tracking-tight', {
	variants: {},
	defaultVariants: {},
});
export type CardTitleVariants = VariantProps<typeof cardTitleVariants>;

@Directive({
	selector: '[hlmCardTitle]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmCardTitleDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() => hlm(cardTitleVariants(), this.userClass()));
}
