import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideAlertCircle } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';

@Component({
	selector: 'spartan-alert-destructive',
	imports: [HlmAlertImports, NgIcon],
	providers: [provideIcons({ lucideAlertCircle })],
	template: `
		<hlm-alert variant="destructive" class="max-w-md">
			<ng-icon name="lucideAlertCircle" />
			<h4 hlmAlertTitle>Payment failed</h4>
			<p hlmAlertDescription>Your payment could not be processed. Please check your payment method and try again.</p>
		</hlm-alert>
	`,
})
export class AlertDestructive {}
