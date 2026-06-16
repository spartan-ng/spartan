import { Directive } from '@angular/core';
import { BrnDrawerClose } from '@spartan-ng/brain/drawer';

@Directive({
	selector: 'button[hlmDrawerClose]',
	hostDirectives: [BrnDrawerClose],
	host: { 'data-slot': 'drawer-close' },
})
export class HlmDrawerClose {}
