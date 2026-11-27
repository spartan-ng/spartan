import { Directive } from '@angular/core';
import { BrnPromptInputTextarea } from '@spartan-ng/brain/prompt-input';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'textarea[hlmPromptInputTextarea],[hlmPromptInputTextarea]',
	exportAs: 'hlmPromptInputTextarea',
	hostDirectives: [
		{
			directive: BrnPromptInputTextarea,
			inputs: ['minRows', 'maxRows', 'disabled', 'autoResize', 'submitOnEnter'],
			outputs: ['promptSubmit'],
		},
	],
	host: {
		'data-slot': 'prompt-input-textarea',
	},
})
export class HlmPromptInputTextarea {
	constructor() {
		classes(
			() =>
				'spartan-prompt-input-textarea placeholder:text-muted-foreground flex w-full resize-none border-0 bg-transparent px-3 py-2.5 text-base focus-visible:outline-hidden disabled:cursor-not-allowed md:text-sm',
		);
	}
}
