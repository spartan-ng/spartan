import { Directive } from '@angular/core';
import { BrnDrawerTrigger } from '@spartan-ng/brain/drawer';

@Directive({
	selector: 'button[hlmDrawerTrigger]',
	hostDirectives: [{ directive: BrnDrawerTrigger, inputs: ['id', 'direction', 'type'] }],
	host: { 'data-slot': 'drawer-trigger' },
})
export class HlmDrawerTrigger {}
