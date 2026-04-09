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
				"flex items-center gap-2 data-hidden:hidden [&_[hlmIcon]]:pointer-events-none [&_[hlmIcon]]:shrink-0 [&_[hlmIcon]:not([class*='text-'])]:text-base",
		);
	}
}
