import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';

import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';

@Component({
	selector: 'spartan-skeleton-card',
	imports: [HlmSkeletonImports, HlmCardImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'w-full max-w-xs',
	},
	template: `
		<hlm-card class="w-full max-w-xs">
			<hlm-card-header>
				<hlm-skeleton class="h-4 w-2/3" />
				<hlm-skeleton class="h-4 w-1/2" />
			</hlm-card-header>
			<div hlmCardContent>
				<hlm-skeleton class="aspect-video w-full" />
			</div>
		</hlm-card>
	`,
})
export class SkeletonCard {}
