import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';

@Component({
	selector: 'spartan-avatar-group-icon-preview',
	imports: [HlmAvatarImports, NgIcon],
	providers: [provideIcons({ lucidePlus })],
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
			<hlm-avatar-group-count>
				<ng-icon name="lucidePlus" />
			</hlm-avatar-group-count>
		</hlm-avatar-group>
	`,
})
export class AvatarGroupIconPreview {}
