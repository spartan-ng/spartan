import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleCheck } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmIconDirective } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-alert-preview',
	imports: [HlmAlertImports, NgIcon, HlmIconDirective],
	providers: [provideIcons({ lucideCircleCheck })],
	template: `
		<div hlmAlert>
			<ng-icon hlm hlmAlertIcon name="lucideCircleCheck" />
			<h4 hlmAlertTitle>Success! Your changes have been saved</h4>
			<p hlmAlertDescription>This is an alert with icon, title and description.</p>
		</div>
	`,
})
export class AlertPreviewComponent {}

export const defaultImports = `
import {
  HlmAlertDescriptionDirective,
  HlmAlertDirective,
  HlmAlertIconDirective,
  HlmAlertTitleDirective,
} from '@spartan-ng/helm/alert';
`;

export const defaultSkeleton = `<div hlmAlert>
	<ng-icon hlm hlmAlertIcon name="lucideBox" />
	<h4 hlmAlertTitle>Introducing spartan/ui!</h4>
	<p hlmAlertDesc>
		spartan/ui is made up of unstyled UI providers, the spartan/ui/brain.<br />
		On top we add spartan/ui/helm(et) with shadcn-like styles.
	</p>
</div>`;
