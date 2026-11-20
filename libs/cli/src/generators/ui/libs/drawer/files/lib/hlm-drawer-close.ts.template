import { Directive } from '@angular/core';
import { BrnDrawerClose } from '@spartan-ng/brain/drawer';

@Directive({
	selector: 'button[hlmDrawerClose]',
	exportAs: 'hlmDrawerClose',
	hostDirectives: [{ directive: BrnDrawerClose, inputs: ['disabled'] }],
	host: { 'data-slot': 'drawer-close' },
})
export class HlmDrawerClose {}
