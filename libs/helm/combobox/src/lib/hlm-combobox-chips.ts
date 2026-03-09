import { Directive } from '@angular/core';
import { BrnComboboxAnchor, BrnComboboxInputWrapper, BrnComboboxPopoverTrigger } from '@spartan-ng/brain/combobox';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmComboboxChips],hlm-combobox-chips',
	hostDirectives: [BrnComboboxInputWrapper, BrnComboboxAnchor, BrnComboboxPopoverTrigger],
	host: {
		'data-slott': 'combobox-chips',
	},
})
export class HlmComboboxChips {
	constructor() {
		classes(
			() =>
				'dark:bg-input/30 border-input focus-within:border-ring focus-within:ring-ring/50 has-[>[data-matches-spartan-invalid=true]]:ring-destructive/20 dark:has-[>[data-matches-spartan-invalid=true]]:ring-destructive/40 has-[>[data-matches-spartan-invalid=true]]:border-destructive dark:has-[>[data-matches-spartan-invalid=true]]:border-destructive/50 has-data-[slot=combobox-chip]:px-1.5; flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border bg-transparent bg-clip-padding px-2.5 py-1.5 text-sm shadow-xs transition-[color,box-shadow] focus-within:ring-[3px] has-[>[data-matches-spartan-invalid=true]]:ring-[3px]',
		);
	}
}
