import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';

@Component({
	selector: 'spartan-avatar-ng-optimized-image-preview',
	imports: [HlmAvatarImports, NgOptimizedImage],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-avatar>
			<img hlmAvatarImage ngSrc="/assets/avatar.png" fill alt="@spartan-ui logo" class="grayscale" />
			<span hlmAvatarFallback>RG</span>
		</hlm-avatar>
	`,
})
export class AvatarNgOptimizedImagePreview {}
