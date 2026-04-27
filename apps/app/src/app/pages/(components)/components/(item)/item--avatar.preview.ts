import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmItemImports } from '@spartan-ng/helm/item';

@Component({
	selector: 'spartan-item-avatar-preview',
	imports: [HlmItemImports, HlmButtonImports, HlmAvatarImports, NgIcon],
	providers: [provideIcons({ lucidePlus })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-lg flex-col gap-6',
	},
	template: `
		<hlm-item variant="outline">
			<hlm-item-media>
				<hlm-avatar class="size-10">
					<img hlmAvatarImage src="https://github.com/evilrabbit.png" alt="Evil Rabbit" />
					<span hlmAvatarFallback>ER</span>
				</hlm-avatar>
			</hlm-item-media>
			<hlm-item-content>
				<hlm-item-title>Evil Rabbit</hlm-item-title>
				<p hlmItemDescription>Last seen 5 months ago</p>
			</hlm-item-content>
			<hlm-item-actions>
				<button hlmBtn size="icon-sm" variant="outline" class="rounded-full" aria-label="Invite">
					<ng-icon name="lucidePlus" />
				</button>
			</hlm-item-actions>
		</hlm-item>

		<hlm-item variant="outline">
			<hlm-item-media>
				<div
					class="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale"
				>
					<hlm-avatar class="hidden sm:flex">
						<img hlmAvatarImage src="https://github.com/spartan-ng.png" alt="@spartan-ng" />
						<span hlmAvatarFallback>CN</span>
					</hlm-avatar>
					<hlm-avatar class="hidden sm:flex">
						<img hlmAvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
						<span hlmAvatarFallback>LR</span>
					</hlm-avatar>
					<hlm-avatar>
						<img hlmAvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
						<span hlmAvatarFallback>ER</span>
					</hlm-avatar>
				</div>
			</hlm-item-media>
			<hlm-item-content>
				<hlm-item-title>No Team Members</hlm-item-title>
				<p hlmItemDescription>Invite your team to collaborate on this project.</p>
			</hlm-item-content>
			<hlm-item-actions>
				<button hlmBtn size="sm" variant="outline">Invite</button>
			</hlm-item-actions>
		</hlm-item>
	`,
})
export class ItemAvatarPreview {}
