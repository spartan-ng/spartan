import { Component, signal } from '@angular/core';
import { BrnMenuImports } from '@spartan-ng/brain/menu';
import { HlmMenuImports } from '@spartan-ng/helm/menu';

@Component({
	selector: 'spartan-context-menu-with-state',
	imports: [BrnMenuImports, HlmMenuImports],
	template: `
		<div
			align="start"
			side="right"
			[brnCtxMenuTriggerData]="{ $implicit: { data: 'Changes Saved' } }"
			[brnCtxMenuTriggerFor]="menu"
			class="border-border flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm"
		>
			Right click here
		</div>
		<div class="mt-2 text-center font-mono text-xs">{{ _pastedContent() }}</div>

		<ng-template #menu let-ctx>
			<hlm-menu class="w-64">
				<hlm-menu-group>
					<button (click)="_pastedContent.set(ctx.data)" inset hlmMenuItem>
						Save
						<hlm-menu-shortcut>⌘S</hlm-menu-shortcut>
					</button>
				</hlm-menu-group>
				<button (click)="_pastedContent.set('Unsaved Changes')" inset hlmMenuItem>
					Back
					<hlm-menu-shortcut>⌘[</hlm-menu-shortcut>
				</button>

				<button disabled inset hlmMenuItem>
					Forward
					<hlm-menu-shortcut>⌘]</hlm-menu-shortcut>
				</button>

				<button disabled inset hlmMenuItem>
					Reload
					<hlm-menu-shortcut>⌘R</hlm-menu-shortcut>
				</button>
			</hlm-menu>
		</ng-template>
	`,
})
export class ContextMenuPreviewWithState {
	protected readonly _pastedContent = signal('Unsaved Changes');
}
