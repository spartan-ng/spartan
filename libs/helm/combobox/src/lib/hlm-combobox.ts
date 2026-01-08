import { Directive } from '@angular/core';
import { BrnCombobox } from '@spartan-ng/brain/combobox';
import { provideBrnDialogDefaultOptions } from '@spartan-ng/brain/dialog';
import { BrnPopover, provideBrnPopoverConfig } from '@spartan-ng/brain/popover';

@Directive({
	selector: '[hlmCombobox],hlm-combobox',
	hostDirectives: [
		{ directive: BrnCombobox, inputs: ['disabled', 'filter', 'value'], outputs: ['valueChange'] },
		{
			directive: BrnPopover,
			inputs: ['align', 'autoFocus', 'closeDelay', 'closeOnOutsidePointerEvents', 'sideOffset', 'state', 'offsetX'],
			outputs: ['stateChanged', 'closed'],
		},
	],
	providers: [
		provideBrnPopoverConfig({
			align: 'start',
			sideOffset: 6,
		}),
		provideBrnDialogDefaultOptions({
			autoFocus: 'first-heading',
		}),
	],
	host: {
		'data-slot': 'combobox',
	},
})
export class HlmCombobox {}
