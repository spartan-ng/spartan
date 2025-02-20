import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
	selector: 'spartan-button-preview',
	imports: [HlmButtonDirective],
	template: `
		<button hlmBtn>Button</button>
	`,
})
export class ButtonPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'spartan-button-preview',
  standalone: true,
  imports: [HlmButtonDirective],
  template: \` <button hlmBtn>Button</button> \`,
})
export class ButtonPreviewComponent {}
`;

export const defaultImports = `
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
`;

export const defaultSkeleton = `
<button hlmBtn>Button</button>
`;
