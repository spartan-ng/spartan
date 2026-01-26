import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';

@Component({
	selector: 'spartan-avatar-badge-preview',
	imports: [HlmAvatarImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-avatar>
			<img hlmAvatarImage src="/assets/avatar.png" alt="@spartan-ui logo" />
			<span hlmAvatarFallback>RG</span>
			<hlm-avatar-badge class="bg-red-600 dark:bg-red-800" />
		</hlm-avatar>
	`,
})
export class AvatarBadgePreview {}
