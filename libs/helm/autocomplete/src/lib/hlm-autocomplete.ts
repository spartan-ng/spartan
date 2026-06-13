import { Directive } from '@angular/core';
import { BrnAutocomplete } from '@spartan-ng/brain/autocomplete';
import { BrnPopover, provideBrnPopoverConfig, provideBrnPopoverDefaultOptions } from '@spartan-ng/brain/popover';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAutocomplete],hlm-autocomplete',
	providers: [
		provideBrnPopoverConfig({
			align: 'start',
			sideOffset: 6,
		}),
		provideBrnPopoverDefaultOptions({
			autoFocus: 'first-heading',
		}),
	],
	hostDirectives: [
		{
			directive: BrnAutocomplete,
			inputs: ['autoHighlight', 'disabled', 'value', 'search', 'itemToString', 'isItemEqualToValue'],
			outputs: ['valueChange', 'searchChange'],
		},
		{
			directive: BrnPopover,
			inputs: ['align', 'autoFocus', 'closeOnOutsidePointerEvents', 'sideOffset', 'state', 'offsetX', 'restoreFocus'],
			outputs: ['stateChanged', 'closed'],
		},
	],
	host: { 'data-slot': 'autocomplete' },
})
export class HlmAutocomplete {
	constructor() {
		classes(() => 'block');
	}
}
