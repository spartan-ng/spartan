import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

export const paginationVariants = cva('mx-auto flex w-full justify-center', {
	variants: {},
	defaultVariants: {},
});
export type PaginationVariants = VariantProps<typeof paginationVariants>;

@Directive({
	selector: '[hlmPagination]',
	host: {
		role: 'navigation',
		'[class]': '_computedClass()',
		'[attr.aria-label]': 'ariaLabel()',
	},
})
export class HlmPagination {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	/** The aria-label for the pagination component. */
	public readonly ariaLabel = input<string>('pagination', { alias: 'aria-label' });

	protected readonly _computedClass = computed(() => hlm(paginationVariants(), this.userClass()));
}
