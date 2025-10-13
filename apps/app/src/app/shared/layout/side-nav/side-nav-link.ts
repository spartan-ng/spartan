import { BooleanInput } from '@angular/cdk/coercion';
import { Directive, booleanAttribute, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Directive({
	selector: '[spartanSideNavLink]',
	hostDirectives: [
		{
			directive: RouterLink,
			inputs: ['routerLink: spartanSideNavLink'],
		},
		RouterLinkActive,
	],
	host: {
		'[tabindex]': 'disabled() ? "-1" : "0"',
		'[class.!text-zinc-300]': 'disabled()',
		'[class.dark:!text-zinc-700]': 'disabled()',
		'[class.pointer-events-none]': 'disabled()',
		class:
			'group relative flex w-full justify-between items-center rounded-md border border-transparent px-2 py-1 hover:underline text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
	},
})
export class SideNavLink {
	private readonly _rlActive = inject(RouterLinkActive);

	public readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	constructor() {
		this._rlActive.routerLinkActive = 'font-medium !text-foreground';
	}
}
