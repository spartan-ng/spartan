import { Directive } from '@angular/core';
import { BrnPromptInputStop } from '@spartan-ng/brain/prompt-input';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'button[hlmPromptInputStop],[hlmPromptInputStop]',
	exportAs: 'hlmPromptInputStop',
	hostDirectives: [
		{
			directive: BrnPromptInputStop,
			inputs: ['disabled'],
		},
	],
	host: {
		'data-slot': 'prompt-input-stop',
	},
})
export class HlmPromptInputStop {
	constructor() {
		classes(() => 'spartan-prompt-input-stop');
	}
}
