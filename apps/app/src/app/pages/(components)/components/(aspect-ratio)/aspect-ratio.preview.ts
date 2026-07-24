import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmAspectRatioImports } from '@spartan-ng/helm/aspect-ratio';

@Component({
	selector: 'spartan-aspect-ratio-preview',
	imports: [HlmAspectRatioImports, NgOptimizedImage],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex items-center justify-center h-72 w-full',
	},
	template: `
		<div [hlmAspectRatio]="16 / 9" class="w-full max-w-sm overflow-hidden">
			<img ngSrc="/assets/mountains.jpg" fill alt="Mountain views" class="rounded-lg object-cover" />
		</div>
	`,
})
export class AspectRatioPreview {}

export const defaultImports = `
import { HlmAspectRatioImports } from '@spartan-ng/helm/aspect-ratio';
`;

export const defaultSkeleton = `
  <div [hlmAspectRatio]="16 / 9">
    <img src="..." alt="Image" class="rounded-md object-cover"  />
  </div>
`;
