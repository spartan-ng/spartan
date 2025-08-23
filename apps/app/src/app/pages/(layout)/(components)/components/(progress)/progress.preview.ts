import { Component, type OnInit } from '@angular/core';
import { HlmProgress, HlmProgressIndicator } from '@spartan-ng/helm/progress';

@Component({
	selector: 'spartan-progress-preview',
	imports: [HlmProgressIndicator, HlmProgress],
	template: `
		<hlm-progress class="w-80" aria-labelledby="loading" [value]="value">
			<hlm-progress-indicator />
		</hlm-progress>
	`,
})
export class ProgressPreview implements OnInit {
	public value = 15;

	ngOnInit() {
		setTimeout(() => (this.value = 65), 2000);
	}
}

export const defaultImports = `
import { HlmProgress, HlmProgressIndicator } from '@spartan-ng/helm/progress';
`;

export const defaultSkeleton = `
<hlm-progress [value]="value">
   <hlm-progress-indicator />
</hlm-progress>
`;
