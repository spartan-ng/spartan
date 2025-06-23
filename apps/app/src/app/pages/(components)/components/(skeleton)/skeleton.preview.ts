import { Component } from '@angular/core';
import { HlmSkeletonComponent } from '@spartan-ng/helm/skeleton';

@Component({
	selector: 'spartan-skeleton-preview',
	imports: [HlmSkeletonComponent],
	template: `
		<div class="m-4 flex w-fit items-center space-x-4 p-4">
			<hlm-skeleton class="h-12 w-12 rounded-full" />
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
<hlm-skeleton class='h-4 w-[250px]' />
`;
