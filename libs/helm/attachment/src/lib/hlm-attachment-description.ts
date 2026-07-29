import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAttachmentDescription],hlm-attachment-description',
	host: { 'data-slot': 'attachment-description' },
})
export class HlmAttachmentDescription {
	constructor() {
		classes(
			() =>
				'spartan-attachment-description group-data-[state=error]/attachment:text-destructive/80 block max-w-full min-w-0',
		);
	}
}
