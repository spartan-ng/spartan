import { Directive } from '@angular/core';
import { BrnPromptInput } from '@spartan-ng/brain/prompt-input';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmPromptInput],hlm-prompt-input',
	exportAs: 'hlmPromptInput',
	hostDirectives: [
		{
			directive: BrnPromptInput,
			inputs: ['disabled', 'streaming', 'minRows', 'maxRows'],
			outputs: ['promptSubmit', 'promptStop'],
		},
	],
	host: {
		'data-slot': 'prompt-input',
	},
})
export class HlmPromptInput {
	constructor() {
		classes(
			() =>
				'group/prompt-input spartan-prompt-input border-input bg-background focus-within:border-ring focus-within:ring-ring/50 relative flex w-full flex-col rounded-xl border shadow-xs transition-[color,box-shadow] focus-within:ring-[3px] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
		);
	}
}
