import { Directive } from '@angular/core';
import { BrnComboboxContent } from '@spartan-ng/brain/combobox';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmComboboxContent]',
	hostDirectives: [BrnComboboxContent],
})
export class HlmComboboxContent {
	constructor() {
		classes(() => [
			'group/combobox-content bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 max-h-72 w-(--brn-combobox-width) min-w-36 overflow-hidden rounded-md p-0 shadow-md ring-1 duration-100',
			// change input group styles in the content
			'**:data-[slot=input-group]:bg-input **:data-[slot=input-group]:border-input/30 **:has-[[data-slot=input-group-control]:focus-visible]:border-input **:has-[[data-slot=input-group-control]:focus-visible]:ring-0 **:data-[slot=input-group]:m-1 **:data-[slot=input-group]:mb-0 **:data-[slot=input-group]:h-8 **:data-[slot=input-group]:shadow-none',
		]);
	}
}
