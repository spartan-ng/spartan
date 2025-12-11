import { Component, type OnInit } from '@angular/core';
import { HlmProgressImports } from '@spartan-ng/helm/progress';

@Component({
	selector: 'spartan-progress-preview',
	imports: [HlmProgressImports],
	template: `
		<hlm-progress class="w-80" [value]="value">
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
import { HlmProgressImports } from '@spartan-ng/helm/progress';
`;

export const defaultSkeleton = `
<hlm-progress value="33">
   <hlm-progress-indicator />
</hlm-progress>
`;
