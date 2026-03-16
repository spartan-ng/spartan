import type { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, Directive, input } from '@angular/core';
import { BrnCollapsibleContent } from '@spartan-ng/brain/collapsible';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmCollapsibleContent],hlm-collapsible-content',
	hostDirectives: [{ directive: BrnCollapsibleContent, inputs: ['id', 'style'] }],
	host: {
		'data-slot': 'collapsible-content',
	},
})
export class HlmCollapsibleContent {
	/**
	 * Hides the content when closed. Disable for CSS-driven animations.
	 * @default true
	 */
	public readonly hideWhenClosed = input<boolean, BooleanInput>(true, { transform: booleanAttribute });

	constructor() {
		classes(() => (this.hideWhenClosed() ? 'data-[state=closed]:hidden' : ''));
	}
}
