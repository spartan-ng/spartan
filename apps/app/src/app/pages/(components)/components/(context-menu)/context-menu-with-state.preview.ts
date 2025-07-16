import { Component } from '@angular/core';

import { BrnContextMenuTrigger } from '@spartan-ng/brain/menu';

import { HlmMenu, HlmMenuGroup, HlmMenuItem, HlmMenuShortcut } from '@spartan-ng/helm/menu';

@Component({
	selector: 'spartan-context-menu-with-state',
	imports: [BrnContextMenuTrigger, HlmMenu, HlmMenuItem, HlmMenuShortcut, HlmMenuGroup],
	template: `
		<div
			[brnCtxMenuTriggerData]="{ $implicit: { data: 'SomeValue' } }"
			[brnCtxMenuTriggerFor]="menu"
			class="border-border flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm"
		>
			Right click here
		</div>

		<ng-template #menu let-ctx>
			<hlm-menu class="w-64">
				<hlm-menu-group>
					<button inset hlmMenuItem>
						{{ ctx.data }}
						<hlm-menu-shortcut>⌘S</hlm-menu-shortcut>
					</button>
				</hlm-menu-group>
				<button inset hlmMenuItem>
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
export class ContextMenuPreviewWithState {}
