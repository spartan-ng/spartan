import { type BooleanInput } from '@angular/cdk/coercion';
import { CdkMenuItem, CdkMenuItemRadio, CdkMenuItemSelectable } from '@angular/cdk/menu';
import { Directive, booleanAttribute, inject, input } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmDropdownMenuRadioCdk]',
	providers: [
		{ provide: CdkMenuItemRadio, useExisting: HlmDropdownMenuRadioCdk },
		{ provide: CdkMenuItemSelectable, useExisting: HlmDropdownMenuRadioCdk },
		{ provide: CdkMenuItem, useExisting: CdkMenuItemSelectable },
	],
})
export class HlmDropdownMenuRadioCdk extends CdkMenuItemRadio {
	public readonly keepOpen = input<boolean, BooleanInput>(true, { transform: booleanAttribute });

	public override trigger(options?: { keepOpen: boolean }) {
		super.trigger({ ...options, keepOpen: this.keepOpen() });
	}
}

@Directive({
	selector: '[hlmDropdownMenuRadio]',
	hostDirectives: [
		{
			directive: HlmDropdownMenuRadioCdk,
			inputs: ['cdkMenuItemDisabled: disabled', 'cdkMenuItemChecked: checked', 'keepOpen'],
			outputs: ['cdkMenuItemTriggered: triggered'],
		},
	],
	host: {
		'data-slot': 'dropdown-menu-radio-item',
		'[attr.data-disabled]': '_cdkMenuItem.disabled ? "" : null',
		'[attr.data-checked]': '_cdkMenuItem.checked ? "" : null',
	},
})
export class HlmDropdownMenuRadio {
	protected readonly _cdkMenuItem = inject(HlmDropdownMenuRadioCdk);

	constructor() {
		classes(
			() =>
				'spartan-dropdown-menu-radio-item group/dropdown-menu-radio relative flex w-full cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_ng-icon]:pointer-events-none [&_ng-icon]:shrink-0',
		);
	}
}
