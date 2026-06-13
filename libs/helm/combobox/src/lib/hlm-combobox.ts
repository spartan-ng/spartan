import { Directive } from '@angular/core';
import { BrnCombobox } from '@spartan-ng/brain/combobox';
import { BrnPopover, provideBrnPopoverConfig, provideBrnPopoverDefaultOptions } from '@spartan-ng/brain/popover';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmCombobox],hlm-combobox',
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
			directive: BrnCombobox,
			inputs: [
				'autoHighlight',
				'disabled',
				'filter',
				'search',
				'value',
				'itemToString',
				'filterOptions',
				'isItemEqualToValue',
			],
			outputs: ['searchChange', 'valueChange'],
		},
		{
			directive: BrnPopover,
			inputs: ['align', 'autoFocus', 'closeOnOutsidePointerEvents', 'sideOffset', 'state', 'offsetX', 'restoreFocus'],
			outputs: ['stateChanged', 'closed'],
		},
	],
	host: { 'data-slot': 'combobox' },
})
export class HlmCombobox {
	constructor() {
		classes(() => 'block');
	}
}
