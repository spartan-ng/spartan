import { ChangeDetectionStrategy, Component } from '@angular/core';

import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';

@Component({
	selector: 'spartan-skeleton-table',
	imports: [HlmSkeletonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'w-full max-w-xs',
	},
	template: `
		<div class="flex w-full max-w-sm flex-col gap-2">
			@for (row of _rows; track $index) {
				<div class="flex gap-4">
					<hlm-skeleton class="h-4 flex-1" />
					<hlm-skeleton class="h-4 w-24" />
					<hlm-skeleton class="h-4 w-20" />
				</div>
			}
		</div>
	`,
})
export class SkeletonTable {
	protected readonly _rows = Array.from({ length: 5 });
}
