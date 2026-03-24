import { computed, contentChild, Directive } from '@angular/core';
import { BrnSelectLabel } from './brn-select-label';

@Directive({
	selector: '[brnSelectGroup]',
	host: {
		role: 'group',
		'[attr.aria-labelledby]': '_labelledby()',
	},
})
export class BrnSelectGroup {
	private readonly _selectLabel = contentChild(BrnSelectLabel);

	protected readonly _labelledby = computed(() => this._selectLabel()?.id() ?? null);
}
