import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMoreHorizontal } from '@ng-icons/lucide';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmSidebarImports, HlmSidebarService } from '@spartan-ng/helm/sidebar';
import { data } from '../../shared/sidebar/data';

@Component({
	selector: 'spartan-nav-main-dropdown',
	imports: [HlmSidebarImports, NgIcon, HlmDropdownMenuImports],
	providers: [provideIcons({ lucideMoreHorizontal })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-sidebar-group>
			<ul hlmSidebarMenu>
				@for (item of items; track item.title) {
					<li hlmSidebarMenuItem>
						<button
							hlmSidebarMenuButton
							[hlmDropdownMenuTrigger]="menu"
							[side]="_menuSide()"
							[align]="_menuAlign()"
							class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							{{ item.title }}
							<ng-icon name="lucideMoreHorizontal" class="ml-auto" />
						</button>
					</li>
				}
			</ul>
		</hlm-sidebar-group>

		<ng-template #menu>
			<hlm-dropdown-menu class="w-56 min-w-56 rounded-lg">
				<hlm-dropdown-menu-group>
					<hlm-dropdown-menu-label>Navigation</hlm-dropdown-menu-label>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-separator />
				<button hlmDropdownMenuItem>Documentation</button>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class NavMainDropdown {
	private readonly _sidebarService = inject(HlmSidebarService);
	protected readonly _menuSide = computed(() => (this._sidebarService.isMobile() ? 'bottom' : 'right'));
	protected readonly _menuAlign = computed(() => (this._sidebarService.isMobile() ? 'end' : 'start'));

	public readonly items = data.navMain;
}
