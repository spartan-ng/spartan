import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';

@Component({
	selector: 'spartan-avatar-preview',
	imports: [HlmAvatarImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex flex-row flex-wrap items-center gap-6 md:gap-12">
			<hlm-avatar>
				<img
					hlmAvatarImage
					src="/assets/avatar.png"
					alt="spartan logo. Resembling a spartanic shield"
					class="grayscale"
				/>
				<span hlmAvatarFallback>RG</span>
			</hlm-avatar>
			<hlm-avatar>
				<img
					hlmAvatarImage
					src="/assets/avatar.png"
					alt="spartan logo. Resembling a spartanic shield"
					class="grayscale"
				/>
				<span hlmAvatarFallback>RG</span>
				<hlm-avatar-badge class="bg-red-600 dark:bg-red-800" />
			</hlm-avatar>
			<hlm-avatar-group class="grayscale">
				<hlm-avatar>
					<img hlmAvatarImage src="/assets/avatar.png" alt="spartan logo. Resembling a spartanic shield" />
					<span hlmAvatarFallback>RG</span>
				</hlm-avatar>
				<hlm-avatar>
					<img hlmAvatarImage src="/assets/avatar.png" alt="spartan logo. Resembling a spartanic shield" />
					<span hlmAvatarFallback>RG</span>
				</hlm-avatar>
				<hlm-avatar>
					<img hlmAvatarImage src="/assets/avatar.png" alt="spartan logo. Resembling a spartanic shield" />
					<span hlmAvatarFallback>RG</span>
				</hlm-avatar>
				<hlm-avatar-group-count>+3</hlm-avatar-group-count>
			</hlm-avatar-group>
		</div>
	`,
})
export class AvatarPreview {}

export const defaultImports = `
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
`;

export const defaultSkeleton = `
<hlm-avatar>
   <img hlmAvatarImage src='/assets/avatar.png' alt='spartan logo. Resembling a spartanic shield' />
   <span hlmAvatarFallback>RG</span>
</hlm-avatar>
`;
