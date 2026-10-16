import { Directive } from '@angular/core';
import { BrnNavigationMenuContent } from '@spartan-ng/brain/navigation-menu';

@Directive({
	selector: '[hlmNavigationMenuPortal]',
	exportAs: 'hlmNavigationMenuPortal',
	hostDirectives: [BrnNavigationMenuContent],
})
export class HlmNavigationMenuPortal {}
