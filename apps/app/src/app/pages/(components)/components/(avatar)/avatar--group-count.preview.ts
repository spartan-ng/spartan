import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';

@Component({
	selector: 'spartan-avatar-group-count-preview',
	imports: [HlmAvatarImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-avatar-group class="grayscale">
			<hlm-avatar>
				<img hlmAvatarImage src="/assets/avatar.png" alt="@spartan-ui logo" class="grayscale" />
				<span hlmAvatarFallback>RG</span>
			</hlm-avatar>
			<hlm-avatar>
				<img hlmAvatarImage src="/assets/avatar.png" alt="@spartan-ui logo" class="grayscale" />
				<span hlmAvatarFallback>RG</span>
			</hlm-avatar>
			<hlm-avatar>
				<img hlmAvatarImage src="/assets/avatar.png" alt="@spartan-ui logo" class="grayscale" />
				<span hlmAvatarFallback>RG</span>
			</hlm-avatar>
			<hlm-avatar-group-count>+3</hlm-avatar-group-count>
		</hlm-avatar-group>
	`,
})
export class AvatarGroupCountPreview {}
