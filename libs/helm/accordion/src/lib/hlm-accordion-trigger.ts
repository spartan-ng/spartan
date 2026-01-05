import { Directive } from '@angular/core';
import { BrnAccordionTrigger } from '@spartan-ng/brain/accordion';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAccordionTrigger]',
	hostDirectives: [BrnAccordionTrigger],
	host: {
		'[style.--tw-ring-offset-shadow]': '"0 0 #000"',
	},
})
export class HlmAccordionTrigger {
	constructor() {
		classes(
			() =>
				'group focus-visible:ring-ring focus-visible:ring-offset-background flex w-full items-center justify-between py-4 text-left font-medium transition-all hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none [&[data-state=open]>ng-icon]:rotate-180',
		);
	}
}
