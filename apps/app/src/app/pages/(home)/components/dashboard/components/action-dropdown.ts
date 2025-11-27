import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideEllipsis } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import type { DashboardData } from './dashboard-data.model';

@Component({
	selector: 'spartan-action-dropdown-dashboard',
	imports: [HlmButton, NgIcon, HlmIcon, HlmDropdownMenuImports],
	providers: [provideIcons({ lucideEllipsis, lucideChevronRight })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button hlmBtn variant="ghost" class="h-6 w-6 p-0.5" align="end" [hlmDropdownMenuTrigger]="menu">
			<ng-icon hlm size="sm" name="lucideEllipsis" />
		</button>
		<ng-template #menu>
			<hlm-dropdown-menu>
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>Edit</button>
					<button hlmDropdownMenuItem>Make a copy</button>
					<button hlmDropdownMenuItem>Favorite</button>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-separator />
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>
						Delete
						<span class="ml-auto text-xs tracking-widest opacity-60">⌘⌫</span>
					</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class ActionDropdown {
	private readonly _context = injectFlexRenderContext<CellContext<DashboardData, unknown>>();
	protected readonly _element = this._context.row.original;
}
