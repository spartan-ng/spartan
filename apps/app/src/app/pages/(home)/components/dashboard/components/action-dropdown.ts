import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideEllipsis } from '@ng-icons/lucide';
import { BrnMenuTrigger } from '@spartan-ng/brain/menu';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmMenu, HlmMenuGroup, HlmMenuItem, HlmMenuLabel, HlmMenuSeparator } from '@spartan-ng/helm/menu';
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import type { DashboardData } from './dashboard-data.model';

@Component({
	selector: 'spartan-action-dropdown-dashboard',
	imports: [
		HlmButton,
		NgIcon,
		HlmIcon,
		BrnMenuTrigger,
		HlmMenu,
		HlmMenuLabel,
		HlmMenuItem,
		HlmMenuSeparator,
		HlmMenuGroup,
	],
	providers: [provideIcons({ lucideEllipsis, lucideChevronRight })],
	template: `
		<button hlmBtn variant="ghost" class="h-6 w-6 p-0.5" align="end" [brnMenuTriggerFor]="menu">
			<ng-icon hlm size="sm" name="lucideEllipsis" />
		</button>
		<ng-template #menu>
			<hlm-menu>
				<hlm-menu-group>
					<button hlmMenuItem>Edit</button>
					<button hlmMenuItem>Make a copy</button>
					<button hlmMenuItem>Favorite</button>
				</hlm-menu-group>
				<hlm-menu-separator />
				<hlm-menu-group>
					<button hlmMenuItem>
						Delete
						<span class="ml-auto text-xs tracking-widest opacity-60">⌘⌫</span>
					</button>
				</hlm-menu-group>
			</hlm-menu>
		</ng-template>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionDropdown {
	private readonly _context = injectFlexRenderContext<CellContext<DashboardData, unknown>>();
	protected readonly _element = this._context.row.original;
}
