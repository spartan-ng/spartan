import { Component } from '@angular/core';
import { BrnDialogImports } from '@spartan-ng/brain/dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmContextMenuImports } from '@spartan-ng/helm/context-menu';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

@Component({
	selector: 'spartan-dialog-context-menu',
	imports: [BrnDialogImports, HlmDialogImports, HlmButtonImports, HlmDropdownMenuImports, HlmContextMenuImports],
	template: `
		<div
			[hlmContextMenuTrigger]="menu"
			class="border-border flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm"
		>
			Right click here
		</div>

		<ng-template #menu>
			<hlm-dropdown-menu class="w-64">
				<hlm-dropdown-menu-group>
					<button inset hlmDropdownMenuItem>
						Save
						<hlm-dropdown-menu-shortcut>⌘S</hlm-dropdown-menu-shortcut>
					</button>

					<button disabled inset hlmDropdownMenuItem>
						Archive
						<hlm-dropdown-menu-shortcut>⌘A</hlm-dropdown-menu-shortcut>
					</button>

					<hlm-dialog>
						<button hlmDropdownMenuItem inset="true" hlmDialogTrigger>
							Print
							<hlm-dropdown-menu-shortcut>⌘P</hlm-dropdown-menu-shortcut>
						</button>
						<hlm-dialog-content class="sm:max-w-[425px]" *brnDialogContent="let ctx">
							<hlm-dialog-header>
								<h3 hlmDialogTitle>Print this page</h3>
								<p hlmDialogDescription>
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
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class DialogContextMenuPreview {}
