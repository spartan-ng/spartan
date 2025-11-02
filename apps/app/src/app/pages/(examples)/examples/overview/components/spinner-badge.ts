import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmSpinner } from '@spartan-ng/helm/spinner';

@Component({
	selector: 'spartan-spinner-badge',
	imports: [HlmSpinner, HlmBadge],
	host: {
		class: 'flex items-center gap-2',
	},
	template: `
		<span hlmBadge class="rounded-full">
			<hlm-spinner class="size-3" />
			Loading
		</span>
		<span hlmBadge variant="secondary" class="rounded-full">
			<hlm-spinner class="size-3" />
			Syncing
		</span>
		<span hlmBadge variant="outline" class="rounded-full">
			<hlm-spinner class="size-3" />
			Updating
		</span>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerBadge {}
