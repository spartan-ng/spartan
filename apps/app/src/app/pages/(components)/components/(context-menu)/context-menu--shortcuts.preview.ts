import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmContextMenuImports } from '@spartan-ng/helm/context-menu';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

@Component({
	selector: 'spartan-context-menu-shortcuts',
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
					<button hlmDropdownMenuItem>
						Back
						<hlm-dropdown-menu-shortcut>⌘[</hlm-dropdown-menu-shortcut>
					</button>
					<button hlmDropdownMenuItem disabled>
						Forward
						<hlm-dropdown-menu-shortcut>⌘]</hlm-dropdown-menu-shortcut>
					</button>
					<button hlmDropdownMenuItem>
						Reload
						<hlm-dropdown-menu-shortcut>⌘R</hlm-dropdown-menu-shortcut>
					</button>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-separator />
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>
						Save
						<hlm-dropdown-menu-shortcut>⌘S</hlm-dropdown-menu-shortcut>
					</button>
					<button hlmDropdownMenuItem>
						Save As...
						<hlm-dropdown-menu-shortcut>⇧⌘S</hlm-dropdown-menu-shortcut>
					</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class ContextMenuShortcuts {}
