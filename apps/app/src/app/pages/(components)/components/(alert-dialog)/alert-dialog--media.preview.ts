import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleFadingPlus } from '@ng-icons/lucide';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-alert-dialog-media',
	imports: [HlmAlertDialogImports, HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideCircleFadingPlus })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-alert-dialog>
			<button hlmAlertDialogTrigger hlmBtn variant="outline">Share Project</button>
			<hlm-alert-dialog-content *hlmAlertDialogPortal="let ctx">
				<hlm-alert-dialog-header>
					<hlm-alert-dialog-media>
						<ng-icon name="lucideCircleFadingPlus" />
					</hlm-alert-dialog-media>
					<h2 hlmAlertDialogTitle>Share this project?</h2>
					<p hlmAlertDialogDescription>Anyone with the link will be able to view and edit this project.</p>
				</hlm-alert-dialog-header>
				<hlm-alert-dialog-footer>
					<button hlmAlertDialogCancel>Cancel</button>
					<button hlmAlertDialogAction>Share</button>
				</hlm-alert-dialog-footer>
			</hlm-alert-dialog-content>
		</hlm-alert-dialog>
	`,
})
export class AlertDialogMedia {}
