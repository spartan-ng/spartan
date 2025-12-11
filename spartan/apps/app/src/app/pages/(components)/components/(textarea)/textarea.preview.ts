import { Component } from '@angular/core';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';

@Component({
	selector: 'spartan-textarea-preview',
	imports: [HlmTextareaImports],
	template: `
		<textarea hlmTextarea class="w-80" placeholder="Type your message here."></textarea>
	`,
})
export class TextareaPreview {}

export const defaultImports = `
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
`;

export const defaultSkeleton = `
<textarea hlmTextarea placeholder="Type your message here."></textarea>
`;
