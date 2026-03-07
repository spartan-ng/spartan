import { Directive, inject } from '@angular/core';
import { BrnFieldControl } from '@spartan-ng/brain/field';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmInputGroup],hlm-input-group',
	host: {
		'data-slot': 'input-group',
		role: 'group',
	},
})
export class HlmInputGroup {
	private readonly _errorState = inject(BrnFieldControl, { optional: true })?.errorState;

	constructor() {
		classes(() => [
			'group/input-group border-input dark:bg-input/30 relative flex w-full items-center rounded-md border shadow-xs transition-[color,box-shadow] outline-none',
			'h-9 min-w-0 has-[>textarea]:h-auto',
			// Variants based on alignment.
			'has-[>[data-align=inline-start]]:[&>input]:ps-2',
			'has-[>[data-align=inline-end]]:[&>input]:pe-2',
			'has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3',
			'has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3',
			'has-[[data-slot=input-group-control]:focus-visible]:ring-[3px]',
			this._errorState?.()
				? 'has-[>[aria-invalid=true]]:ring-destructive/20 has-[>[aria-invalid=true]]:border-destructive dark:has-[>[aria-invalid=true]]:ring-destructive/40'
				: 'has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50',
		]);
	}
}
