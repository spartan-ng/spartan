import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmInputGroup],hlm-input-group',
	host: {
		'data-slot': 'input-group',
		role: 'group',
		'[class]': '_computedClass()',
	},
})
export class HlmInputGroup {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm(
			'group/input-group border-input dark:bg-input/30 relative flex w-full items-center rounded-md border shadow-xs transition-[color,box-shadow] outline-none',
			'h-9 min-w-0 has-[>textarea]:h-auto',
			// Variants based on alignment.
			'has-[>[data-align=inline-start]]:[&>input]:pl-2',
			'has-[>[data-align=inline-end]]:[&>input]:pr-2',
			'has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3',
			'has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3',
			// Focus state.
			'has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot=input-group-control]:focus-visible]:ring-[3px]',
			// Error state.
			'has-[>.ng-invalid.ng-touched]:ring-destructive/20 has-[>.ng-invalid.ng-touched]:border-destructive dark:has-[>.ng-invalid.ng-touched]:ring-destructive/40',

			this.userClass(),
		),
	);
}
