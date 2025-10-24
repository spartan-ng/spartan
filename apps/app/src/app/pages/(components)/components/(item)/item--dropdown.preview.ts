import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { BrnMenuImports } from '@spartan-ng/brain/menu';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmMenuImports } from '@spartan-ng/helm/menu';

@Component({
	selector: 'spartan-item-dropdown-preview',
	imports: [HlmItemImports, HlmButtonImports, HlmAvatarImports, HlmIconImports, BrnMenuImports, HlmMenuImports],
	providers: [
		provideIcons({
			lucideChevronDown,
		}),
	],
	host: {
		class: 'flex min-h-64 w-full max-w-md flex-col items-center gap-6',
	},
	template: `
		<button hlmBtn variant="outline" size="sm" [brnMenuTriggerFor]="people" class="w-fit" align="end">
			Select
			<ng-icon hlm name="lucideChevronDown" />
		</button>

		<ng-template #people>
			<hlm-menu class="w-72 [--radius:0.65rem]">
				@for (person of _people; track person.email) {
					<div hlmMenuItem class="p-0">
						<div hlmItem size="sm" class="w-full p-2">
							<div hlmItemMedia>
								<hlm-avatar class="size-8">
									<img hlmAvatarImage [src]="person.avatar" [alt]="person.username" class="grayscale" />
									<span hlmAvatarFallback>
										{{ person.username.charAt(0).toUpperCase() }}
									</span>
								</hlm-avatar>
							</div>
							<div hlmItemContent class="gap-0.5">
								<div hlmItemTitle>{{ person.username }}</div>
								<p hlmItemDescription>{{ person.email }}</p>
							</div>
						</div>
					</div>
				}
			</hlm-menu>
		</ng-template>
	`,
})
export class ItemDropdownPreview {
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
