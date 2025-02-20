import { Component } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { BrnContextMenuTriggerDirective, BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import {
	HlmMenuComponent,
	HlmMenuGroupComponent,
	HlmMenuItemCheckComponent,
	HlmMenuItemCheckboxDirective,
	HlmMenuItemDirective,
	HlmMenuItemIconDirective,
	HlmMenuItemRadioComponent,
	HlmMenuItemRadioDirective,
	HlmMenuItemSubIndicatorComponent,
	HlmMenuLabelComponent,
	HlmMenuSeparatorComponent,
	HlmMenuShortcutComponent,
	HlmSubMenuComponent,
} from '@spartan-ng/ui-menu-helm';

@Component({
	selector: 'spartan-context-menu-with-state',
	imports: [
		BrnMenuTriggerDirective,
		BrnContextMenuTriggerDirective,
		HlmMenuComponent,
		HlmSubMenuComponent,
		HlmMenuItemDirective,
		HlmMenuItemSubIndicatorComponent,
		HlmMenuLabelComponent,
		HlmMenuShortcutComponent,
		HlmMenuSeparatorComponent,
		HlmMenuItemIconDirective,
		HlmMenuItemCheckComponent,
		HlmMenuItemRadioComponent,
		HlmMenuGroupComponent,
		HlmButtonDirective,
		NgIcon,
		HlmIconDirective,
		HlmMenuItemCheckboxDirective,
		HlmMenuItemRadioDirective,
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
