import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmDropdownMenuShortcut],hlm-dropdown-menu-shortcut',
	exportAs: 'hlmDropdownMenuShortcut',
	host: { 'data-slot': 'dropdown-menu-shortcut' },
})
export class HlmDropdownMenuShortcut {
	constructor() {
		classes(() => 'spartan-dropdown-menu-shortcut');
	}
}
