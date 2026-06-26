import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

@Component({
	selector: 'spartan-alert-dialog-from-dropdown',
	imports: [HlmAlertDialogImports, HlmButtonImports, HlmDropdownMenuImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button hlmBtn variant="outline" [hlmDropdownMenuTrigger]="menu">Open Menu</button>

		<ng-template #menu>
			<hlm-dropdown-menu>
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>Edit</button>
					<button hlmDropdownMenuItem>Share</button>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-separator />
				<button hlmDropdownMenuItem [hlmAlertDialogTriggerFor]="deleteDialog">Delete</button>
			</hlm-dropdown-menu>
		</ng-template>

		<hlm-alert-dialog #deleteDialog="hlmAlertDialog">
			<hlm-alert-dialog-content *hlmAlertDialogPortal="let ctx">
				<hlm-alert-dialog-header>
					<h2 hlmAlertDialogTitle>Are you absolutely sure?</h2>
					<p hlmAlertDialogDescription>
						This action cannot be undone. This will permanently delete your account from our servers.
					</p>
				</hlm-alert-dialog-header>
				<hlm-alert-dialog-footer>
					<button hlmAlertDialogCancel>Cancel</button>
					<button hlmAlertDialogAction variant="destructive">Delete</button>
				</hlm-alert-dialog-footer>
			</hlm-alert-dialog-content>
		</hlm-alert-dialog>
	`,
})
export class AlertDialogFromDropdown {}
