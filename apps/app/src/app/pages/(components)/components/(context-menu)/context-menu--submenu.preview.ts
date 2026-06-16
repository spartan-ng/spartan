import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmContextMenuImports } from '@spartan-ng/helm/context-menu';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

@Component({
	selector: 'spartan-context-menu-submenu',
	imports: [HlmDropdownMenuImports, HlmContextMenuImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div
			[hlmContextMenuTrigger]="menu"
			align="start"
			side="right"
			class="flex aspect-video w-full min-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
		>
			<span class="hidden pointer-fine:inline-block">Right click here</span>
			<span class="hidden pointer-coarse:inline-block">Long press here</span>
		</div>

		<ng-template #menu>
			<hlm-dropdown-menu>
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>Copy</button>
					<button hlmDropdownMenuItem disabled>Cut</button>
					<button hlmDropdownMenuItem [hlmDropdownMenuSubTrigger]="moreTools" align="start" side="right">
						More Tools
						<hlm-dropdown-menu-item-sub-indicator />
					</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu>
		</ng-template>

		<ng-template #moreTools>
			<hlm-dropdown-menu-sub class="w-44">
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>Save Page...</button>
					<button hlmDropdownMenuItem>Create Shortcut...</button>
					<button hlmDropdownMenuItem>Name Window...</button>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-separator />
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>Developer Tools</button>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-separator />
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem variant="destructive">Delete</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu-sub>
		</ng-template>
	`,
})
export class ContextMenuSubmenu {}
