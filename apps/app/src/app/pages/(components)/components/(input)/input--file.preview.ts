import { Component } from '@angular/core';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';

@Component({
	selector: 'spartan-input-file',
	imports: [HlmInputDirective],
	template: `
		<input class="w-80" hlmInput type="file" />
	`,
})
export class InputFilePreviewComponent {}

export const fileCode = `
import { Component } from '@angular/core';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';

@Component({
  selector: 'spartan-input-file',
  standalone: true,
  imports: [HlmInputDirective],
  template: \`<input class="w-80" hlmInput type="file"/>\`,
})
export class InputFilePreviewComponent {}
`;
