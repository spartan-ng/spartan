import { Directive } from '@angular/core';
import { BrnNavigationMenuItem } from '@spartan-ng/brain/navigation-menu';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'li[hlmNavigationMenuItem]',
	host: { 'data-slot': 'navigation-menu-item' },
	hostDirectives: [{ directive: BrnNavigationMenuItem, inputs: ['id'] }],
})
export class HlmNavigationMenuItem {
	constructor() {
		classes(() => 'relative');
	}
}
