import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmInputDirective } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-input-button',
	imports: [HlmInputDirective, HlmButtonDirective],
	template: `
		<div class="flex w-full max-w-sm items-center space-x-2">
			<input aria-label="Email" class="w-80" hlmInput type="email" placeholder="Email" />
			<button hlmBtn variant="outline">Subscribe</button>
		</div>
	`,
})
export class InputButtonPreviewComponent {}

export const buttonCode = `
import { Component } from '@angular/core';
import { HlmInputDirective } from '@spartan-ng/helm/input';
import { HlmLabelDirective } from '@spartan-ng/helm/label';
import { HlmButtonDirective } from '@spartan-ng/helm/button';

@Component({
  selector: 'spartan-input-button',
imports: [HlmInputDirective, HlmButtonDirective],
  template: \`
    <div class='flex items-center w-full max-w-sm space-x-2'>
      <input aria-label='Email' class='w-80' hlmInput type='email' placeholder='Email' />
      <button hlmBtn variant="outline">Subscribe</button>
    </div>
  \`,
})
export class InputButtonPreviewComponent {}

`;
