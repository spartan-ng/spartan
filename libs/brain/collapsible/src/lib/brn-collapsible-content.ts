import { Directive, effect, input, untracked } from '@angular/core';
import { injectContentDimensions } from '@spartan-ng/brain/core';
import { injectBrnCollapsible } from './brn-collapsible-token';

@Directive({
	selector: '[brnCollapsibleContent],brn-collapsible-content',
	host: {
		'[attr.inert]': "_collapsible?.state() === 'closed' ? true : undefined",
		'[attr.data-state]': '_collapsible?.state()',
		'[id]': '_collapsible?.contentId()',
		'[style.--brn-collapsible-content-width.px]': '_dimensions.width()',
		'[style.--brn-collapsible-content-height.px]': '_dimensions.height()',
	},
})
export class BrnCollapsibleContent {
	protected readonly _collapsible = injectBrnCollapsible();
	protected readonly _dimensions = injectContentDimensions();

	/**
	 * The id of the collapsible content element.
	 */
	public readonly id = input<string | null | undefined>();

	constructor() {
		if (!this._collapsible) {
			throw Error('Collapsible content directive can only be used inside a brn-collapsible element.');
		}

		effect(() => {
			const id = this.id();
			const collapsible = this._collapsible;
			if (!id || !collapsible) return;
			untracked(() => collapsible.contentId.set(id));
		});
	}
}
