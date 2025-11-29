import { type BooleanInput } from '@angular/cdk/coercion';
import { CdkContextMenuTrigger } from '@angular/cdk/menu';
import { booleanAttribute, computed, Directive, effect, inject, input } from '@angular/core';
import { createMenuPosition, type MenuAlign, type MenuSide } from '@spartan-ng/brain/core';
import { setLastPositionOnOpenWithDarkMagic } from '@spartan-ng/helm/utils';
import { injectHlmContextMenuConfig } from './hlm-context-menu-token';

@Directive({
	selector: '[hlmContextMenuTrigger]',
	hostDirectives: [
		{
			directive: CdkContextMenuTrigger,
			inputs: [
				'cdkContextMenuTriggerFor: hlmContextMenuTrigger',
				'cdkContextMenuTriggerData: hlmContextMenuTriggerData',
				'cdkContextMenuDisabled: disabled',
			],
			outputs: ['cdkContextMenuOpened: hlmContextMenuOpened', 'cdkContextMenuClosed: hlmContextMenuClosed'],
		},
	],
	host: {
		'data-slot': 'context-menu-trigger',
		'[attr.data-disabled]': 'disabled() ? "" : null',
	},
})
export class HlmContextMenuTrigger {
	private readonly _cdkTrigger = inject(CdkContextMenuTrigger, { host: true });
	private readonly _config = injectHlmContextMenuConfig();

	public readonly disabled = input<boolean, BooleanInput>(this._cdkTrigger.disabled, { transform: booleanAttribute });

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
