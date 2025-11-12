import { Directive } from '@angular/core';
import { BrnMenuGroup } from '@spartan-ng/brain/menu';

@Directive({
	selector: '[hlmMenuGroup],hlm-menu-group',
	hostDirectives: [BrnMenuGroup],
	host: {
		class: 'block',
	},
})
export class HlmMenuGroup {}
