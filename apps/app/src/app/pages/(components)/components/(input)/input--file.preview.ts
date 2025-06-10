import { Component } from '@angular/core';
import { HlmInputDirective } from '@spartan-ng/helm/input';

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
import { HlmInputDirective } from '@spartan-ng/helm/input';

@Component({
  selector: 'spartan-input-file',
imports: [HlmInputDirective],
  template: \`<input class="w-80" hlmInput type="file"/>\`,
})
export class InputFilePreviewComponent {}
`;
