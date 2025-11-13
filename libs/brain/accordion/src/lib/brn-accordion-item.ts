import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { computed, Directive, effect, input, output, untracked } from '@angular/core';
import { injectBrnAccordion, provideBrnAccordionItem } from './brn-accordion-token';

@Directive({
	selector: '[brnAccordionItem]',
	exportAs: 'brnAccordionItem',
	providers: [provideBrnAccordionItem(BrnAccordionItem)],
	host: {
		'[attr.data-state]': 'state()',
	},
})
export class BrnAccordionItem {
	private static _itemIdGenerator = 0;
	public readonly id = ++BrnAccordionItem._itemIdGenerator;
	private readonly _accordion = injectBrnAccordion();
	/**
	 * Whether the item is opened or closed.
	 * @default false
	 */
	public readonly isOpened = input<boolean, BooleanInput>(false, { transform: coerceBooleanProperty });
	/**
	 * Computed state of the item, either 'open' or 'closed'
	 * @default closed
	 */
	public readonly state = computed(() => (this._accordion.openItemIds()?.includes(this.id) ? 'open' : 'closed'));
	/**
	 * Emits boolean when the item is opened or closed.
	 */
	public readonly stateChange = output<'open' | 'closed'>();
	/**
	 * Emits state change when item is opened or closed
	 */
	public readonly openedChange = output<boolean>();

	constructor() {
		if (!this._accordion) {
			throw Error('Accordion item can only be used inside an Accordion. Add brnAccordion to ancestor.');
		}
		effect(() => {
			const state = this.state();
			untracked(() => {
				this.stateChange.emit(state);
				this.openedChange.emit(state === 'open');
			});
		});
		effect(() => {
			const isOpened = this.isOpened();
			untracked(() => {
				if (isOpened) {
					this._accordion.openItem(this.id);
				} else {
					this._accordion.closeItem(this.id);
				}
			});
		});
	}
}
