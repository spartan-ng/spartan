import { Component } from '@angular/core';
import { HlmSkeletonComponent } from '@spartan-ng/helm/skeleton';

@Component({
	selector: 'spartan-skeleton-preview',
	imports: [HlmSkeletonComponent],
	template: `
		<div class="flex items-center space-x-4">
			<hlm-skeleton class="size-12 rounded-full" />
			<div class="space-y-2">
				<hlm-skeleton class="h-4 w-[250px]" />
				<hlm-skeleton class="h-4 w-[200px]" />
			</div>
		</div>
	`,
})
export class SkeletonPreviewComponent {}

export const defaultImports = `
import { HlmSkeletonComponent } from '@spartan-ng/helm/skeleton';
`;
export const defaultSkeleton = `
<hlm-skeleton class="h-[20px] w-[100px] rounded-full" />
`;
