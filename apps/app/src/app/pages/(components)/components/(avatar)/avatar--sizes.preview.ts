import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';

@Component({
	selector: 'spartan-avatar-sizes-preview',
	imports: [HlmAvatarImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex flex-wrap items-center gap-2 grayscale">
			<hlm-avatar size="sm">
				<img hlmAvatarImage src="/assets/avatar.png" alt="@spartan-ui logo" class="grayscale" />
				<span hlmAvatarFallback>RG</span>
			</hlm-avatar>
			<hlm-avatar>
				<img hlmAvatarImage src="/assets/avatar.png" alt="@spartan-ui logo" class="grayscale" />
				<span hlmAvatarFallback>RG</span>
			</hlm-avatar>
			<hlm-avatar size="lg">
				<img hlmAvatarImage src="/assets/avatar.png" alt="@spartan-ui logo" class="grayscale" />
				<span hlmAvatarFallback>RG</span>
			</hlm-avatar>
		</div>
	`,
})
export class AvatarSizesPreview {}
