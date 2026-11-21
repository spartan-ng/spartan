import { Directive } from '@angular/core';
import { BrnDrawerPortal } from '@spartan-ng/brain/drawer';

@Directive({
	selector: '[hlmDrawerPortal]',
	exportAs: 'hlmDrawerPortal',
	hostDirectives: [{ directive: BrnDrawerPortal, inputs: ['context', 'class'] }],
})
export class HlmDrawerPortal {}
