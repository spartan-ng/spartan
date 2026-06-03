import { Directive } from '@angular/core';
import { BrnComboboxStatus } from '@spartan-ng/brain/combobox';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmComboboxStatus],hlm-combobox-status',
	hostDirectives: [BrnComboboxStatus],
	host: { 'data-slot': 'combobox-status' },
})
export class HlmComboboxStatus {
	constructor() {
		classes(() => 'spartan-combobox-status flex w-full items-center justify-center text-center');
	}
}
