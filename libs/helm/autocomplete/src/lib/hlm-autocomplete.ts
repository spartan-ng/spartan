import { Directive } from '@angular/core';
import { BrnAutocomplete } from '@spartan-ng/brain/autocomplete';
import { provideBrnDialogDefaultOptions } from '@spartan-ng/brain/dialog';
import { BrnPopover, provideBrnPopoverConfig } from '@spartan-ng/brain/popover';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAutocomplete],hlm-autocomplete',
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
			directive: BrnAutocomplete,
			inputs: ['disabled', 'value', 'search', 'itemToString', 'isItemEqualToValue'],
			outputs: ['valueChange', 'searchChange'],
		},
		{
			directive: BrnPopover,
			inputs: ['align', 'autoFocus', 'closeDelay', 'closeOnOutsidePointerEvents', 'sideOffset', 'state', 'offsetX'],
			outputs: ['stateChanged', 'closed'],
		},
	],
	host: {
		'data-slot': 'autocomplete',
	},
})
export class HlmAutocomplete {
	constructor() {
		classes(() => 'block');
	}
}
