import { Component } from '@angular/core';

import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';

@Component({
	selector: 'spartan-skeleton-card',
	imports: [HlmSkeletonImports],
	template: `
		<div class="flex flex-col space-y-3">
			<hlm-skeleton class="h-[125px] w-[250px] rounded-xl" />
			<div class="space-y-2">
				<hlm-skeleton class="h-4 w-[250px]" />
				<hlm-skeleton class="h-4 w-[200px]" />
			</div>
		</div>
	`,
})
export class SkeletonCard {}
