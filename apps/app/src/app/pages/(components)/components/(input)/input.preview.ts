import { Component } from '@angular/core';
import { HlmInput } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-input-preview',
	imports: [HlmInput],
	template: `
		<input class="w-80" hlmInput type="email" placeholder="Email" />
	`,
})
export class InputPreview {}

export const defaultImports = `
import { HlmInputDirective } from '@spartan-ng/helm/input';
`;
export const defaultSkeleton = '<input hlmInput/>';
