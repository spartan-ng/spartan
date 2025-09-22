import { Component } from '@angular/core';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-textarea-preview',
	host: {
		class: 'w-full',
	},
	imports: [HlmInputImports],
	template: `
		<textarea class="min-h-[80px] w-full" hlmInput placeholder="Type your message here."></textarea>
	`,
})
export class TextAreaPreview {}

export const defaultImports = `
import { HlmInputImports } from '@spartan-ng/helm/input';
`;
export const defaultSkeleton = `
<textarea hlmInput placeholder="Type your message here."></textarea>
`;
