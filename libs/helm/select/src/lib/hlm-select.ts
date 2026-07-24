import { Directive } from '@angular/core';
import { BrnPopover, provideBrnPopoverConfig, provideBrnPopoverDefaultOptions } from '@spartan-ng/brain/popover';
import { BrnSelect } from '@spartan-ng/brain/select';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmSelect],hlm-select',
	providers: [
		provideBrnPopoverConfig({
			align: 'start',
			sideOffset: 6,
		}),
		provideBrnPopoverDefaultOptions({ role: null }),
	],
	hostDirectives: [
		{
			directive: BrnSelect,
			inputs: ['disabled', 'value', 'isItemEqualToValue', 'itemToString'],
			outputs: ['valueChange'],
		},
		{
			directive: BrnPopover,
			inputs: ['align', 'closeOnOutsidePointerEvents', 'sideOffset', 'state', 'offsetX'],
			outputs: ['stateChanged', 'closed'],
		},
	],
	host: { 'data-slot': 'select' },
})
export class HlmSelect {
	constructor() {
		classes(() => 'block');
	}
}
