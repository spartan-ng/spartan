import { Directive } from '@angular/core';
import { BrnDrawerTrigger } from '@spartan-ng/brain/drawer';

@Directive({
	selector: 'button[hlmDrawerTrigger],button[hlmDrawerTriggerFor]',
	exportAs: 'hlmDrawerTrigger',
	hostDirectives: [
		{
			directive: BrnDrawerTrigger,
			inputs: ['id', 'type', 'payload', 'brnDrawerTriggerFor: hlmDrawerTriggerFor'],
		},
	],
	host: { 'data-slot': 'drawer-trigger' },
})
export class HlmDrawerTrigger {}
