import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideAlertTriangle } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';

@Component({
	selector: 'spartan-alert-custom-colors',
	imports: [HlmAlertImports, NgIcon],
	providers: [provideIcons({ lucideAlertTriangle })],
	template: `
		<hlm-alert
			class="max-w-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50"
		>
			<ng-icon name="lucideAlertTriangle" />
			<h4 hlmAlertTitle>Your subscription will expire in 3 days.</h4>
			<p hlmAlertDescription>
				Renew now to avoid service interruption or upgrade to a paid plan to continue using the service.
			</p>
		</hlm-alert>
	`,
})
export class AlertCustomColors {}
