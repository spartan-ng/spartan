import { Component } from '@angular/core';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
	selector: 'spartan-spinner-badge-preview',
	imports: [HlmSpinnerImports, HlmBadgeImports],
	template: `
		<div class="flex items-center gap-4 [--radius:1.2rem]">
			<span hlmBadge>
				<hlm-spinner />
				Syncing
			</span>
			<span hlmBadge variant="secondary">
				<hlm-spinner />
				Updating
			</span>
			<span hlmBadge variant="outline">
				<hlm-spinner />
				Processing
			</span>
		</div>
	`,
})
export class SpartanSpinnerBadgePreview {}
