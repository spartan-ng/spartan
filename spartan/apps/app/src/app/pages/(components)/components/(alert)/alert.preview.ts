import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleAlert, lucideCircleCheck, lucidePopcorn } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmIcon } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-alert-preview',
	imports: [HlmAlertImports, NgIcon, HlmIcon],
	providers: [provideIcons({ lucideCircleCheck, lucidePopcorn, lucideCircleAlert })],
	host: {
		class: 'grid w-full max-w-xl items-start gap-4',
	},
	template: `
		<div hlmAlert>
			<ng-icon hlm hlmAlertIcon name="lucideCircleCheck" />
			<h4 hlmAlertTitle>Success! Your changes have been saved</h4>
			<p hlmAlertDescription>This is an alert with icon, title and description.</p>
		</div>
		<div hlmAlert>
			<ng-icon hlm hlmAlertIcon name="lucidePopcorn" />
			<h4 hlmAlertTitle>This Alert has a title and an icon. No description.</h4>
		</div>
		<div hlmAlert variant="destructive">
			<ng-icon hlm hlmAlertIcon name="lucideCircleAlert" />
			<h4 hlmAlertTitle>Unable to process your payment.</h4>
			<div hlmAlertDescription>
				<p>Please verify your billing information and try again.</p>
				<ul class="list-inside list-disc text-sm">
					<li>Check your card details</li>
					<li>Ensure sufficient funds</li>
					<li>Verify billing address</li>
				</ul>
			</div>
		</div>
	`,
})
export class AlertPreview {}

export const defaultImports = `
import { HlmAlertImports } from '@spartan-ng/helm/alert';
`;

export const defaultSkeleton = `
<div hlmAlert variant="default | destructive">
  <ng-icon hlm hlmAlertIcon name="lucideCircleCheck" />
  <h4 hlmAlertTitle>Success! Your changes have been saved</h4>
  <div hlmAlertDescription>This is an alert with icon, title and description.</div>
</div>
`;
