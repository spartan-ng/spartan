import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsis, lucideFolder, lucideForward, lucideStar, lucideTrash2 } from '@ng-icons/lucide';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmSidebarImports, HlmSidebarService } from '@spartan-ng/helm/sidebar';

@Component({
	selector: 'spartan-nav-favorites',
	imports: [HlmSidebarImports, NgIcon, HlmDropdownMenuImports],
	providers: [provideIcons({ lucideStar, lucideEllipsis, lucideFolder, lucideForward, lucideTrash2 })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-sidebar-group class="group-data-[collapsible=icon]:hidden">
			<div hlmSidebarGroupLabel>Favorites</div>
			<ul hlmSidebarMenu>
				@for (fav of favorites(); track fav.name) {
					<li hlmSidebarMenuItem>
						<a hlmSidebarMenuButton>
							<span>{{ fav.emoji }}</span>
							<span>{{ fav.name }}</span>
						</a>
						<button hlmSidebarMenuAction showOnHover [hlmDropdownMenuTrigger]="menu">
							<ng-icon name="lucideEllipsis" />
							<span class="sr-only">More</span>
						</button>
					</li>
				}
			</ul>
		</hlm-sidebar-group>

		<ng-template #menu>
			<hlm-dropdown-menu class="w-48 rounded-lg">
				<button hlmDropdownMenuItem>
					<ng-icon name="lucideStar" class="text-muted-foreground" />
					Remove from Favorites
				</button>
				<button hlmDropdownMenuItem>
					<ng-icon name="lucideFolder" class="text-muted-foreground" />
					Open in New Tab
				</button>
				<hlm-dropdown-menu-separator />
				<button hlmDropdownMenuItem>
					<ng-icon name="lucideTrash2" class="text-muted-foreground" />
					Delete
				</button>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class NavFavorites {
	private readonly _sidebarService = inject(HlmSidebarService);
	protected readonly _menuSide = computed(() => (this._sidebarService.isMobile() ? 'bottom' : 'right'));
	protected readonly _menuAlign = computed(() => (this._sidebarService.isMobile() ? 'end' : 'start'));

	public readonly favorites = input.required<{ emoji: string; name: string }[]>();
}
