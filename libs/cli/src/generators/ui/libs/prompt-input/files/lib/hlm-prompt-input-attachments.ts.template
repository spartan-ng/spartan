import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmPromptInputAttachments],hlm-prompt-input-attachments',
	exportAs: 'hlmPromptInputAttachments',
	host: {
		'data-slot': 'prompt-input-attachments',
	},
})
export class HlmPromptInputAttachments {
	constructor() {
		classes(() => 'spartan-prompt-input-attachments flex flex-wrap gap-2 px-3 pt-2.5 empty:hidden');
	}
}
