import { Directive } from '@angular/core';
import { BrnNavigationMenuList } from '@spartan-ng/brain/navigation-menu';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'ul[hlmNavigationMenuList]',
	hostDirectives: [
		{
			directive: BrnNavigationMenuList,
		},
	],
	host: {
		'data-slot': 'navigation-menu-list',
	},
})
export class HlmNavigationMenuList {
	constructor() {
		classes(() => [
			'spartan-navigation-menu-list group flex flex-1 list-none items-center justify-center',
			'data-[orientation=vertical]:flex-col',
		]);
	}
}
