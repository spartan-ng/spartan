import { Directive, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HlmButton, provideBrnButtonConfig } from '@spartan-ng/helm/button';

@Directive({
	selector: '[spartanNavLink]',
	providers: [provideBrnButtonConfig({ variant: 'ghost', size: 'sm' })],
	hostDirectives: [
		HlmButton,
		{
			directive: RouterLink,
			inputs: ['routerLink: spartanNavLink'],
		},
		RouterLinkActive,
	],
})
export class NavLink {
	private readonly _rlActive = inject(RouterLinkActive);

	constructor() {
		this._rlActive.routerLinkActive = 'text-primary!';
	}
}
