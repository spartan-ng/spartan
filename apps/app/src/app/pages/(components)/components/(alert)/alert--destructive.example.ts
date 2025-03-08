import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTriangleAlert } from '@ng-icons/lucide';
import {
	HlmAlertDescriptionDirective,
	HlmAlertDirective,
	HlmAlertIconDirective,
	HlmAlertTitleDirective,
} from '@spartan-ng/ui-alert-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';

@Component({
	selector: 'spartan-alert-destructive',
	imports: [
		HlmAlertDirective,
		HlmAlertDescriptionDirective,
		HlmAlertIconDirective,
		HlmAlertTitleDirective,
		NgIcon,
		HlmIconDirective,
	],
	providers: [provideIcons({ lucideTriangleAlert })],
	template: `
		<div hlmAlert variant="destructive">
			<ng-icon hlm hlmAlertIcon name="lucideTriangleAlert" />
			<h4 hlmAlertTitle>Unexpected Error</h4>
			<p hlmAlertDesc>Your session has expired. Please log in again.</p>
		</div>
	`,
})
export class AlertDestructiveComponent {}

export const destructiveCode = `
import { Component } from '@angular/core';
import {
  HlmAlertDescriptionDirective,
  HlmAlertDirective,
  HlmAlertIconDirective,
  HlmAlertTitleDirective,
} from '@spartan-ng/ui-alert-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { lucideTriangleAlert } from '@ng-icons/lucide';

@Component({
  selector: 'spartan-alert-destructive',
  standalone: true,
  imports: [
    HlmAlertDirective,
    HlmAlertDescriptionDirective,
    HlmAlertIconDirective,
    HlmAlertTitleDirective,
    HlmIconDirective,
  ],
  providers: [provideIcons({ lucideTriangleAlert })],
  template: \`
    <div hlmAlert variant="destructive">
      <ng-icon hlm hlmAlertIcon name="lucideTriangleAlert" />
      <h4 hlmAlertTitle>Unexpected Error</h4>
      <p hlmAlertDesc>Your session has expired. Please log in again.</p>
    </div>
  \`,
})
export class AlertDestructiveComponent {}
`;
