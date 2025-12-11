import { Component } from '@angular/core';
import { HlmProgressImports } from '@spartan-ng/helm/progress';

@Component({
	selector: 'spartan-progress-indeterminate',
	imports: [HlmProgressImports],
	template: `
		<hlm-progress class="w-80">
			<hlm-progress-indicator />
		</hlm-progress>
	`,
})
export class ProgressIndeterminatePreview {}
