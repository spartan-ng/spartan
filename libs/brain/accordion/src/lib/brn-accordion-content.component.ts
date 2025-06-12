import {
	ChangeDetectionStrategy,
	Component,
	ViewEncapsulation,
	computed,
	inject,
	input,
	linkedSignal,
} from '@angular/core';
import type { CustomElementClassSettable } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';
import { BrnAccordionItemDirective } from './brn-accordion.directive';

@Component({
	selector: 'brn-accordion-content',
	host: {
		'[attr.data-state]': 'state()',
		'[attr.aria-labelledby]': 'ariaLabeledBy',
		role: 'region',
		'[id]': 'id',
	},
	template: `
		<div [attr.inert]="_addInert()" style="overflow: hidden">
			<p [class]="_contentClass()">
				<ng-content />
			</p>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class BrnAccordionContentComponent implements CustomElementClassSettable {
	private readonly _item = inject(BrnAccordionItemDirective);

	public readonly state = this._item.state;
	public readonly id = `brn-accordion-content-${this._item.id}`;
	public readonly ariaLabeledBy = `brn-accordion-trigger-${this._item.id}`;

	protected readonly _addInert = computed(() => (this.state() === 'closed' ? true : undefined));
	/**
	 * The class to be applied to the content element.
	 */
	public readonly contentClass = input<ClassValue>('');

	protected readonly _contentClass = linkedSignal(() => this.contentClass());

	constructor() {
		if (!this._item) {
			throw Error('Accordion Content can only be used inside an AccordionItem. Add brnAccordionItem to parent.');
		}
	}

	public setClassToCustomElement(classes: ClassValue) {
		this._contentClass.set(classes);
	}
}
