import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmSpinner } from '@spartan-ng/helm/spinner';

@Component({
	selector: 'spartan-spinner-badge',
	imports: [HlmSpinner, HlmBadge],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex items-center gap-2',
	},
	template: `
		<span hlmBadge>
			<hlm-spinner class="text-xs" />
			Loading
		</span>
		<span hlmBadge variant="secondary">
			<hlm-spinner class="text-xs" />
			Syncing
		</span>
		<span hlmBadge variant="outline">
			<hlm-spinner class="text-xs" />
			Updating
		</span>
	`,
})
export class SpinnerBadge {}
