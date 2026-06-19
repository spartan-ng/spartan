import { Directive, computed } from '@angular/core';
import { injectBrnAccordionItem } from './brn-accordion-token';

@Directive({
	selector: 'brn-accordion-content,[brnAccordionContent]',
	host: {
		'[attr.data-state]': 'state?.()',
		'[attr.aria-labelledby]': 'ariaLabeledBy',
		role: 'region',
		'[id]': 'id',
		'[attr.inert]': '_inert()',
	},
})
export class BrnAccordionContent {
	private readonly _item = injectBrnAccordionItem();

	protected readonly _inert = computed(() => (this.state?.() === 'closed' ? true : undefined));

	public readonly state = this._item?.state;
	public readonly id = `brn-accordion-content-${this._item?.id}`;
	public readonly ariaLabeledBy = `brn-accordion-trigger-${this._item?.id}`;

	constructor() {
		if (!this._item) {
			throw Error('Accordion Content can only be used inside an AccordionItem. Add brnAccordionItem to parent.');
		}
	}
}
