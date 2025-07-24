import { Directive, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HlmButton, provideBrnButtonConfig } from '@spartan-ng/helm/button';

@Directive({
	selector: '[spartanNavLink]',
	providers: [provideBrnButtonConfig({ variant: 'link', size: 'sm' })],
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
	private readonly _hlmBtn = inject(HlmButton);
	private readonly _rlActive = inject(RouterLinkActive);

	constructor() {
		this._hlmBtn.setClass('opacity-70 font-medium');
		this._rlActive.routerLinkActive = '!opacity-100';
	}
}
