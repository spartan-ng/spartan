import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmItemImports } from '@spartan-ng/helm/item';

@Component({
	selector: 'spartan-item-dropdown-preview',
	imports: [HlmItemImports, HlmButtonImports, HlmAvatarImports, NgIcon, HlmDropdownMenuImports],
	providers: [provideIcons({ lucideChevronDown })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex min-h-64 w-full max-w-md flex-col items-center gap-6',
	},
	template: `
		<button hlmBtn variant="outline" [hlmDropdownMenuTrigger]="people" align="end">
			Select
			<ng-icon name="lucideChevronDown" />
		</button>

		<ng-template #people>
			<hlm-dropdown-menu class="w-48">
				@for (person of _people; track person.email) {
					<hlm-dropdown-menu-item class="p-0">
						<hlm-item size="xs" class="w-full p-2">
							<hlm-item-media>
								<hlm-avatar class="size-6.5">
									<img hlmAvatarImage [src]="person.avatar" [alt]="person.username" class="grayscale" />
									<span hlmAvatarFallback>
										{{ person.username.charAt(0).toUpperCase() }}
									</span>
								</hlm-avatar>
							</hlm-item-media>
							<hlm-item-content class="gap-0">
								<hlm-item-title>{{ person.username }}</hlm-item-title>
								<p hlmItemDescription class="leading-none">{{ person.email }}</p>
							</hlm-item-content>
						</hlm-item>
					</hlm-dropdown-menu-item>
				}
			</hlm-dropdown-menu>
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
