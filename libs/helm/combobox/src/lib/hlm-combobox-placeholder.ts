import { Directive } from '@angular/core';
import { BrnComboboxPlaceholder } from '@spartan-ng/brain/combobox';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmComboboxPlaceholder],hlm-combobox-placeholder',
	hostDirectives: [BrnComboboxPlaceholder],
	host: { 'data-slot': 'combobox-placeholder' },
})
export class HlmComboboxPlaceholder {
	constructor() {
		classes(
			() =>
				'spartan-combobox-placeholder flex items-center data-hidden:hidden [&_ng-icon]:pointer-events-none [&_ng-icon]:shrink-0',
		);
	}
}
