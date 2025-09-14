import { Component } from '@angular/core';

@Component({
	selector: 'spartan-sidebar-preview',
	imports: [],
	template: `

	`,
})
export class SidebarPreviewComponent {}

export const codeImports = `
import {

} from '@spartan-ng/helm/sidebar';
`;

export const codeString = `import { Component } from '@angular/core';${codeImports}

@Component({
	selector: 'spartan-sidebar-preview',
imports: [

	],
	template: \`

	\`,
})
export class SidebarPreviewComponent {}`;

export const codeSkeleton = `

`;


export const cssCode = `
@layer base {
  :root {
    --sidebar: oklch(0.985 0 0);
    --sidebar-foreground: oklch(0.145 0 0);
    --sidebar-primary: oklch(0.205 0 0);
    --sidebar-primary-foreground: oklch(0.985 0 0);
    --sidebar-accent: oklch(0.97 0 0);
    --sidebar-accent-foreground: oklch(0.205 0 0);
    --sidebar-border: oklch(0.922 0 0);
    --sidebar-ring: oklch(0.708 0 0);
  }

  .dark {
    --sidebar: oklch(0.205 0 0);
    --sidebar-foreground: oklch(0.985 0 0);
    --sidebar-primary: oklch(0.488 0.243 264.376);
    --sidebar-primary-foreground: oklch(0.985 0 0);
    --sidebar-accent: oklch(0.269 0 0);
    --sidebar-accent-foreground: oklch(0.985 0 0);
    --sidebar-border: oklch(1 0 0 / 10%);
    --sidebar-ring: oklch(0.439 0 0);
  }
}
`
