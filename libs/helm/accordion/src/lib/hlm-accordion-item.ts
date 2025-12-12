import { Directive } from '@angular/core';
import { BrnAccordionItem } from '@spartan-ng/brain/accordion';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAccordionItem],brn-accordion-item[hlm],hlm-accordion-item',
	hostDirectives: [
		{
			directive: BrnAccordionItem,
			inputs: ['isOpened'],
			outputs: ['openedChange'],
		},
	],
})
export class HlmAccordionItem {
	constructor() {
		classes(() => 'border-border flex flex-1 flex-col border-b');
	}
}
