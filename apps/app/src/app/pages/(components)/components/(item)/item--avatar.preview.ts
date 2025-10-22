import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmItemImports } from '@spartan-ng/helm/item';

@Component({
	selector: 'spartan-item-avatar-preview',
	imports: [HlmItemImports, HlmButtonImports, HlmAvatarImports, HlmIconImports],
	providers: [
		provideIcons({
			lucidePlus,
		}),
	],
	host: {
		class: 'flex w-full max-w-lg flex-col gap-6',
	},
	template: `
		<!-- Item 1: Evil Rabbit -->
		<div hlmItem variant="outline">
			<div hlmItemMedia>
				<hlm-avatar class="size-10">
					<img hlmAvatarImage src="https://github.com/evilrabbit.png" alt="Evil Rabbit" />
					<span hlmAvatarFallback>ER</span>
				</hlm-avatar>
			</div>
			<div hlmItemContent>
				<div hlmItemTitle>Evil Rabbit</div>
				<p hlmItemDescription>Last seen 5 months ago</p>
			</div>
			<div hlmItemActions>
				<button hlmBtn size="icon-sm" variant="outline" class="rounded-full" aria-label="Invite">
					<ng-icon hlm name="lucidePlus" />
				</button>
			</div>
		</div>

		<!-- Item 2: No Team Members -->
		<div hlmItem variant="outline">
			<div hlmItemMedia>
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
			</div>
			<div hlmItemContent>
				<div hlmItemTitle>No Team Members</div>
				<p hlmItemDescription>Invite your team to collaborate on this project.</p>
			</div>
			<div hlmItemActions>
				<button hlmBtn size="sm" variant="outline">Invite</button>
			</div>
		</div>
	`,
})
export class ItemAvatarPreview {}
