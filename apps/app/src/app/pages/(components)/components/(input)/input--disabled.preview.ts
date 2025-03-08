import { Component } from '@angular/core';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';

@Component({
	selector: 'spartan-input-disabled',
	imports: [HlmInputDirective],
	template: `
		<input class="w-80" hlmInput disabled type="email" placeholder="Email" />
	`,
})
export class InputDisabledPreviewComponent {}

export const disabledCode = `
import { Component } from '@angular/core';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';

@Component({
  selector: 'spartan-input-disabled',
  standalone: true,
  imports: [HlmInputDirective],
  template: \`<input class="w-80" hlmInput disabled type='email' placeholder='Email' />\`,
})
export class InputDisabledPreviewComponent {}

`;
