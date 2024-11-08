import { Directive, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HlmButtonDirective, provideBrnButtonConfig } from '@spartan-ng/ui-button-helm';

@Directive({
	selector: '[spartanNavLink]',
	standalone: true,
	providers: [provideBrnButtonConfig({ variant: 'link', size: 'sm' })],
	hostDirectives: [
		HlmButtonDirective,
		{
			directive: RouterLink,
			inputs: ['routerLink: spartanNavLink'],
		},
		RouterLinkActive,
	],
})
export class NavLinkDirective {
	private _hlmBtn = inject(HlmButtonDirective);
	private _rlActive = inject(RouterLinkActive);

	constructor() {
		this._hlmBtn.setClass('opacity-70 font-medium');
		this._rlActive.routerLinkActive = '!opacity-100';
	}
}
