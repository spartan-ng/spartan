import { Directive } from '@angular/core';
import { BrnAccordion } from '@spartan-ng/brain/accordion';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAccordion], hlm-accordion',
	hostDirectives: [{ directive: BrnAccordion, inputs: ['type', 'dir', 'orientation'] }],
})
export class HlmAccordion {
	constructor() {
		classes(() => 'flex data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col');
	}
}
