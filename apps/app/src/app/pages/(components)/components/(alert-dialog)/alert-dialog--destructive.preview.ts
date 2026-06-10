import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrash2 } from '@ng-icons/lucide';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-alert-dialog-destructive',
	imports: [HlmAlertDialogImports, HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideTrash2 })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-alert-dialog>
			<button hlmAlertDialogTrigger hlmBtn variant="destructive">Delete Chat</button>
			<hlm-alert-dialog-content *hlmAlertDialogPortal="let ctx" size="sm">
				<hlm-alert-dialog-header>
					<hlm-alert-dialog-media
						class="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive"
					>
						<ng-icon name="lucideTrash2" />
					</hlm-alert-dialog-media>
					<h2 hlmAlertDialogTitle>Delete chat?</h2>
					<p hlmAlertDialogDescription>
						This will permanently delete this chat conversation. View
						<a href="#">Settings</a>
						delete any memories saved during this chat.
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
export class AlertDialogDestructive {}
