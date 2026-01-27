import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
	selector: 'spartan-badge-spinner-preview',
	imports: [HlmBadgeImports, HlmSpinnerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex w-full flex-wrap justify-center gap-2">
			<span hlmBadge variant="secondary">
				<hlm-spinner class="text-xs" />
				Verified
			</span>
			<span hlmBadge variant="outline">
				Bookmark
				<hlm-spinner class="text-xs" />
			</span>
		</div>
	`,
})
export class BadgeSpinnerPreview {}
