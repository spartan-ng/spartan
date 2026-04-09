import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleCheck, lucideInfo } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmIcon } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-alert-preview',
	imports: [HlmAlertImports, NgIcon, HlmIcon],
	providers: [provideIcons({ lucideCircleCheck, lucideInfo })],
	template: `
		<div class="grid w-full max-w-md items-start gap-4">
			<hlm-alert>
				<ng-icon hlmIcon name="lucideCircleCheck" />
				<h4 hlmAlertTitle>Payment successful</h4>
				<p hlmAlertDescription>
					Your payment of $29.99 has been processed. A receipt has been sent to your email address.
				</p>
			</hlm-alert>
			<hlm-alert>
				<ng-icon hlmIcon name="lucideInfo" />
				<h4 hlmAlertTitle>New feature available</h4>
				<p hlmAlertDescription>We've added dark mode support. You can enable it in your account settings.</p>
			</hlm-alert>
		</div>
	`,
})
export class AlertPreview {}

export const defaultImports = `
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { NgIcon } from '@ng-icons/core';
`;

export const defaultSkeleton = `
<hlm-alert variant="default | destructive">
  <ng-icon hlmIcon name="lucideCircleCheck" />
  <h4 hlmAlertTitle>Heads up!</h4>
  <div hlmAlertDescription>You can add components and dependencies to your app using the cli.</div>
  <div hlmAlertAction>
    <button hlmBtn variant="outline" size="xs">Enable</button>
  </div>
</hlm-alert>
`;
