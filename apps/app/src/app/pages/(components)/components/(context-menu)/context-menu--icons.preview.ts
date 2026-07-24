import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideClipboardPaste, lucideCopy, lucideScissors, lucideTrash } from '@ng-icons/lucide';
import { HlmContextMenuImports } from '@spartan-ng/helm/context-menu';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

@Component({
	selector: 'spartan-context-menu-icons',
	imports: [HlmDropdownMenuImports, HlmContextMenuImports, NgIcon],
	providers: [provideIcons({ lucideCopy, lucideClipboardPaste, lucideScissors, lucideTrash })],
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
						<ng-icon name="lucideCopy" />
						Copy
					</button>
					<button hlmDropdownMenuItem>
						<ng-icon name="lucideScissors" />
						Cut
					</button>
					<button hlmDropdownMenuItem>
						<ng-icon name="lucideClipboardPaste" />
						Paste
					</button>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-separator />
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem variant="destructive">
						<ng-icon name="lucideTrash" />
						Delete
					</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class ContextMenuIcons {}
