import { Component } from '@angular/core';

@Component({
	selector: 'spartan-navigation-menu-preview',
	imports: [],
	template: ``,
})
export class NavigationMenuPreview {}

export const codeImports = `
import {

} from '@spartan-ng/helm/navigation-menu';
`;

export const codeString = `import { Component } from '@angular/core';${codeImports}

@Component({
	selector: 'spartan-navigation-menu-preview',
imports: [

	],
	template: \`

	\`,
})
export class NavigationMenuPreviewComponent {}`;

export const codeSkeleton = `

`;
