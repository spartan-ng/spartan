import { Directive } from '@angular/core';
import { injectBrnSelectBase } from './brn-select.token';

@Directive({
	selector: '[brnSelectContent]',
	host: {
		'[style.--brn-select-width.px]': '_selectWidth()',
	},
})
export class BrnSelectContent {
	private readonly _select = injectBrnSelectBase();

	protected readonly _selectWidth = this._select.triggerWidth;
}
