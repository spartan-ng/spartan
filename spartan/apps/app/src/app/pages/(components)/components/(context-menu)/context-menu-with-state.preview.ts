import { Component, signal } from '@angular/core';
import { HlmContextMenuImports } from '@spartan-ng/helm/context-menu';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

@Component({
	selector: 'spartan-context-menu-with-state',
	imports: [HlmDropdownMenuImports, HlmContextMenuImports],
	template: `
		<div
			align="start"
			side="right"
			[hlmContextMenuTriggerData]="{ $implicit: { data: 'Changes Saved' } }"
			[hlmContextMenuTrigger]="menu"
			class="border-border flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm"
		>
			Right click here
		</div>
		<div class="mt-2 text-center font-mono text-xs">{{ _pastedContent() }}</div>

		<ng-template #menu let-ctx>
			<hlm-dropdown-menu class="w-64">
				<hlm-dropdown-menu-group>
					<button (click)="_pastedContent.set(ctx.data)" inset hlmDropdownMenuItem>
						Save
						<hlm-dropdown-menu-shortcut>⌘S</hlm-dropdown-menu-shortcut>
					</button>
				</hlm-dropdown-menu-group>
				<button (click)="_pastedContent.set('Unsaved Changes')" inset hlmDropdownMenuItem>
					Back
					<hlm-dropdown-menu-shortcut>⌘[</hlm-dropdown-menu-shortcut>
				</button>

				<button disabled inset hlmDropdownMenuItem>
					Forward
					<hlm-dropdown-menu-shortcut>⌘]</hlm-dropdown-menu-shortcut>
				</button>

				<button disabled inset hlmDropdownMenuItem>
					Reload
					<hlm-dropdown-menu-shortcut>⌘R</hlm-dropdown-menu-shortcut>
				</button>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class ContextMenuPreviewWithState {
	protected readonly _pastedContent = signal('Unsaved Changes');
}
