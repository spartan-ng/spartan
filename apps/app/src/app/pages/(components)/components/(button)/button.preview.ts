import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-button-preview',
	imports: [HlmButtonDirective],
	template: `
		<button hlmBtn>Button</button>
	`,
})
export class ButtonPreviewComponent {}

export const defaultImports = `
import { HlmButtonDirective } from '@spartan-ng/helm/button';
`;

export const defaultSkeleton = `
<button hlmBtn>Button</button>
`;
