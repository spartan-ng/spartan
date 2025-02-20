import { Component } from '@angular/core';
import { HlmSkeletonComponent } from '@spartan-ng/ui-skeleton-helm';

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

export const defaultCode = `
import { Component } from '@angular/core';
import { HlmSkeletonComponent } from '@spartan-ng/ui-skeleton-helm';

@Component({
  selector: 'spartan-skeleton-preview',
  standalone: true,
  imports: [HlmSkeletonComponent],
  template: \`
    <div class='flex items-center p-4 m-4 w-fit space-x-4'>
      <hlm-skeleton class='w-12 h-12 rounded-full' />
      <div class='space-y-2'>
        <hlm-skeleton class='h-4 w-[250px]' />
        <hlm-skeleton class='h-4 w-[200px]' />
      </div>
    </div>
  \`,
})
export class SkeletonPreviewComponent {}

`;

export const defaultImports = `
import { HlmSkeletonComponent } from '@spartan-ng/ui-skeleton-helm';
`;
export const defaultSkeleton = `
<hlm-skeleton class='h-4 w-[250px]' />
`;
