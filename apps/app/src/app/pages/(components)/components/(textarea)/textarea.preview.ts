import { Component } from '@angular/core';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-textarea-preview',
	imports: [HlmInputImports],
	template: `
		<textarea class="min-h-16 w-80" hlmInput placeholder="Type your message here."></textarea>
	`,
})
export class TextAreaPreview {}

export const defaultImports = `
import { HlmInputImports } from '@spartan-ng/helm/input';
`;
export const defaultSkeleton = `
<textarea hlmInput placeholder="Type your message here."></textarea>
`;
