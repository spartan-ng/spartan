import { CdkMenuTrigger } from '@angular/cdk/menu';
import { computed, Directive, effect, inject, input } from '@angular/core';
import { createMenuPosition, type MenuAlign, type MenuSide } from '@spartan-ng/brain/core';
import { setLastPositionOnOpenWithDarkMagic } from '@spartan-ng/helm/utils';
import { injectHlmDropdownMenuConfig } from './hlm-dropdown-menu-token';
@Directive({
	selector: '[hlmDropdownMenuTrigger]',
	hostDirectives: [
		{
			directive: CdkMenuTrigger,
			inputs: ['cdkMenuTriggerFor: hlmDropdownMenuTrigger', 'cdkMenuTriggerData: hlmDropdownMenuTriggerData'],
			outputs: ['cdkMenuOpened: hlmDropdownMenuOpened', 'cdkMenuClosed: hlmDropdownMenuClosed'],
		},
	],
	host: {
		'data-slot': 'dropdown-menu-trigger',
	},
})
export class HlmDropdownMenuTrigger {
	private readonly _cdkTrigger = inject(CdkMenuTrigger, { host: true });
	private readonly _config = injectHlmDropdownMenuConfig();

	public readonly align = input<MenuAlign>(this._config.align);
	public readonly side = input<MenuSide>(this._config.side);

	private readonly _menuPosition = computed(() => createMenuPosition(this.align(), this.side()));

	constructor() {
		setLastPositionOnOpenWithDarkMagic(this._cdkTrigger);

		effect(() => {
			this._cdkTrigger.menuPosition = this._menuPosition();
		});
	}
}
