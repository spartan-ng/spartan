import { Component } from '@angular/core';
import { BrnDialogContentDirective, BrnDialogTriggerDirective } from '@spartan-ng/brain/dialog';
import { BrnContextMenuTriggerDirective } from '@spartan-ng/brain/menu';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import {
	HlmDialogComponent,
	HlmDialogContentComponent,
	HlmDialogFooterComponent,
	HlmDialogHeaderComponent,
} from '@spartan-ng/helm/dialog';

import {
	HlmMenuComponent,
	HlmMenuGroupComponent,
	HlmMenuItemDirective,
	HlmMenuShortcutComponent,
} from '@spartan-ng/helm/menu';

@Component({
	selector: 'spartan-dialog-context-menu',
	imports: [
		BrnDialogTriggerDirective,
		BrnDialogContentDirective,
		HlmDialogContentComponent,
		HlmDialogComponent,
		HlmDialogHeaderComponent,
		HlmDialogFooterComponent,
		HlmButtonDirective,
		BrnContextMenuTriggerDirective,
		HlmMenuItemDirective,
		HlmMenuShortcutComponent,
		HlmMenuComponent,
		HlmMenuGroupComponent,
	],
	template: `
		<div
			[brnCtxMenuTriggerFor]="menu"
			class="border-border flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm"
		>
			Right click here
		</div>

		<ng-template #menu>
			<hlm-menu class="w-64">
				<hlm-menu-group>
					<button inset hlmMenuItem>
						Save
						<hlm-menu-shortcut>⌘S</hlm-menu-shortcut>
					</button>

					<button disabled inset hlmMenuItem>
						Archive
						<hlm-menu-shortcut>⌘A</hlm-menu-shortcut>
					</button>

					<hlm-dialog>
						<button hlmMenuItem inset="true" brnDialogTrigger>
							Print
							<hlm-menu-shortcut>⌘P</hlm-menu-shortcut>
						</button>
						<hlm-dialog-content *brnDialogContent="let ctx">
							<hlm-dialog-header>
								<h3 brnDialogTitle hlm>Print this page</h3>
								<p brnDialogDescription hlm>
									Are you sure you want to print this page? Only print if absolutely necessary! The less we print, the
									less paper we need, the better it is for our environment!
								</p>
							</hlm-dialog-header>
							<hlm-dialog-footer>
								<button hlmBtn variant="ghost" (click)="ctx.close()">Cancel</button>
								<button hlmBtn>Print</button>
							</hlm-dialog-footer>
						</hlm-dialog-content>
					</hlm-dialog>
				</hlm-menu-group>
			</hlm-menu>
		</ng-template>
	`,
})
export class DialogContextMenuPreviewComponent {}
