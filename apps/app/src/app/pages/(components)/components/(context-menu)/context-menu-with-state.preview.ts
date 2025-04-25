import { Component } from '@angular/core';

import { BrnContextMenuTriggerDirective } from '@spartan-ng/brain/menu';

import {
	HlmMenuComponent,
	HlmMenuGroupComponent,
	HlmMenuItemDirective,
	HlmMenuShortcutComponent,
} from '@spartan-ng/ui-menu-helm';

@Component({
	selector: 'spartan-context-menu-with-state',
	imports: [
		BrnContextMenuTriggerDirective,
		HlmMenuComponent,
		HlmMenuItemDirective,
		HlmMenuShortcutComponent,
		HlmMenuGroupComponent,
	],
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
export class ContextMenuPreviewWithStateComponent {}

export const defaultCodeWithState = `
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
`;
