import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmItemImports } from '@spartan-ng/helm/item';

@Component({
	selector: 'spartan-item-group-preview',
	imports: [HlmItemImports, HlmButtonImports, HlmIconImports, HlmAvatarImports],
	providers: [
		provideIcons({
			lucidePlus,
		}),
	],
	host: {
		class: 'flex w-full max-w-md flex-col gap-6',
	},
	template: `
		<div hlmItemGroup>
			@for (person of _people; track person.username; let last = $last) {
				<div hlmItem>
					<div hlmItemMedia>
						<hlm-avatar>
							<img hlmAvatarImage [src]="person.avatar" [alt]="person.username" class="grayscale" />
							<span hlmAvatarFallback>{{ person.username.charAt(0).toUpperCase() }}</span>
						</hlm-avatar>
					</div>

					<div hlmItemContent class="gap-1">
						<div hlmItemTitle>{{ person.username }}</div>
						<p hlmItemDescription>{{ person.email }}</p>
					</div>

					<div hlmItemActions>
						<button hlmBtn variant="ghost" size="icon" class="rounded-full">
							<ng-icon hlm name="lucidePlus" />
						</button>
					</div>
				</div>

				@if (!last) {
					<div hlmItemSeparator></div>
				}
			}
		</div>
	`,
})
export class ItemGroupPreview {
	protected readonly _people = [
		{
			username: 'spartan-ng',
			avatar: 'https://github.com/spartan-ng.png',
			email: 'spartan@ng.com',
		},
		{
			username: 'maxleiter',
			avatar: 'https://github.com/maxleiter.png',
			email: 'maxleiter@vercel.com',
		},
		{
			username: 'evilrabbit',
			avatar: 'https://github.com/evilrabbit.png',
			email: 'evilrabbit@vercel.com',
		},
	];
}
``;
