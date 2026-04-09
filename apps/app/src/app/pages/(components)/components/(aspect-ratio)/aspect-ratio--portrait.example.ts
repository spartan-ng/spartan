import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmAspectRatioImports } from '@spartan-ng/helm/aspect-ratio';

@Component({
	selector: 'spartan-aspect-ratio-portrait',
	imports: [HlmAspectRatioImports, NgOptimizedImage],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex items-center justify-center h-72 w-full',
	},
	template: `
		<div [hlmAspectRatio]="9 / 16" class="w-full max-w-40 overflow-hidden">
			<img ngSrc="/assets/mountains.jpg" fill alt="Mountain views" class="rounded-lg object-cover" />
		</div>
	`,
})
export class AspectRatioPortrait {}
