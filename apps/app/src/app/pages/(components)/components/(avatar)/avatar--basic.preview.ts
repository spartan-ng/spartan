import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';

@Component({
	selector: 'spartan-avatar-basic-preview',
	imports: [HlmAvatarImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-avatar>
			<img hlmAvatarImage src="/assets/avatar.png" alt="@spartan-ui logo" class="grayscale" />
			<span hlmAvatarFallback>RG</span>
		</hlm-avatar>
	`,
})
export class AvatarBasicPreview {}
