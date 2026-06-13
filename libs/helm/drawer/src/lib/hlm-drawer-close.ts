import { Directive } from '@angular/core';
import { BrnDrawerClose } from '@spartan-ng/brain/drawer';

@Directive({
	selector: 'button[hlmDrawerClose]',
	hostDirectives: [{ directive: BrnDrawerClose, inputs: ['delay'] }],
	host: { 'data-slot': 'drawer-close' },
})
export class HlmDrawerClose {}
