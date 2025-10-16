import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-button-preview',
	imports: [HlmButtonImports],
	template: `
		<button hlmBtn>Button</button>
	`,
})
export class ButtonPreview {}

export const defaultImports = `
import { HlmButtonImports } from '@spartan-ng/helm/button';
`;

export const defaultSkeleton = `
<button hlmBtn>Button</button>
`;
