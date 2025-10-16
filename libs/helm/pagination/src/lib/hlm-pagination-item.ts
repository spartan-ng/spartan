import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

export const paginationItemVariants = cva('', {
	variants: {},
	defaultVariants: {},
});

export type PaginationItemVariants = VariantProps<typeof paginationItemVariants>;

@Directive({
	selector: '[hlmPaginationItem]',
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmPaginationItem {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm(paginationItemVariants(), this.userClass()));
}
