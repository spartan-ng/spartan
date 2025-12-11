import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsis } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import type { Task } from '../services/tasks.models';

@Component({
	selector: 'spartan-action-dropdown-tasks',
	imports: [HlmButton, NgIcon, HlmIcon, HlmDropdownMenuImports],
	providers: [provideIcons({ lucideEllipsis })],
	template: `
		<button hlmBtn variant="ghost" class="h-6 w-6 p-0.5" align="end" [hlmDropdownMenuTrigger]="menu">
			<ng-icon hlm size="sm" name="lucideEllipsis" />
		</button>
		<ng-template #menu>
			<hlm-dropdown-menu>
				<hlm-dropdown-menu-label>Actions</hlm-dropdown-menu-label>
				<hlm-dropdown-menu-separator />
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>Edit</button>
					<button hlmDropdownMenuItem>Make a copy</button>
					<button hlmDropdownMenuItem>Favorite</button>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-separator />
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem [hlmDropdownMenuTrigger]="labels" side="left" align="end">
						Labels
						<ng-icon hlm name="lucideChevronRight" class="ml-auto" size="sm" />
					</button>
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
		<ng-template #labels>
			<hlm-dropdown-menu>
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuCheckbox [checked]="_element.type === 'Bug'">
						<hlm-dropdown-menu-radio-indicator />
						<span>Bug</span>
					</button>
					<button hlmDropdownMenuCheckbox [checked]="_element.type === 'Feature'">
						<hlm-dropdown-menu-radio-indicator />
						<span>Feature</span>
					</button>
					<button hlmDropdownMenuCheckbox [checked]="_element.type === 'Documentation'">
						<hlm-dropdown-menu-radio-indicator />
						<span>Documentation</span>
					</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class ActionDropdown {
	private readonly _context = injectFlexRenderContext<CellContext<Task, unknown>>();
	protected readonly _element = this._context.row.original;
}
