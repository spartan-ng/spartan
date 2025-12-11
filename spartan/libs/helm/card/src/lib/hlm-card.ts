import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

export const cardVariants = cva('bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm', {
	variants: {},
	defaultVariants: {},
});
export type CardVariants = VariantProps<typeof cardVariants>;

@Directive({
	selector: '[hlmCard]',
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmCard {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm(cardVariants(), this.userClass()));
}
