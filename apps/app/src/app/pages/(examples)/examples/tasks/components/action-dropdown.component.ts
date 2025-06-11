import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsis } from '@ng-icons/lucide';
import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import {
	HlmMenuComponent,
	HlmMenuGroupComponent,
	HlmMenuItemCheckboxDirective,
	HlmMenuItemDirective,
	HlmMenuItemRadioComponent,
	HlmMenuLabelComponent,
	HlmMenuSeparatorComponent,
} from '@spartan-ng/helm/menu';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import { Task } from '../services/tasks.models';

@Component({
	selector: 'spartan-action-dropdown',
	imports: [
		HlmButtonDirective,
		NgIcon,
		HlmIconDirective,
		BrnMenuTriggerDirective,
		HlmMenuComponent,
		HlmMenuLabelComponent,
		HlmMenuItemDirective,
		HlmMenuSeparatorComponent,
		HlmMenuGroupComponent,
		HlmMenuItemRadioComponent,
		HlmMenuItemCheckboxDirective,
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
					<button hlmMenuItemCheckbox [checked]="element.type === 'Bug'">
						<hlm-menu-item-radio />
						<span>Bug</span>
					</button>
					<button hlmMenuItemCheckbox [checked]="element.type === 'Feature'">
						<hlm-menu-item-radio />
						<span>Feature</span>
					</button>
					<button hlmMenuItemCheckbox [checked]="element.type === 'Documentation'">
						<hlm-menu-item-radio />
						<span>Documentation</span>
					</button>
				</hlm-menu-group>
			</hlm-menu>
		</ng-template>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionDropdownComponent {
	private readonly _context = injectFlexRenderContext<CellContext<Task, unknown>>();
	protected readonly element = this._context.row.original;
}
