import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

export const inputErrorVariants = cva('text-destructive text-sm font-medium', {
	variants: {},
	defaultVariants: {},
});
export type InputErrorVariants = VariantProps<typeof inputErrorVariants>;

@Directive({
	selector: '[hlmInputError]',
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmInputError {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm(inputErrorVariants(), this.userClass()));
}
