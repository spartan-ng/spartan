import { Directive } from '@angular/core';
import { BrnSelectContent } from '@spartan-ng/brain/select';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmSelectContent],hlm-select-content',
	hostDirectives: [BrnSelectContent],
})
export class HlmSelectContent {
	constructor() {
		classes(
			() =>
				'bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 flex max-h-72 w-(--brn-select-width) min-w-36 flex-col overflow-x-hidden overflow-y-auto rounded-md shadow-md ring-1 duration-100',
		);
	}
}
