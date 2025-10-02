import { Component } from '@angular/core';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-textarea-disabled',
	imports: [HlmInputImports],
	template: `
		<textarea class="min-h-16 w-80" hlmInput disabled placeholder="Type your message here."></textarea>
	`,
})
export class TextareaDisabledPreview {}
