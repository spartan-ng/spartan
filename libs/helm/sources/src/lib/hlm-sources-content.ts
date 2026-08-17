import { Directive } from '@angular/core';
import { BrnCollapsibleContent } from '@spartan-ng/brain/collapsible';
import { classes } from '@spartan-ng/helm/utils';

/**
 * Collapsible container for the list of `hlmSource` links, mirroring the AI Elements
 * `SourcesContent` component.
 */
@Directive({
	selector: '[hlmSourcesContent],hlm-sources-content',
	hostDirectives: [{ directive: BrnCollapsibleContent, inputs: ['id'] }],
	host: { 'data-slot': 'sources-content' },
})
export class HlmSourcesContent {
	constructor() {
		classes(
			() =>
				'spartan-sources-content mt-3 flex w-fit flex-col gap-2 outline-none data-[state=closed]:hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:animate-in data-[state=open]:slide-in-from-top-2',
		);
	}
}
