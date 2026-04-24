import { ChangeDetectionStrategy, Component } from '@angular/core';

import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';

@Component({
	selector: 'spartan-skeleton-avatar',
	imports: [HlmSkeletonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex w-fit items-center gap-4">
			<hlm-skeleton class="size-10 shrink-0 rounded-full" />
			<div class="grid gap-2">
				<hlm-skeleton class="h-4 w-[150px]" />
				<hlm-skeleton class="h-4 w-[100px]" />
			</div>
		</div>
	`,
})
export class SkeletonAvatar {}
