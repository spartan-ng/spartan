import { Directive } from '@angular/core';
import { BrnAutocompleteContent } from '@spartan-ng/brain/autocomplete';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAutocompleteContent],hlm-autocomplete-content',
	hostDirectives: [BrnAutocompleteContent],
})
export class HlmAutocompleteContent {
	constructor() {
		classes(
			() =>
				'group/autocomplete-content bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 flex max-h-72 w-(--brn-autocomplete-width) min-w-36 flex-col overflow-hidden rounded-md p-0 shadow-md ring-1 duration-100',
		);
	}
}
