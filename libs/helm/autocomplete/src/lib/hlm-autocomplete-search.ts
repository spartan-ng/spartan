import { Directive } from '@angular/core';
import { BrnAutocompleteSearch } from '@spartan-ng/brain/autocomplete';
import { BrnPopover, provideBrnPopoverConfig, provideBrnPopoverDefaultOptions } from '@spartan-ng/brain/popover';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAutocompleteSearch],hlm-autocomplete-search',
	providers: [
		provideBrnPopoverConfig({
			align: 'start',
			sideOffset: 6,
		}),
		provideBrnPopoverDefaultOptions({ role: null }),
	],
	hostDirectives: [
		{
			directive: BrnAutocompleteSearch,
			inputs: ['autoHighlight', 'disabled', 'value', 'search', 'itemToString'],
			outputs: ['valueChange', 'searchChange'],
		},
		{
			directive: BrnPopover,
			inputs: ['align', 'closeOnOutsidePointerEvents', 'sideOffset', 'state', 'offsetX'],
			outputs: ['stateChanged', 'closed'],
		},
	],
	host: { 'data-slot': 'autocomplete' },
})
export class HlmAutocompleteSearch {
	constructor() {
		classes(() => 'block');
	}
}
