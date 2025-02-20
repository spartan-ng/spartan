import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';

@Component({
	selector: 'spartan-input-button',
	imports: [HlmInputDirective, HlmButtonDirective],
	template: `
		<div class="flex w-full max-w-sm items-center space-x-2">
			<input aria-label="Email" class="w-80" hlmInput type="email" placeholder="Email" />
			<button hlmBtn>Subscribe</button>
		</div>
	`,
})
export class InputButtonPreviewComponent {}

export const buttonCode = `
import { Component } from '@angular/core';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'spartan-input-button',
  standalone: true,
  imports: [HlmInputDirective, HlmButtonDirective],
  template: \`
    <div class='flex items-center w-full max-w-sm space-x-2'>
      <input aria-label='Email' class='w-80' hlmInput type='email' placeholder='Email' />
      <button hlmBtn>Subscribe</button>
    </div>
  \`,
})
export class InputButtonPreviewComponent {}

`;
