import { Directive } from '@angular/core';
import { BrnPromptInputSubmit } from '@spartan-ng/brain/prompt-input';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'button[hlmPromptInputSubmit],[hlmPromptInputSubmit]',
	exportAs: 'hlmPromptInputSubmit',
	hostDirectives: [
		{
			directive: BrnPromptInputSubmit,
			inputs: ['disabled'],
		},
	],
	host: {
		'data-slot': 'prompt-input-submit',
	},
})
export class HlmPromptInputSubmit {
	constructor() {
		classes(() => 'spartan-prompt-input-submit');
	}
}
