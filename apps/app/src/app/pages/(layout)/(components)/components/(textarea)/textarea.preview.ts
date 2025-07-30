import { Component } from '@angular/core';
import { HlmInputDirective } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-textarea-preview',
	host: {
		class: 'w-full',
	},
	imports: [HlmInputDirective],
	template: `
		<textarea class="min-h-[80px] w-full" hlmInput placeholder="Type your message here."></textarea>
	`,
})
export class TextAreaPreviewComponent {}

export const defaultImports = `
import { HlmInputDirective } from '@spartan-ng/helm/input';
`;
export const defaultSkeleton = `
<textarea hlmInput placeholder="Type your message here."></textarea>
`;
