import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmItemImports } from '@spartan-ng/helm/item';

@Component({
	selector: 'spartan-item-group-preview',
	imports: [HlmItemImports, HlmAvatarImports, HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucidePlus })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-md flex-col gap-6',
	},
	template: `
		<hlm-item-group>
			@for (person of _people; track person.username; let last = $last) {
				<hlm-item variant="outline">
					<hlm-item-media>
						<hlm-avatar>
							<img hlmAvatarImage [src]="person.avatar" [alt]="person.username" class="grayscale" />
							<span hlmAvatarFallback>{{ person.username.charAt(0).toUpperCase() }}</span>
						</hlm-avatar>
					</hlm-item-media>

					<hlm-item-content class="gap-1">
						<hlm-item-title>{{ person.username }}</hlm-item-title>
						<p hlmItemDescription>{{ person.email }}</p>
					</hlm-item-content>

					<hlm-item-actions>
						<button hlmBtn variant="ghost" size="icon" class="rounded-full">
							<ng-icon name="lucidePlus" />
						</button>
					</hlm-item-actions>
				</hlm-item>
			}
		</hlm-item-group>
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
