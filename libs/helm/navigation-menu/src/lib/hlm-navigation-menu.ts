import { Directive } from '@angular/core';
import { BrnNavigationMenu } from '@spartan-ng/brain/navigation-menu';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'nav[hlmNavigationMenu]',
	hostDirectives: [
		{
			directive: BrnNavigationMenu,
			inputs: ['value', 'delayDuration', 'skipDelayDuration', 'orientation', 'openOn'],
			outputs: ['valueChange'],
		},
	],
	host: {
		'data-slot': 'navigation-menu',
	},
})
export class HlmNavigationMenu {
	constructor() {
		classes(
			() => 'spartan-navigation-menu group/navigation-menu relative flex max-w-max flex-1 items-center justify-center',
		);
	}
}
