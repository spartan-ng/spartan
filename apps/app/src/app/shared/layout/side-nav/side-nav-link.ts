import { booleanAttribute, Directive, inject, Input } from '@angular/core';
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
		'[tabindex]': '_disabled ? "-1" : "0"',
		'[class.!text-zinc-300]': '_disabled',
		'[class.dark:!text-zinc-700]': '_disabled',
		'[class.pointer-events-none]': '_disabled',
		class:
			'group relative flex w-full justify-between items-center rounded-md border border-transparent  py-1 hover:underline text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
	},
})
export class SideNavLink {
	private readonly _rlActive = inject(RouterLinkActive);
	protected _disabled = false;
	@Input({ transform: booleanAttribute })
	public set disabled(value: boolean) {
		this._disabled = value;
	}

	constructor() {
		this._rlActive.routerLinkActive = 'font-medium !text-foreground';
	}
}
