import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTriangleAlert } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmIconDirective } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-alert-destructive',
	imports: [HlmAlertImports, NgIcon, HlmIconDirective],
	providers: [provideIcons({ lucideTriangleAlert })],
	template: `
		<div hlmAlert variant="destructive">
			<ng-icon hlm hlmAlertIcon name="lucideTriangleAlert" />
			<h4 hlmAlertTitle>Unexpected Error</h4>
			<p hlmAlertDescription>Your session has expired. Please log in again.</p>
		</div>
	`,
})
export class AlertDestructiveComponent {}
