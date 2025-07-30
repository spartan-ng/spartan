import { Component, type OnInit } from '@angular/core';
import { BrnProgress, BrnProgressIndicator } from '@spartan-ng/brain/progress';
import { HlmProgress, HlmProgressIndicator } from '@spartan-ng/helm/progress';

@Component({
	selector: 'spartan-progress-preview',
	imports: [BrnProgress, BrnProgressIndicator, HlmProgressIndicator, HlmProgress],
	template: `
		<brn-progress hlm class="w-80" aria-labelledby="loading" [value]="value">
			<brn-progress-indicator hlm />
		</brn-progress>
	`,
})
export class ProgressPreview implements OnInit {
	public value = 15;

	ngOnInit() {
		setTimeout(() => (this.value = 65), 2000);
	}
}

export const defaultImports = `
import {
  BrnProgress
  BrnProgressIndicator
} from '@spartan-ng/brain/progress';
import { HlmProgressDirective, HlmProgressIndicatorDirective } from '@spartan-ng/helm/progress';
`;
export const defaultSkeleton = `
<brn-progress hlm [value]="value">
   <brn-progress-indicator hlm />
</brn-progress>
`;
