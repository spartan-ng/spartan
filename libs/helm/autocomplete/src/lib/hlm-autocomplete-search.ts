import { Directive } from '@angular/core';
import { BrnAutocompleteSearch } from '@spartan-ng/brain/autocomplete';
import { provideBrnDialogDefaultOptions } from '@spartan-ng/brain/dialog';
import { BrnPopover, provideBrnPopoverConfig } from '@spartan-ng/brain/popover';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAutocompleteSearch],hlm-autocomplete-search',
	providers: [
		provideBrnPopoverConfig({
			align: 'start',
			sideOffset: 6,
		}),
		provideBrnDialogDefaultOptions({
			autoFocus: 'first-heading',
		}),
	],
	hostDirectives: [
		{
			directive: BrnAutocompleteSearch,
			inputs: ['autoHighlight', 'disabled', 'value', 'search', 'itemToString'],
			outputs: ['valueChange', 'searchChange'],
		},
		{
			directive: BrnPopover,
			inputs: [
				'align',
				'autoFocus',
				'closeDelay',
				'closeOnOutsidePointerEvents',
				'sideOffset',
				'state',
				'offsetX',
				'restoreFocus',
			],
			outputs: ['stateChanged', 'closed'],
		},
	],
	host: {
		'data-slot': 'autocomplete',
	},
})
export class HlmAutocompleteSearch {
	constructor() {
		classes(() => 'block');
	}
}
