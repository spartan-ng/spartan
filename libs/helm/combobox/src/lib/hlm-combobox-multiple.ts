import { Directive } from '@angular/core';
import { BrnComboboxMultiple } from '@spartan-ng/brain/combobox';
import { BrnPopover, provideBrnPopoverConfig, provideBrnPopoverDefaultOptions } from '@spartan-ng/brain/popover';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmComboboxMultiple],hlm-combobox-multiple',
	providers: [
		provideBrnPopoverConfig({
			align: 'start',
			sideOffset: 6,
		}),
		provideBrnPopoverDefaultOptions({ role: null }),
	],
	hostDirectives: [
		{
			directive: BrnComboboxMultiple,
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
			inputs: ['align', 'closeOnOutsidePointerEvents', 'sideOffset', 'state', 'offsetX'],
			outputs: ['stateChanged', 'closed'],
		},
	],
	host: { 'data-slot': 'combobox' },
})
export class HlmComboboxMultiple {
	constructor() {
		classes(() => 'block');
	}
}
