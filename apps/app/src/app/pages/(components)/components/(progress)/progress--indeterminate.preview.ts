import { Component } from '@angular/core';
import { BrnProgress, BrnProgressIndicator } from '@spartan-ng/brain/progress';
import { HlmProgress, HlmProgressIndicator } from '@spartan-ng/helm/progress';

@Component({
	selector: 'spartan-progress-indeterminate',
	imports: [BrnProgress, BrnProgressIndicator, HlmProgressIndicator, HlmProgress],
	template: `
		<brn-progress class="w-80" hlm aria-labelledby="loading">
			<brn-progress-indicator hlm />
		</brn-progress>
	`,
})
export class ProgressIndeterminatePreview {}
