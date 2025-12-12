import { Directive } from '@angular/core';
import { BrnAutocompleteItem } from '@spartan-ng/brain/autocomplete';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'button[hlmAutocompleteItem],button[hlm-autocomplete-item]',
	hostDirectives: [
		{
			directive: BrnAutocompleteItem,
			inputs: ['value', 'disabled', 'id'],
			outputs: ['selected'],
		},
	],
})
export class HlmAutocompleteItem {
	constructor() {
		classes(
			() =>
				`data-[selected]:bg-accent data-[selected=true]:text-accent-foreground [&>ng-icon:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-start text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[hidden]:hidden [&>ng-icon]:pointer-events-none [&>ng-icon]:shrink-0 [&>ng-icon:not([class*='text-'])]:text-base`,
		);
	}
}
