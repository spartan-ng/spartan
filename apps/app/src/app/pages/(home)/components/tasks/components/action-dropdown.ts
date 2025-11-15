import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsis } from '@ng-icons/lucide';
import { BrnMenuTrigger } from '@spartan-ng/brain/menu';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import {
	HlmMenu,
	HlmMenuGroup,
	HlmMenuItem,
	HlmMenuItemCheckbox,
	HlmMenuItemRadioIndicator,
	HlmMenuLabel,
	HlmMenuSeparator,
} from '@spartan-ng/helm/menu';
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import type { Task } from '../services/tasks.models';

@Component({
	selector: 'spartan-action-dropdown-tasks',
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
		HlmMenuItemRadioIndicator,
		HlmMenuItemCheckbox,
	],
	providers: [provideIcons({ lucideEllipsis })],
	template: `
		<button hlmBtn variant="ghost" class="h-6 w-6 p-0.5" align="end" [brnMenuTriggerFor]="menu">
			<ng-icon hlm size="sm" name="lucideEllipsis" />
		</button>
		<ng-template #menu>
			<hlm-menu>
				<hlm-menu-label>Actions</hlm-menu-label>
				<hlm-menu-separator />
				<hlm-menu-group>
					<button hlmMenuItem>Edit</button>
					<button hlmMenuItem>Make a copy</button>
					<button hlmMenuItem>Favorite</button>
				</hlm-menu-group>
				<hlm-menu-separator />
				<hlm-menu-group>
					<button hlmMenuItem [brnMenuTriggerFor]="labels">
						Labels
						<ng-icon hlm name="lucideChevronRight" class="ml-auto" size="sm" />
					</button>
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
		<ng-template #labels>
			<hlm-menu>
				<hlm-menu-group>
					<button hlmMenuItemCheckbox [checked]="_element.type === 'Bug'">
						<hlm-menu-item-radio />
						<span>Bug</span>
					</button>
					<button hlmMenuItemCheckbox [checked]="_element.type === 'Feature'">
						<hlm-menu-item-radio />
						<span>Feature</span>
					</button>
					<button hlmMenuItemCheckbox [checked]="_element.type === 'Documentation'">
						<hlm-menu-item-radio />
						<span>Documentation</span>
					</button>
				</hlm-menu-group>
			</hlm-menu>
		</ng-template>
	`,
})
export class ActionDropdown {
	private readonly _context = injectFlexRenderContext<CellContext<Task, unknown>>();
	protected readonly _element = this._context.row.original;
}
