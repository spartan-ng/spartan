import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';

@Component({
	selector: 'spartan-avatar-badge-icon-preview',
	imports: [HlmAvatarImports, NgIcon],
	providers: [provideIcons({ lucidePlus })],

	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-avatar class="grayscale">
			<img hlmAvatarImage src="/assets/avatar.png" alt="@spartan-ui logo" />
			<span hlmAvatarFallback>RG</span>
			<hlm-avatar-badge>
				<ng-icon name="lucidePlus" />
			</hlm-avatar-badge>
		</hlm-avatar>
	`,
})
export class AvatarBadgeIconPreview {}
