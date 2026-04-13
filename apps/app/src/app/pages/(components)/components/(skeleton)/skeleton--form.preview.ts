import { ChangeDetectionStrategy, Component } from '@angular/core';

import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';

@Component({
	selector: 'spartan-skeleton-form',
	imports: [HlmSkeletonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'w-full max-w-xs',
	},
	template: `
		<div class="flex w-full max-w-xs flex-col gap-7">
			<div class="flex flex-col gap-3">
				<hlm-skeleton class="h-4 w-20" />
				<hlm-skeleton class="h-8 w-full" />
			</div>
			<div class="flex flex-col gap-3">
				<hlm-skeleton class="h-4 w-24" />
				<hlm-skeleton class="h-8 w-full" />
			</div>
			<hlm-skeleton class="h-8 w-24" />
		</div>
	`,
})
export class SkeletonForm {}
