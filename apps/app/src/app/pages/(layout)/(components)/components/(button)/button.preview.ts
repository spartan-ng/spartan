import { Component } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-button-preview',
	imports: [HlmButton],
	template: `
		<button hlmBtn>Button</button>
	`,
})
export class ButtonPreview {}

export const defaultImports = `
import { HlmButton } from '@spartan-ng/helm/button';
`;

export const defaultSkeleton = `
<button hlmBtn>Button</button>
`;
