import { Component } from '@angular/core';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';

@Component({
	selector: 'spartan-input-preview',
	imports: [HlmInputDirective],
	template: `
		<input class="w-80" hlmInput type="email" placeholder="Email" />
	`,
})
export class InputPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';

@Component({
  selector: 'spartan-input-preview',
  standalone: true,
  imports: [HlmInputDirective],
  template: \`<input class="w-80" hlmInput placeholder='Email' type='email' />\`,
})
export class InputPreviewComponent {}
`;

export const defaultImports = `
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
`;
export const defaultSkeleton = '<input hlmInput/>';
