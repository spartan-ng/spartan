import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmPromptInputActions],hlm-prompt-input-actions',
	exportAs: 'hlmPromptInputActions',
	host: {
		'data-slot': 'prompt-input-actions',
	},
})
export class HlmPromptInputActions {
	constructor() {
		classes(() => 'spartan-prompt-input-actions flex items-center gap-1.5 p-2');
	}
}
