import { ChangeDetectionStrategy, Component } from '@angular/core';

import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';

@Component({
	selector: 'spartan-skeleton-text',
	imports: [HlmSkeletonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'w-full max-w-xs',
	},
	template: `
		<div class="flex w-full max-w-xs flex-col gap-2">
			<hlm-skeleton class="h-4 w-full" />
			<hlm-skeleton class="h-4 w-full" />
			<hlm-skeleton class="h-4 w-3/4" />
		</div>
	`,
})
export class SkeletonText {}
