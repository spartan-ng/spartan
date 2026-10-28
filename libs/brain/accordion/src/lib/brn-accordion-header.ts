import { Directive } from '@angular/core';
import { injectBrnAccordion } from './brn-accordion-token';

@Directive({
	selector: '[brnAccordionHeader]',
	exportAs: 'brnAccordionHeader',
	host: {
		'[attr.data-orientation]': '_orientation()',
	},
})
export class BrnAccordionHeader {
	private readonly _accordion = injectBrnAccordion();

	protected readonly _orientation = this._accordion.orientation;
}
