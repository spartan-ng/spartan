import { Component } from '@angular/core';
import { HlmProgress, HlmProgressIndicator } from '@spartan-ng/helm/progress';

@Component({
	selector: 'spartan-progress-indeterminate',
	imports: [HlmProgressIndicator, HlmProgress],
	template: `
		<hlm-progress class="w-80">
			<hlm-progress-indicator />
		</hlm-progress>
	`,
})
export class ProgressIndeterminatePreview {}
