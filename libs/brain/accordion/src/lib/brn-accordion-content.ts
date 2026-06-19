import { Directive, computed, input } from '@angular/core';
import { injectBrnAccordionItem } from './brn-accordion-token';

@Directive({
	selector: 'brn-accordion-content,[brnAccordionContent]',
	host: {
		'[attr.data-state]': 'state?.()',
		'[attr.aria-labelledby]': 'ariaLabeledBy',
		role: 'region',
		'[id]': 'id',
		'[attr.inert]': '_inert()',
		'[attr.style]': 'style()',
	},
})
export class BrnAccordionContent {
	private readonly _item = injectBrnAccordionItem();

	protected readonly _inert = computed(() => (this.state?.() === 'closed' ? true : undefined));

	public readonly state = this._item?.state;
	public readonly id = `brn-accordion-content-${this._item?.id}`;
	public readonly ariaLabeledBy = `brn-accordion-trigger-${this._item?.id}`;
	/**
	 * The style to be applied to the host element.
	 * @default 'overflow: hidden'
	 */
	public readonly style = input<string>('overflow: hidden');

	constructor() {
		if (!this._item) {
			throw Error('Accordion Content can only be used inside an AccordionItem. Add brnAccordionItem to parent.');
		}
	}
}
