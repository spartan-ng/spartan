import { Directive } from '@angular/core';
import { BrnCommandSearchInput } from '@spartan-ng/brain/command';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'input[hlmCommandSearchInput],input[hlm-command-search-input]',
	hostDirectives: [{ directive: BrnCommandSearchInput, inputs: ['value'] }],
	host: {
		'data-slot': 'command-search-input',
	},
})
export class HlmCommandSearchInput {
	constructor() {
		classes(
			() =>
				'placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
		);
	}
}
