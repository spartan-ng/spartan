import { Component } from '@angular/core';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';

@Component({
	selector: 'spartan-textarea-disabled',
	imports: [HlmTextareaImports],
	template: `
		<textarea hlmTextarea class="w-80" disabled placeholder="Type your message here."></textarea>
	`,
})
export class TextareaDisabledPreview {}
